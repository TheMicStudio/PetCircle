# Audit — PetCircle Backend

Revue du socle avant livraison. Périmètre : `src/index.ts`, `src/auth.ts`, `src/routes.ts`, `prisma/schema.prisma`, `tsconfig.json`.
Base auditée : 50 utilisateurs, 500 posts, 1 286 commentaires, 6 516 likes.

| Sujet | Gravité | Bloquant |
|:--|:--|:--:|
| 1. Routes de lecture sans authentification | Critique | oui |
| 2. Suppression sans contrôle du propriétaire | Critique | oui |
| 3. Le hash du mot de passe part au client | Critique | oui |
| 4. Tokens sans expiration, secret par défaut | Critique | oui |
| 5. Upload sans limite ni filtre | Critique | oui |
| 6. CORS ouvert, aucun en-tête de sécurité | Majeur | oui |
| 7. Aucun rate limit sur l'authentification | Majeur | oui |
| 8. Le feed ne tient pas à 500 posts | Critique | oui |
| 9. Aucun index en base | Majeur | oui |
| 10. Les erreurs sont renvoyées en 200 | Majeur | oui |
| 11. Aucune gestion d'erreur ni validation | Majeur | oui |
| 12. Double-clic, doublons créés | Majeur | oui |
| 13. Likes sans contrainte d'unicité | Majeur | oui |
| 14. `strict` désactivé, 6 erreurs masquées | Majeur | oui |
| 15. Types de retour et DTO absents | Mineur | non |
| 16. Nommage incohérent | Mineur | non |
| 17. Aucune documentation d'API | Mineur | non |
| 18. Tout est empilé dans `routes.ts` | Majeur | non |

---

## Sécurité

### 1. Routes de lecture sans authentification

```ts
// src/routes.ts
router.get("/posts", getPosts);
router.get("/posts/:id", getPostById);
router.get("/users/:id", fetch_user);
router.get("/users/:id/posts", getUserPosts);
```

Le middleware existe et il est appliqué juste à côté sur les routes d'écriture. Sans compte, on aspire tout le contenu et l'annuaire utilisateurs.

**Correction** : ajouter `authenticate` sur ces quatre routes.

**Fait.** Les routes de lecture (`/posts`, `/posts/:id`, `/posts/:postId/comments`, `/users/:id`, `/users/:id/posts`) passent toutes par `authenticate` : 401 sans cookie, 401 avec un jeton invalide. Reste ouvert : `/uploads` est servi par `express.static` sans contrôle, une URL d'image connue reste accessible à un anonyme.

### 2. Suppression sans contrôle du propriétaire

```ts
// src/routes.ts
async function deletePost(req: Request<{ id: string }>, res: Response) {
  const { id } = req.params;
  await prisma.post.delete({ where: { id } });   // aucun filtre sur authorId
  res.json({ success: true });
}

// même chose sur DELETE /comments/:id
await prisma.comment.delete({ where: { id } });
```

`authenticate` répond à « qui es-tu », jamais à « as-tu le droit ». N'importe quel compte connecté supprime le contenu d'un autre.

**Correction** : charger la ressource, comparer `authorId` à l'utilisateur du token, 404 si absente et 403 si elle appartient à quelqu'un d'autre.

### 3. Le hash du mot de passe part au client

```ts
// src/routes.ts
prisma.user.findUnique({ where: { id } }).then((user) => {
  res.json(user);   // hash bcrypt, email et rôle inclus
});
```

La même fuite se reproduit deux fois dans le détail d'un post, sur l'auteur et sur celui de chaque commentaire :

```ts
// src/routes.ts
include: {
  author: true,                    // User complet
  comments: { include: { author: true } },   // User complet, à chaque commentaire
}
```

**Correction** : `select` explicite partout, aucun modèle Prisma renvoyé tel quel.

### 4. Tokens sans expiration, secret par défaut

```ts
// src/auth.ts
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// generate a token for a user, no expiration
export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET);
}
```

