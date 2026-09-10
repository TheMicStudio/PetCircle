import { createUser, expect, guestTest, PASSWORD, test, uniqueName } from './fixtures';
import { fillLogin, fillRegister, likeButton, postCard, postCards } from './helpers';
import { createPost } from './helpers';

guestTest.describe('S1 inscription', () => {
  guestTest('crée un compte et arrive sur le fil', async ({ page }) => {
    const username = uniqueName('signup');
    await page.goto('/auth?mode=signup');
    await fillRegister(page, username, `${username}@e2e.test`, PASSWORD);

    await expect(page).toHaveURL(/\/feed$/);
    await expect(page.getByRole('banner').getByText(username)).toBeVisible();
  });

  guestTest('valide les champs côté front avant tout appel API', async ({ page }) => {
    await page.goto('/auth?mode=signup');
    let posted = false;
    await page.route('**/api/auth/register', (route) => {
      posted = true;
      return route.continue();
    });
    await fillRegister(page, 'ab', 'valide@e2e.test', 'court');

    await expect(page.getByText('Minimum 3 caractères')).toBeVisible();
    await expect(page.getByText('Minimum 8 caractères')).toBeVisible();
    expect(posted).toBe(false);
    await expect(page).toHaveURL(/\/auth\?mode=signup$/);
  });

  guestTest('affiche une erreur API champ par champ', async ({ page }) => {
    const existing = await createUser('taken');
    try {
      await page.goto('/auth?mode=signup');
      await fillRegister(page, uniqueName('dup'), existing.email, PASSWORD);
      await expect(page.getByText('Cet email est déjà utilisé')).toBeVisible();
      await expect(page).toHaveURL(/\/auth\?mode=signup$/);
    } finally {
      await existing.api.dispose();
    }
  });

  guestTest("le mot de passe n'est jamais renvoyé par l'API", async ({ request }) => {
    const username = uniqueName('secret');
    const registered = await request.post('/api/auth/register', {
      data: { username, email: `${username}@e2e.test`, password: PASSWORD },
    });
    expect(registered.status()).toBe(201);
    expect(await registered.text()).not.toContain('password');

    const me = await request.get('/api/auth/me');
    expect(me.status()).toBe(200);
    expect(await me.text()).not.toContain('password');
  });

  guestTest('masque le mot de passe et propose de le révéler', async ({ page }) => {
    await page.goto('/auth?mode=signup');
    const field = page.getByLabel('Mot de passe', { exact: true });
    await expect(field).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: 'Afficher le mot de passe' }).click();
    await expect(field).toHaveAttribute('type', 'text');
  });

  guestTest('propose un lien vers la connexion', async ({ page }) => {
    await page.goto('/auth?mode=signup');
    await page.getByRole('link', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole('heading', { name: 'Bon retour' })).toBeVisible();
    await page.getByRole('link', { name: 'Créer un compte' }).click();
    await expect(page.getByRole('heading', { name: 'Créer un compte' })).toBeVisible();
  });
});

guestTest.describe('S2 connexion', () => {
  guestTest('se connecte et redirige vers le fil', async ({ page }) => {
    const account = await createUser('login');
    try {
      await page.goto('/auth');
      await fillLogin(page, account.email, account.password);
      await expect(page).toHaveURL(/\/feed$/);
      await expect(page.getByRole('banner').getByText(account.username)).toBeVisible();
    } finally {
      await account.api.dispose();
    }
  });

  guestTest('refuse un mauvais mot de passe sans quitter la page', async ({ page }) => {
    const account = await createUser('badpass');
    try {
      await page.goto('/auth');
      await fillLogin(page, account.email, 'mauvais-mot-de-passe');
      await expect(page.getByRole('alert')).toBeVisible();
      await expect(page).toHaveURL(/\/auth$/);
    } finally {
      await account.api.dispose();
    }
  });

  guestTest('une route protégée sans session redirige vers /auth', async ({ page }) => {
    await page.goto('/feed');
    await expect(page).toHaveURL(/\/auth$/);
    await page.goto('/profile/whoever');
    await expect(page).toHaveURL(/\/auth$/);
  });

  guestTest('un token invalide déconnecte et redirige sans boucle', async ({ page, context }) => {
    await context.addCookies([{ name: 'token', value: 'not-a-jwt', url: 'http://localhost:5174' }]);
    await page.goto('/feed');
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole('heading', { name: 'Bon retour' })).toBeVisible();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/auth$/);
  });

  guestTest('une requête API sans session reçoit un 401', async ({ request }) => {
    const response = await request.get('/api/posts');
    expect(response.status()).toBe(401);
  });
});

test.describe('S2 session', () => {
  test('la session survit à un rechargement', async ({ page, user }) => {
    await page.goto('/feed');
    await expect(page.getByRole('banner').getByText(user.username)).toBeVisible();
    await page.reload();
    await expect(page).toHaveURL(/\/feed$/);
    await expect(page.getByRole('banner').getByText(user.username)).toBeVisible();
  });

  test('un utilisateur connecté ne revoit pas la page de connexion', async ({ page }) => {
    await page.goto('/auth');
    await expect(page).toHaveURL(/\/feed$/);
  });

  test("la déconnexion renvoie vers /auth et coupe l'accès", async ({ page }) => {
    await page.goto('/feed');
    await expect(postCards(page).first()).toBeVisible();
    await page.getByRole('button', { name: 'Se déconnecter' }).click();
    await expect(page).toHaveURL(/\/auth$/);
    await page.goto('/feed');
    await expect(page).toHaveURL(/\/auth$/);
  });

  test('un 401 en cours de session déconnecte proprement', async ({ page, user }) => {
    const post = await createPost(user, `Session ${user.username}`);
    await page.route('**/api/posts/*/like', (route) =>
      route.fulfill({ status: 401, json: { error: 'Invalid token' } }),
    );
    await page.goto(`/posts/${post.id}`);
    await likeButton(page).click();
    await expect(page).toHaveURL(/\/auth$/);
    await expect(postCard(page, post.content)).toHaveCount(0);
  });
});
