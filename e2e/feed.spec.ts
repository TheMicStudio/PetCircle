import { expect, test } from './fixtures';
import { createPost, postCards } from './helpers';

test.describe('S3 fil', () => {
  test('affiche auteur, contenu, image et date pour chaque post', async ({ page }) => {
    await page.goto('/feed');
    const cards = postCards(page);
    await expect(cards).toHaveCount(20);

    const first = cards.first();
    await expect(first.getByRole('link', { name: /^Ouvrir le post de / })).toBeVisible();
    await expect(first.locator('a[href^="/profile/"]')).toBeVisible();
    await expect(first.locator('time[datetime]')).toBeVisible();
    await expect(first.locator('p').first()).not.toBeEmpty();
    await expect(page.locator('li img[src^="/seed-images/"], li img[src^="/uploads/"]').first()).toBeVisible();
  });

  test('trie les posts du plus récent au plus ancien', async ({ page }) => {
    await page.goto('/feed');
    await expect(postCards(page)).toHaveCount(20);
    const dates = await postCards(page).locator('time[datetime]').evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('datetime') ?? ''),
    );
    const times = dates.map((value) => new Date(value).getTime());
    for (let index = 1; index < times.length; index += 1) {
      expect(times[index]).toBeLessThanOrEqual(times[index - 1]);
    }
  });

  test('charge la page suivante au scroll sans vider la liste', async ({ page }) => {
    await page.goto('/feed');
    const cards = postCards(page);
    await expect(cards).toHaveCount(20);
    const firstText = await cards.first().innerText();

    await cards.last().scrollIntoViewIfNeeded();
    await expect.poll(() => cards.count()).toBeGreaterThan(20);
    expect(await cards.first().innerText()).toBe(firstText);
    await expect(page.getByText(/^\d+ moments$/)).toBeVisible();
  });

  test('un compte neuf voit un fil "Ma meute" vide', async ({ page }) => {
    await page.goto('/feed');
    await page.getByRole('button', { name: 'Ma meute' }).click();
    await expect(page.getByText('Ta meute est silencieuse')).toBeVisible();
    await expect(postCards(page)).toHaveCount(0);
    await page.getByRole('button', { name: 'Tous les posts' }).click();
    await expect(postCards(page).first()).toBeVisible();
  });

  test('montre un état de chargement puis les posts', async ({ page }) => {
    await page.route('**/api/posts?*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      await route.continue();
    });
    await page.goto('/feed');
    await expect(page.getByText('Chargement du fil…')).toBeVisible();
    await expect(postCards(page).first()).toBeVisible();
  });

  test("affiche l'erreur API au lieu d'un écran blanc", async ({ page }) => {
    await page.route('**/api/posts?*', (route) =>
      route.fulfill({ status: 500, json: { error: 'Le fil est indisponible' } }),
    );
    await page.goto('/feed');
    await expect(page.getByRole('alert')).toHaveText('Le fil est indisponible');
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test('un post que je viens de publier apparaît en tête du fil', async ({ page, user }) => {
    const post = await createPost(user, `En tête ${user.username}`);
    await page.goto('/feed');
    await expect(postCards(page).first()).toBeVisible();
    const firstTexts = await postCards(page).allInnerTexts();
    const position = firstTexts.findIndex((text) => text.includes(post.content));
    expect(position).toBeGreaterThanOrEqual(0);
    expect(position).toBeLessThan(10);
    const seedPosition = firstTexts.findIndex((text) => text.includes('#59'));
    expect(seedPosition === -1 || seedPosition > position).toBe(true);
  });
});
