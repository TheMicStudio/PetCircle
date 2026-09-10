import { createUser, expect, test } from './fixtures';
import { createPost, postCard } from './helpers';

test.describe('S7 profils', () => {
  test('mon profil montre mes publications et les actions du propriétaire', async ({ page, user }) => {
    const post = await createPost(user, `Sur mon profil ${user.username}`);
    await page.goto(`/profile/${user.id}`);

    await expect(page.getByRole('heading', { name: user.username, level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mes publications' })).toBeVisible();
    await expect(page.getByText('Modifier le profil')).toBeVisible();
    await expect(postCard(page, post.content).getByRole('button', { name: 'Supprimer ce post' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Suivre' })).toHaveCount(0);
  });

  test("le profil d'un autre cache les actions réservées", async ({ page }) => {
    const other = await createUser('other');
    try {
      const post = await createPost(other, `Post de ${other.username}`);
      await page.goto(`/profile/${other.id}`);

      await expect(page.getByRole('heading', { name: other.username, level: 1 })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Publications' })).toBeVisible();
      await expect(page.getByText('Modifier le profil')).toHaveCount(0);
      await expect(postCard(page, post.content)).toBeVisible();
      await expect(page.getByRole('button', { name: 'Supprimer ce post' })).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Suivre' })).toBeVisible();
    } finally {
      await other.api.dispose();
    }
  });

  test('suivre puis ne plus suivre depuis le profil', async ({ page }) => {
    const other = await createUser('followed');
    try {
      await page.goto(`/profile/${other.id}`);
      const follow = page.getByRole('button', { name: 'Suivre' });
      await follow.click();
      await expect(page.getByRole('button', { name: 'Abonné' })).toHaveAttribute('aria-pressed', 'true');
      await page.waitForResponse((response) => response.url().includes('/follow'));
      await page.reload();
      await expect(page.getByRole('button', { name: 'Abonné' })).toBeVisible();
      await page.getByRole('button', { name: 'Abonné' }).click();
      await expect(page.getByRole('button', { name: 'Suivre' })).toBeVisible();
      await page.waitForResponse((response) => response.url().includes('/follow'));
      await page.reload();
      await expect(page.getByRole('button', { name: 'Suivre' })).toBeVisible();
    } finally {
      await other.api.dispose();
    }
  });

  test('un utilisateur inexistant est géré', async ({ page }) => {
    await page.goto('/profile/does-not-exist');
    await expect(page.getByRole('heading', { name: 'Profil introuvable' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Retour au fil' })).toBeVisible();
  });

  test('un profil sans post montre un état vide', async ({ page, user }) => {
    await page.goto(`/profile/${user.id}`);
    await expect(page.getByText('Rien publié pour le moment')).toBeVisible();
  });

  test("l'erreur API du profil est affichée", async ({ page, user }) => {
    await page.route(`**/api/users/${user.id}`, (route) =>
      route.fulfill({ status: 500, json: { error: 'Profil indisponible' } }),
    );
    await page.goto(`/profile/${user.id}`);
    await expect(page.getByRole('alert')).toHaveText('Impossible de charger ce profil pour le moment.');
  });

  test("on atteint un profil depuis l'auteur d'un post du fil", async ({ page, user }) => {
    const post = await createPost(user, `Auteur ${user.username}`);
    await page.goto('/feed');
    await postCard(page, post.content).locator('a[href^="/profile/"]').click();
    await expect(page).toHaveURL(new RegExp(`/profile/${user.id}$`));
    await expect(page.getByRole('heading', { name: 'Mes publications' })).toBeVisible();
  });

  test("l'en-tête mène à mon profil", async ({ page, user }) => {
    await page.goto('/feed');
    await page.getByRole('banner').getByRole('link', { name: user.username }).click();
    await expect(page).toHaveURL(new RegExp(`/profile/${user.id}$`));
  });
});
