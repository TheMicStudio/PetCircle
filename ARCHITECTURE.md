# Architecture — où mettre quoi

Ce document décrit l'organisation du dépôt et la règle qui décide de l'emplacement
de chaque nouveau fichier. Il vaut pour le back comme pour le front.

## Vue d'ensemble

```text
PetCircle/
├── backend/            API Node + Express + Prisma (fournie, à découper story par story)
│   ├── prisma/         schéma, migrations, seed
│   ├── public/         images de seed servies en statique
│   ├── uploads/        images envoyées par les utilisateurs (jamais commitées)
│   └── src/
│       ├── index.ts    démarrage du serveur
│       ├── routes.ts   toute l'API, à vider progressivement
│       ├── auth.ts     JWT et middleware d'authentification
│       ├── config/     lecture des variables d'environnement
│       ├── lib/        clients partagés (instance Prisma)
│       ├── middleware/ authentification, upload, gestion d'erreurs
│       ├── modules/    un dossier par domaine métier
│       └── types/      déclarations de types globales
└── frontend/           React 19 + TypeScript + Vite
    ├── index.html
    ├── vite.config.ts  proxy de développement vers l'API
    └── src/
        ├── main.tsx    thème Astryx + routeur
        ├── App.tsx     déclaration des routes
        ├── features/   un dossier par domaine fonctionnel
        └── shared/     code réutilisable hors d'une feature
```

## Backend

### Un domaine = un module = trois fichiers

Chaque dossier de `src/modules/` porte un domaine : `auth`, `posts`, `comments`,
`likes`, `users`. À l'intérieur, les responsabilités sont séparées en trois
fichiers dont les noms ne changent jamais.

| Fichier | Rôle | Ne fait jamais |
| --- | --- | --- |
| `<domaine>.routes.ts` | déclare les URLs et branche les middlewares | de logique métier |
| `<domaine>.controller.ts` | valide l'entrée, choisit le code HTTP, renvoie le JSON | d'appel Prisma |
| `<domaine>.service.ts` | logique métier et accès base de données | de référence à `req` / `res` |

Un `<domaine>.types.ts` s'ajoute dès qu'un type sert à plus d'un fichier.

Le service ignore qu'il est appelé par une API : c'est ce qui le rend testable
sans démarrer de serveur, et ce qui satisfait la contrainte « une classe = une
responsabilité, ~150 lignes » du sujet.

### Les dossiers de support

- `config/` — tout ce qui vient de l'environnement. Aucun `process.env` ailleurs.
- `lib/` — les clients instanciés une seule fois, à commencer par Prisma.
- `middleware/` — ce qui entoure une requête : vérification du token, upload, formatage des erreurs.
- `types/` — déclarations globales, par exemple l'utilisateur attaché à `Request`.

La dépendance va toujours dans le même sens : un module importe du support, le
support n'importe jamais un module.

### Migration depuis le code existant

Toute l'API vit encore dans `src/routes.ts`, et `src/auth.ts` porte le JWT. On ne
découpe pas d'un bloc : quand une story touche un domaine, on extrait ce domaine
dans son module et on retire le code correspondant. Le sujet limite d'ailleurs le
refactoring à trois cas — une faille de sécurité, un blocage de story, ou du code
qu'on modifie de toute façon pour livrer.

## Frontend

### Stack installée

| Outil | Version | Rôle |
| --- | --- | --- |
| React / React DOM | 19.2 | socle, requis par Astryx |
| Vite | 8 | serveur de dev et build |
| TypeScript | 6 | typage strict |
| React Router | 7 | routage des stories |
| `@astryxdesign/core` | 0.5 | composants et tokens |
| `@astryxdesign/theme-neutral` | 0.5 | thème appliqué |
| `@stylexjs/stylex` | 0.19 | styles propres au projet |
| oxlint | 1.79 | lint, fourni par le template Vite |

Commandes : `npm run dev` (port 5173), `npm run build`, `npm run lint`.

### La feature d'abord

Ce qui change ensemble vit ensemble, et se supprime ensemble. Un domaine
rassemble sa page, ses composants, son état et ses appels API dans un dossier.

