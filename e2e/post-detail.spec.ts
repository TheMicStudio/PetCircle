import { expect, test } from './fixtures';
import { createComment, createPost, expectNoReload, markNoReload, postCard } from './helpers';

test.describe('S5 détail et commentaires', () => {
  test('ouvre un post depuis le fil', async ({ page, user }) => {
    const post = await createPost(user, `Depuis le fil ${user.username}`);
    await page.goto('/feed');
    await postCard(page, post.content).getByRole('link', { name: `Ouvrir le post de ${user.username}` }).click();

    await expect(page).toHaveURL(new RegExp(`/posts/${post.id}$`));
    await expect(page.getByText(post.content)).toBeVisible();
  });

  test('est accessible par URL directe', async ({ page, user }) => {
    const post = await createPost(user, `URL directe ${user.username}`, true);
    await page.goto(`/posts/${post.id}`);

    await expect(page.getByText(post.content)).toBeVisible();
    await expect(page.getByRole('article').getByRole('link', { name: user.username })).toBeVisible();
    await expect(page.locator('img[src^="/uploads/"]')).toBeVisible();
    await expect(page.locator('time[datetime]').first()).toBeVisible();
  });

  test('liste les commentaires et en ajoute un dynamiquement', async ({ page, user }) => {
    const post = await createPost(user, `Commenté ${user.username}`);
    await createComment(user, post.id, 'Premier commentaire');
    await page.goto(`/posts/${post.id}`);
    await expect(page.getByText('Premier commentaire')).toBeVisible();
    await expect(page.getByRole('heading', { name: '1 commentaire' })).toBeVisible();

    await markNoReload(page);
    const field = page.getByLabel('Écrire un commentaire');
    const send = page.getByRole('button', { name: 'Envoyer' });
    await expect(send).toBeDisabled();
    await field.fill('Deuxième commentaire');
    await expect(page.getByText(`${300 - 'Deuxième commentaire'.length} caractères restants`)).toBeVisible();
    await send.click();

    await expect(page.getByText('Deuxième commentaire')).toBeVisible();
    await expect(page.getByRole('heading', { name: '2 commentaires' })).toBeVisible();
    await expect(field).toHaveValue('');
    await expectNoReload(page);
  });

  test('montre un état vide sans commentaire', async ({ page, user }) => {
    const post = await createPost(user, `Silence ${user.username}`);
    await page.goto(`/posts/${post.id}`);
    await expect(page.getByText(/Aucun commentaire pour le moment/)).toBeVisible();
  });

  test('un post inexistant donne un 404 sans crash', async ({ page }) => {
    await page.goto('/posts/does-not-exist');
    await expect(page.getByRole('heading', { name: 'Post introuvable' })).toBeVisible();
    await page.getByRole('link', { name: 'Retour au fil' }).click();
    await expect(page).toHaveURL(/\/feed$/);
  });

  test('un post supprimé donne un 404', async ({ page, user }) => {
    const post = await createPost(user, `Éphémère ${user.username}`);
    const deleted = await user.api.delete(`/api/posts/${post.id}`);
    expect(deleted.status()).toBe(204);
    await page.goto(`/posts/${post.id}`);
    await expect(page.getByRole('heading', { name: 'Post introuvable' })).toBeVisible();
  });

  test("affiche l'erreur API du commentaire sans perdre le texte", async ({ page, user }) => {
    const post = await createPost(user, `Erreur commentaire ${user.username}`);
    await page.route('**/api/posts/*/comments', (route) =>
      route.request().method() === 'POST'
        ? route.fulfill({ status: 500, json: { error: 'Commentaire refusé' } })
        : route.continue(),
    );
    await page.goto(`/posts/${post.id}`);
    await page.getByLabel('Écrire un commentaire').fill('Va échouer');
    await page.getByRole('button', { name: 'Envoyer' }).click();

    await expect(page.getByRole('alert')).toHaveText('Commentaire refusé');
    await expect(page.getByLabel('Écrire un commentaire')).toHaveValue('Va échouer');
  });

  test("affiche l'erreur de chargement du post", async ({ page, user }) => {
    const post = await createPost(user, `Post cassé ${user.username}`);
    await page.route(`**/api/posts/${post.id}`, (route) =>
      route.fulfill({ status: 500, json: { error: 'Post indisponible' } }),
    );
    await page.goto(`/posts/${post.id}`);
    await expect(page.getByRole('alert')).toHaveText('Post indisponible');
  });

  test('le lien de retour ramène au fil', async ({ page, user }) => {
    const post = await createPost(user, `Retour ${user.username}`);
    await page.goto(`/posts/${post.id}`);
    await page.getByRole('link', { name: 'Retour au fil' }).click();
    await expect(page).toHaveURL(/\/feed$/);
  });
});
