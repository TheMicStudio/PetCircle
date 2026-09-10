import { expect, readNumber, test } from './fixtures';
import { createPost, likeButton, postCard } from './helpers';

test.describe('S6 like / unlike', () => {
  test("réagit à l'écran avant la réponse du serveur", async ({ page, user }) => {
    const post = await createPost(user, `Like lent ${user.username}`);
    await page.route('**/api/posts/*/like', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.continue();
    });
    await page.goto(`/posts/${post.id}`);
    await expect(page.getByText('0 patte', { exact: true })).toBeVisible();

    const started = Date.now();
    await likeButton(page).click();
    await expect(page.getByText('1 patte', { exact: true })).toBeVisible();
    await expect(likeButton(page)).toHaveAttribute('aria-pressed', 'true');
    expect(Date.now() - started).toBeLessThan(1500);

    await page.waitForResponse((response) => response.url().includes('/like'));
    await expect(page.getByText('1 patte', { exact: true })).toBeVisible();
  });

  test('unlike remet le compteur et persiste après rechargement', async ({ page, user }) => {
    const post = await createPost(user, `Toggle ${user.username}`);
    await page.goto(`/posts/${post.id}`);

    await likeButton(page).click();
    await page.waitForResponse((response) => response.url().includes('/like'));
    await page.reload();
    await expect(likeButton(page)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('1 patte', { exact: true })).toBeVisible();

    await likeButton(page).click();
    await expect(page.getByText('0 patte', { exact: true })).toBeVisible();
    await page.waitForResponse((response) => response.url().includes('/like'));
    await page.reload();
    await expect(likeButton(page)).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByText('0 patte', { exact: true })).toBeVisible();
  });

  test("revient en arrière avec un message si l'API échoue", async ({ page, user }) => {
    const post = await createPost(user, `Like cassé ${user.username}`);
    await page.route('**/api/posts/*/like', (route) =>
      route.fulfill({ status: 500, json: { error: 'Like impossible' } }),
    );
    await page.goto(`/posts/${post.id}`);
    await likeButton(page).click();
    await expect(page.getByText('1 patte', { exact: true })).toBeVisible();

    await expect(page.getByText('Like impossible')).toBeVisible();
    await expect(page.getByText('0 patte', { exact: true })).toBeVisible();
    await expect(likeButton(page)).toHaveAttribute('aria-pressed', 'false');
  });

  test('un seul like par utilisateur, garanti côté back', async ({ user }) => {
    const post = await createPost(user, `Double like ${user.username}`);
    const first = await user.api.post(`/api/posts/${post.id}/like`);
    expect(first.ok()).toBe(true);
    const second = await user.api.post(`/api/posts/${post.id}/like`);
    expect(second.status()).toBeLessThan(500);

    const detail = await user.api.get(`/api/posts/${post.id}`);
    const body: unknown = await detail.json();
    expect(readNumber(body, 'likeCount')).toBe(1);
  });

  test('liker depuis le fil se retrouve dans le détail', async ({ page, user }) => {
    const post = await createPost(user, `Partout ${user.username}`);
    await page.goto('/feed');
    const card = postCard(page, post.content);
    await expect(card).toBeVisible();

    await likeButton(card).click();
    await expect(card.getByText('1 patte', { exact: true })).toBeVisible();
    await page.waitForResponse((response) => response.url().includes('/like'));

    await page.goto(`/posts/${post.id}`);
    await expect(likeButton(page)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText('1 patte', { exact: true })).toBeVisible();
  });
});