Un token volé reste valable indéfiniment. Et si la variable d'environnement manque, l'application démarre avec un secret public, donc des tokens forgeables. Le commentaire assume l'absence d'expiration, c'est un choix à reprendre plutôt qu'un oubli.

**Correction** : `expiresIn` court avec refresh token, et arrêt au démarrage si `JWT_SECRET` est absent.

### 5. Upload sans limite ni filtre

```ts
// src/routes.ts
filename: (req, file, cb) => {
  cb(null, `${Date.now()}-${file.originalname}`);   // nom client non assaini
},
const upload = multer({ storage });                 // ni limits, ni fileFilter

// src/index.ts
app.use("/uploads", express.static(uploadsDir));    // tout ce qui monte est servi
```

**Correction** : plafond de taille, allow-list de types MIME, nom généré côté serveur avec extension validée.

### 6. CORS ouvert, aucun en-tête de sécurité

```ts
// src/index.ts
app.use(cors());            // Access-Control-Allow-Origin: *
app.use(express.json());    // aucune limite de payload
```

Pas de `helmet` non plus, donc ni CSP, ni HSTS, ni `nosniff`, ni `X-Frame-Options`.

**Correction** : origine restreinte par variable d'environnement, `helmet`, JSON borné.

### 7. Aucun rate limit sur l'authentification

`/auth/login` et `/auth/register` acceptent un nombre illimité de tentatives, aucune dépendance de limitation n'est installée. Brute-force et énumération de comptes gratuits.

**Correction** : limiteur strict sur `/auth/*` par IP et par email, limiteur large sur le reste.

---

## Volumétrie

### 8. Le feed ne tient pas à 500 posts

```ts
// src/routes.ts
const posts = await prisma.post.findMany({
  orderBy: { createdAt: "desc" },   // pas de take, pas de skip, pas de cursor
});

for (const post of posts) {
  const author = await prisma.user.findUnique({ where: { id: post.authorId } });
  const likeCount = await prisma.like.count({ where: { postId: post.id } });
  const commentCount = await prisma.comment.count({ where: { postId: post.id } });
  feed.push({ ... });
}

res.json(feed);                     // tableau nu de 500 objets
```

Sur la base réelle : **1 + 500 × 3 = 1 501 requêtes séquentielles** par appel, dont 450 redondantes puisqu'il n'y a que 50 auteurs distincts.

Le format de réponse pose un second problème. Un tableau JSON brut n'a pas de place pour un curseur ou un total, la pagination ne pourra donc pas être ajoutée plus tard sans casser le client. Le détail d'un post charge tous ses commentaires d'un coup, et `getUserPosts` n'est pas paginé non plus.

**Correction** : une seule requête avec `include` sur l'auteur et `_count` sur les likes et commentaires, pagination par curseur avec limite plafonnée, réponse enveloppée.

```ts
{ "data": [ ... ], "nextCursor": "clx...", "hasMore": true }
```

### 9. Aucun index en base

```prisma
// prisma/schema.prisma
model Like {
  id     String @id @default(cuid())
  postId String        // 6 516 lignes, aucun index
  userId String
}
```

Le seul index du schéma est celui de l'email. Manquent aussi `Post.createdAt` qui trie le feed entier, `Post.authorId` et `Comment.postId`.

**Correction** : `@@index([createdAt])` et `@@index([authorId])` sur `Post`, `@@index([postId])` sur `Like` et `Comment`.

---

## Fiabilité

### 10. Les erreurs sont renvoyées en 200

```ts
// src/routes.ts
return res.status(200).json({ error: "Email already used" });   // attendu : 409
return res.status(200).json({ error: "Invalid credentials" });  // attendu : 401
return res.status(200).json({ error: "Like not found" });       // attendu : 404
```

La création d'un compte réussie répond elle aussi en 200 au lieu de 201. Le client ne peut pas distinguer un succès d'un échec sans inspecter le corps.

**Correction** : correspondance unique (400 validation, 401 auth, 403 ownership, 404 absent, 409 conflit) appliquée par un handler d'erreur central.

### 11. Aucune gestion d'erreur ni validation

