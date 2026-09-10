import { expect, guestTest, test } from './fixtures';

async function scrollThrough(page: import('@playwright/test').Page): Promise<void> {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let offset = 0; offset < height; offset += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(300);
}

guestTest.describe('landing', () => {
  guestTest.setTimeout(90_000);

  guestTest("se parcourt jusqu'au pied de page", async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Voir le réseau' })).toBeVisible();
    await scrollThrough(page);
    await expect(page.locator('footer')).toBeVisible();
    await page.mouse.wheel(0, -20_000);
    await page.waitForTimeout(300);
  });

  guestTest('la séquence du héros mène à la connexion', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Voir le réseau' }).click();
    await expect(page).toHaveURL(/\/auth$/, { timeout: 60_000 });
    await expect(page.getByRole('heading', { name: 'Bon retour' })).toBeVisible();
  });
});

test('la séquence du héros mène au fil quand on est connecté', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto('/');
  await page.getByRole('button', { name: 'Voir le réseau' }).click();
  await expect(page).toHaveURL(/\/feed$/, { timeout: 60_000 });
});
