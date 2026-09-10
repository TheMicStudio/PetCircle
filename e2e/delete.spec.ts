import { request as playwrightRequest } from '@playwright/test';
import { createUser, expect, test } from './fixtures';
import { createComment, createPost, expectNoReload, markNoReload, postCard } from './helpers';

test.describe('S8 suppression', () => {
  test('supprime un post après confirmation, sans rechargement', async ({ page, user }) => {
    const post = await createPost(user, `À supprimer ${user.username}`);
    await page.goto('/feed');
    const card = postCard(page, post.content);
    await expect(card).toBeVisible();
    await markNoReload(page);

    await card.getByRole('button', { name: 'Supprimer ce post' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Supprimer ce post ?')).toBeVisible();
    await dialog.getByRole('button', { name: 'Supprimer' }).click();

    await expect(card).toHaveCount(0);
    await expectNoReload(page);
    const gone = await user.api.get(`/api/posts/${post.id}`);
    expect(gone.status()).toBe(404);
  });

  test('annuler la confirmation garde le post', async ({ page, user }) => {
    const post = await createPost(user, `Conservé ${user.username}`);
    await page.goto('/feed');
    const card = postCard(page, post.content);
    await card.getByRole('button', { name: 'Supprimer ce post' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Annuler' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(card).toBeVisible();
    const stillThere = await user.api.get(`/api/posts/${post.id}`);
    expect(stillThere.status()).toBe(200);
  });

  test('supprime un commentaire et met le compteur à jour', async ({ page, user }) => {
    const post = await createPost(user, `Commentaire supprimé ${user.username}`);
    await createComment(user, post.id, 'Commentaire condamné');
    await page.goto(`/posts/${post.id}`);
    await expect(page.getByText('Commentaire condamné')).toBeVisible();

    await page.getByRole('button', { name: 'Supprimer ce commentaire' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Supprimer' }).click();

    await expect(page.getByText('Commentaire condamné')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: '0 commentaire' })).toBeVisible();
  });

  test("affiche l'erreur si la suppression échoue", async ({ page, user }) => {
    const post = await createPost(user, `Suppression cassée ${user.username}`);
    await page.route(`**/api/posts/${post.id}`, (route) =>
      route.request().method() === 'DELETE'
        ? route.fulfill({ status: 500, json: { error: 'Suppression impossible' } })
        : route.continue(),
    );
    await page.goto('/feed');
    const card = postCard(page, post.content);
    await card.getByRole('button', { name: 'Supprimer ce post' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Supprimer' }).click();

    await expect(card.getByRole('alert')).toHaveText('Suppression impossible');
    await expect(card).toBeVisible();
  });

  test("le bouton supprimer n'apparaît pas sur le post d'un autre", async ({ page }) => {
    const other = await createUser('victim');
    try {
      const post = await createPost(other, `Pas à moi ${other.username}`);
      await page.goto(`/posts/${post.id}`);
      await expect(page.getByText(post.content)).toBeVisible();
      await expect(page.getByRole('button', { name: 'Supprimer ce post' })).toHaveCount(0);
    } finally {
      await other.api.dispose();
    }
  });

  test("l'API refuse une suppression forgée par un autre utilisateur", async ({ user }) => {
    const other = await createUser('forger');
    try {
      const post = await createPost(user, `Ciblé ${user.username}`);
      const commentId = await createComment(user, post.id, 'Commentaire ciblé');

      const forgedPost = await other.api.delete(`/api/posts/${post.id}`);
      expect(forgedPost.status()).toBe(403);
      const forgedComment = await other.api.delete(`/api/comments/${commentId}`);
      expect(forgedComment.status()).toBe(403);

      const stillThere = await user.api.get(`/api/posts/${post.id}`);
      expect(stillThere.status()).toBe(200);
    } finally {
      await other.api.dispose();
    }
  });

  test("l'API refuse une suppression sans session", async ({ user }) => {
    const post = await createPost(user, `Anonyme ${user.username}`);
    const anonymous = await playwrightRequest.newContext({ baseURL: 'http://localhost:5174' });
    try {
      const response = await anonymous.delete(`/api/posts/${post.id}`);
      expect(response.status()).toBe(401);
    } finally {
      await anonymous.dispose();
    }
  });
});