```ts
// src/routes.ts — le corps de requête n'est jamais vérifié
const { email, username, password } = req.body;
const hashed = bcrypt.hashSync(password, 10);   // password undefined fait tomber la route

// src/routes.ts — post peut être null, aucun garde-fou
const post = await prisma.post.findUnique({ where: { id }, include: { ... } });
res.json({ id: post.id, ... });                 // id inconnu, TypeError, 500
```

Pas un seul `try/catch`, aucun middleware d'erreur, aucune validation d'entrée. Le premier imprévu remonte en page HTML Express avec la stack trace. Le reste suit le même schéma : suppression d'un id inexistant, commentaire sur un post supprimé, `.then()` sans `.catch()` dans `fetch_user`, et aucun handler d'erreur en fin de `index.ts`.

**Correction** : validation en tête de chaque route, wrapper asynchrone sur les handlers, middleware d'erreur central qui journalise et renvoie un JSON normalisé.

### 12. Double-clic, doublons créés

```ts
// src/routes.ts
async function handleCreatePost(req: Request, res: Response) {
  const { content } = req.body;
  const post = await prisma.post.create({ data: { content, imageUrl, authorId: userId } });
  res.json(post);
}
```

Deux clics rapides sur « Publier » envoient deux requêtes et créent deux posts identiques. Rien ne bloque la seconde. Commentaires et likes sont exposés de la même façon.

**Correction** : en-tête `Idempotency-Key` généré par le client, stocké avec sa réponse. La première requête crée, les suivantes rejouent la même réponse sans réécrire.

### 13. Likes sans contrainte d'unicité

```prisma
// prisma/schema.prisma
model Like {
  id     String @id @default(cuid())
  postId String
  userId String
}                       // pas de @@unique([postId, userId])
```

```ts
// src/routes.ts
const like = await prisma.like.create({ data: { postId: id, userId } });  // aucune vérification
```

Un utilisateur peut liker le même post autant de fois qu'il veut, ce qui fausse directement le compteur affiché dans le feed.

**Correction** : `@@unique([postId, userId])` avec sa migration, et `upsert` côté route.

---

## Typage et qualité

### 14. `strict` désactivé, 6 erreurs masquées

```json
// tsconfig.json
"strict": false
```

```
$ npx tsc --noEmit --strict

src/routes.ts(143,9): error TS18047: 'post' is possibly 'null'.
src/routes.ts(144,14): error TS18047: 'post' is possibly 'null'.
src/routes.ts(145,15): error TS18047: 'post' is possibly 'null'.
src/routes.ts(146,16): error TS18047: 'post' is possibly 'null'.
src/routes.ts(147,13): error TS18047: 'post' is possibly 'null'.
src/routes.ts(148,15): error TS18047: 'post' is possibly 'null'.

Found 6 errors.
```

Les six pointent le même bug réel, celui du point 11 : un id inconnu sur `/posts/:id` renvoie un 500.

**Correction** : passer `strict` à `true` et traiter les six erreurs, ce qui revient à ajouter le 404 manquant.

### 15. Types de retour et DTO absents

```ts
// src/auth.ts
export function authenticate(req: Request, res: Response, next: NextFunction) {

// src/routes.ts
async function getPosts(req: Request, res: Response) {
async function handleCreatePost(req: Request, res: Response) {

// répété dans quatre handlers : le cast désactive le typage là où il compte
const userId = (req as any).userId;
```

Aucune fonction ne déclare ce qu'elle renvoie, et les objets de réponse sont construits à la main dans chaque handler sans type partagé.

**Correction** : types de retour explicites, extension de l'interface `Request` d'Express pour supprimer les `as any`, et DTO partagés.

```ts
export type PostSummary = {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: { id: string; username: string } | null;
  likeCount: number;
  commentCount: number;
};
```

### 16. Nommage incohérent