```text
src/features/posts/
├── posts.api.ts      appels HTTP et types de réponse
├── usePosts.ts       état, chargement, pagination
├── FeedPage.tsx      la page et ses quatre états UI
└── PostCard.tsx      l'affichage d'un post
```

L'ordre des maillons ne change pas : un composant appelle un hook, un hook appelle
le fichier `.api.ts`. Un composant ne fait jamais d'appel réseau directement, ce
qui permet de traiter `loading`, `error`, `empty` et `success` à un seul endroit.

Features prévues : `auth` (inscription, connexion, session), `posts` (feed,
détail, création, commentaires, likes), `profile` (profil personnel et profil
d'un autre utilisateur).

### `shared/`, et rien d'autre dedans

Une seule question décide : ce code a-t-il du sens en dehors de cette feature ?

- `shared/api/` — le client HTTP : ajout du token, lecture des erreurs, déconnexion sur 401.
- `shared/components/` — briques sans métier, uniquement si Astryx n'a pas l'équivalent.
- `shared/hooks/` — hooks génériques, par exemple un debounce.
- `shared/types/` — types partagés entre plusieurs features.
- `shared/styles/` — `index.css`, qui importe le reset, les composants et le thème Astryx.

Une carte de post reste dans `posts/`, même utilisée deux fois : elle porte du métier.

### Routage et point d'entrée

`main.tsx` monte l'application, applique le thème Astryx et ouvre le routeur.
`App.tsx` ne contient que la table des routes. Une page vit dans sa feature, pas
dans `App.tsx`.

### Astryx : ne pas deviner l'API

Les composants s'importent un par un, par exemple `import {Button} from
'@astryxdesign/core/Button'`. Avant d'utiliser un composant, lire sa vraie
documentation plutôt que supposer ses props :

```bash
npx astryx component --list        # tous les composants
npx astryx component Button        # props, variantes, exemples
npx astryx docs tokens             # espacements, couleurs, rayons
```

Les styles propres au projet utilisent les tokens (`var(--spacing-4)`,
`var(--color-text-primary)`), jamais des valeurs en dur : c'est ce qui garde le
rendu cohérent avec le thème, en clair comme en sombre.

### Parler à l'API

Le back sert ses routes à la racine, donc `vite.config.ts` proxifie `/auth`,
`/posts`, `/users`, `/comments`, `/uploads` et `/seed-images` vers
`http://localhost:3000`. Côté code, les appels utilisent des chemins relatifs
(`/posts`), sans URL absolue ni variable d'environnement.

### La règle qui empêche la structure de pourrir

Une feature n'importe jamais l'intérieur d'une autre feature. Si `profile/` doit
afficher des posts, soit le composant remonte dans `shared/components/`, soit
`posts/` expose explicitement ce qu'il partage.

## Exemple complet : la story du feed

| Étape | Fichier |
| --- | --- |
| Déclarer `GET /posts` | `backend/src/modules/posts/posts.routes.ts` |
| Lire la pagination, renvoyer le JSON | `backend/src/modules/posts/posts.controller.ts` |
| Requêter Prisma, trier, compter | `backend/src/modules/posts/posts.service.ts` |
| Appeler l'endpoint et typer la réponse | `frontend/src/features/posts/posts.api.ts` |
| Gérer la liste et la page suivante | `frontend/src/features/posts/usePosts.ts` |
| Afficher les quatre états | `frontend/src/features/posts/FeedPage.tsx` |

## Conventions

- Noms de fichiers en anglais, cohérents entre le front et le back.
- Composants en `PascalCase.tsx`, hooks en `useQuelqueChose.ts`, le reste en `camelCase.ts`.
- Un dossier vide est tenu par un `.gitkeep`, à supprimer dès qu'un vrai fichier arrive.
- Pas de `any`, pas de `as` pour faire taire le compilateur : `unknown` puis vérification.
- Une branche par story (`feat/s3-feed`), aucun commit direct sur `main`.

## Démarrer

```bash
cd backend && npm run dev     # API sur http://localhost:3000
cd frontend && npm run dev    # interface sur http://localhost:5173
```

## Ce qui reste à faire

L'`AUDIT.md` demandé par le sujet avant les premières pages, puis le client HTTP
dans `shared/api/` et la gestion de session, qui conditionnent toutes les stories.
