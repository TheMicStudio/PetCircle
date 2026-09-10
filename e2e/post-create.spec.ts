import { expect, test } from './fixtures';
import { expectNoReload, markNoReload, PHOTO_PATH, postCard, TEXT_FILE_PATH } from './helpers';

test.describe('S4 créer un post', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/feed');
    await expect(page.getByRole('button', { name: 'Publier' })).toBeVisible();
  });

  test('le bouton reste désactivé tant que le contenu est vide', async ({ page }) => {
    const publish = page.getByRole('button', { name: 'Publier' });
    await expect(publish).toBeDisabled();
    await page.getByLabel('Nouveau post').fill('   ');
    await expect(publish).toBeDisabled();
    await page.getByLabel('Nouveau post').fill('Un vrai contenu');
    await expect(publish).toBeEnabled();
  });

  test('publie un post texte visible immédiatement, sans rechargement', async ({ page, user }) => {
    const content = `Bonjour de ${user.username}`;
    await markNoReload(page);
    await page.getByLabel('Nouveau post').fill(content);
    await page.getByRole('button', { name: 'Publier' }).click();

    await expect(page.getByText('Post publié.')).toBeVisible();
    await expect(postCard(page, content)).toBeVisible();
    await expect(page.getByLabel('Nouveau post')).toHaveValue('');
    await expectNoReload(page);
  });

  test("prévisualise l'image avant l'envoi puis la publie", async ({ page, user }) => {
    const content = `Photo de ${user.username}`;
    await page.locator('input[type="file"]').setInputFiles(PHOTO_PATH);
    await expect(page.getByRole('img', { name: "Aperçu de l'image choisie" })).toBeVisible();
    await expect(page.getByText('photo.png')).toBeVisible();

    await page.getByLabel('Nouveau post').fill(content);
    await page.getByRole('button', { name: 'Publier' }).click();

    const card = postCard(page, content);
    await expect(card).toBeVisible();
    await expect(card.locator('img[src^="/uploads/"]')).toBeVisible();
    await expect(page.getByRole('img', { name: "Aperçu de l'image choisie" })).toHaveCount(0);
  });

  test('refuse un fichier qui n’est pas une image, côté front', async ({ page }) => {
    let posted = false;
    await page.route('**/api/posts', (route) => {
      posted = true;
      return route.continue();
    });
    await page.locator('input[type="file"]').setInputFiles(TEXT_FILE_PATH);
    await page.getByLabel('Nouveau post').fill('Un fichier texte');
    await page.getByRole('button', { name: 'Publier' }).click();

    await expect(page.getByRole('main').locator('form').first().locator('li').first()).toBeVisible();
    expect(posted).toBe(false);
  });

  test('refuse un contenu trop long', async ({ page }) => {
    await page.getByLabel('Nouveau post').fill('x'.repeat(501));
    await page.getByRole('button', { name: 'Publier' }).click();
    await expect(page.getByText('Maximum 500 caractères')).toBeVisible();
  });

  test("garde le formulaire quand l'API échoue", async ({ page }) => {
    await page.route('**/api/posts', (route) =>
      route.fulfill({ status: 500, json: { error: 'Publication impossible' } }),
    );
    await page.getByLabel('Nouveau post').fill('Ce texte doit rester');
    await page.getByRole('button', { name: 'Publier' }).click();

    await expect(page.getByRole('alert')).toHaveText('Publication impossible');
    await expect(page.getByLabel('Nouveau post')).toHaveValue('Ce texte doit rester');
    await expect(page.getByRole('button', { name: 'Publier' })).toBeEnabled();
  });

  test("montre l'état d'envoi et bloque le double clic", async ({ page }) => {
    await page.route('**/api/posts', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });
    await page.getByLabel('Nouveau post').fill('Envoi lent');
    await page.getByRole('button', { name: 'Publier' }).click();

    const sending = page.getByRole('button', { name: 'Publication…' });
    await expect(sending).toBeVisible();
    await expect(sending).toBeDisabled();
    await expect(page.getByLabel('Nouveau post')).toBeDisabled();
    await expect(postCard(page, 'Envoi lent')).toHaveCount(1);
  });
});