```ts
// src/routes.ts — le même champ, deux noms selon la route
feed.push({ ..., created_at: post.createdAt });   // feed
res.json({ ..., createdAt: post.createdAt });     // détail d'un post

function fetch_user(...)              // snake_case
async function getUserPosts(...)      // camelCase
async function handleCreatePost(...)  // préfixe handle, isolé
```

Un client qui affiche une date doit gérer les deux cas. Les routes auth sont écrites en `.then()/.catch()` quand tout le reste est en `async/await`.

**Correction** : camelCase dans le code, `createdAt` dans les payloads, une seule convention de handler, `async/await` exclusivement.

### 17. Aucune documentation d'API

Le `README.md` fait six lignes et ne couvre que l'installation : aucune route décrite, aucun code d'erreur, aucun schéma OpenAPI. Le fichier `requests.http` contient encore neuf `REPLACE_ME`.

**Correction** : OpenAPI généré depuis les schémas de validation du point 11, README listant les routes, les codes de retour et le flux d'authentification.

---

## Architecture

### 18. Tout est empilé dans `routes.ts`

```ts
// src/routes.ts — 266 lignes, quatre responsabilités mélangées
const prisma = new PrismaClient();            // accès base dans un fichier de routes
const upload = multer({ storage });           // infrastructure d'upload
const hashed = bcrypt.hashSync(password, 10); // règle métier dans la couche transport
router.post("/posts/:id/like", authenticate, async (req, res) => { ... });  // handler anonyme
```

Découpage avec une semaine de plus :

```
src/
├── config/
│   ├── env.ts             validation des variables d'environnement au démarrage
│   └── prisma.ts          client Prisma unique
├── middlewares/
│   ├── authenticate.ts    vérification du token
│   ├── ownership.ts       contrôle du propriétaire            (point 2)
│   ├── rateLimit.ts       limiteurs auth et global            (point 7)
│   ├── upload.ts          multer durci                        (point 5)
│   ├── validate.ts        validation des entrées
│   └── errorHandler.ts    handler d'erreur central       (points 10, 11)
├── modules/
│   ├── auth/              routes, service, schema
│   ├── posts/             routes, service, repository, dto
│   ├── comments/
│   ├── likes/
│   └── users/
├── shared/
│   ├── types.ts           DTO partagés                       (point 15)
│   ├── httpError.ts       erreur typée vers code HTTP
│   └── pagination.ts      curseur réutilisable                (point 8)
├── routes.ts              montage des routers uniquement
└── index.ts               démarrage du serveur
```

Règle de dépendance : `routes` appelle `service`, `service` appelle `repository`. Une route ne touche jamais Prisma, un service ne connaît ni `req` ni `res`.

Dans la foulée, par priorité : tests d'intégration sur l'authentification, l'ownership et la pagination, logs structurés avec identifiant de requête à la place des `console.log`, refresh tokens et révocation, CI bloquante sur le typage et les tests, puis migration vers PostgreSQL que la concurrence en écriture finira par exiger.

---

## Cadre de refactoring

Le périmètre reste limité aux failles de sécurité, aux bloqueurs de socle et au code touché pour livrer.

**Traité.** Les points 1 à 7 sont exploitables en production. Les points 8 et 9 sont des bloqueurs de socle : le feed ne tient pas à la volumétrie annoncée. Les points 10 à 13 rendent le contrat HTTP inutilisable côté client et laissent passer des données incohérentes. Le point 14 révèle un 500 réel. Les points 15 à 17 ne sont repris que sur les fichiers déjà modifiés par les corrections ci-dessus.

**Documenté, non exécuté.** Le découpage complet du point 18 est une réécriture large qui sort du cadre, le plan est fourni pour la suite. La migration vers PostgreSQL relève d'une décision d'infrastructure et la suite de tests complète d'un chantier dédié. Le modèle `Follow` n'avait aucune route au moment de l'audit ; elles ont été ajoutées depuis avec le défi follow (`POST`/`DELETE /users/:id/follow`, contrainte `@@unique([followerId, followingId])`). Le seed et les scripts ne sont pas exposés aux clients.

---

18 sujets, 14 bloquants pour la livraison, 4 documentés pour la suite.
