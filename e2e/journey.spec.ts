import { expect, guestTest, PASSWORD, uniqueName } from './fixtures';
import { fillLogin, fillRegister, likeButton, PHOTO_PATH, postCard } from './helpers';

guestTest('parcours complet : inscription, post, commentaire, like, profil, suppression, déconnexion', async ({ page }) => {
  guestTest.setTimeout(60_000);
  const username = uniqueName('journey');
  const email = `${username}@e2e.test`;
  const content = `Premier post de ${username}`;

  await page.goto('/');
  await expect(page.locator('.lp')).toBeVisible();

  await page.goto('/auth?mode=signup');
  await fillRegister(page, username, email, PASSWORD);
  await expect(page).toHaveURL(/\/feed$/);

  await page.locator('input[type="file"]').setInputFiles(PHOTO_PATH);
  await page.getByLabel('Nouveau post').fill(content);
  await page.getByRole('button', { name: 'Publier' }).click();
  const card = postCard(page, content);
  await expect(card).toBeVisible();
  await expect(card.locator('img[src^="/uploads/"]')).toBeVisible();

  await card.getByRole('link', { name: `Ouvrir le post de ${username}` }).click();
  await expect(page).toHaveURL(/\/posts\//);
  await page.getByLabel('Écrire un commentaire').fill('Mon premier commentaire');
  await page.getByRole('button', { name: 'Envoyer' }).click();
  await expect(page.getByText('Mon premier commentaire')).toBeVisible();

  await likeButton(page).click();
  await expect(page.getByText('1 patte', { exact: true })).toBeVisible();
  await page.waitForResponse((response) => response.url().includes('/like'));

  await page.getByRole('banner').getByRole('link', { name: username }).click();
  await expect(page.getByRole('heading', { name: 'Mes publications' })).toBeVisible();
  const profileCard = postCard(page, content);
  await expect(profileCard).toBeVisible();
  await expect(profileCard.getByText('1 patte', { exact: true })).toBeVisible();
  await expect(profileCard.getByText('1 commentaire', { exact: true })).toBeVisible();

  await profileCard.getByRole('button', { name: 'Supprimer ce post' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Supprimer' }).click();
  await expect(profileCard).toHaveCount(0);
  await expect(page.getByText('Rien publié pour le moment')).toBeVisible();

  await page.getByRole('button', { name: 'Se déconnecter' }).click();
  await expect(page).toHaveURL(/\/auth$/);

  await fillLogin(page, email, PASSWORD);
  await expect(page).toHaveURL(/\/feed$/);
  await expect(page.getByRole('banner').getByText(username)).toBeVisible();
});
