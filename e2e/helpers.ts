import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Locator, Page } from '@playwright/test';
import { expect, readString } from './fixtures';
import type { TestUser } from './fixtures';

export const PHOTO_PATH = path.join(__dirname, 'assets', 'photo.png');
export const TEXT_FILE_PATH = path.join(__dirname, 'assets', 'not-an-image.txt');

export type CreatedPost = { id: string; content: string };

export async function createPost(user: TestUser, content: string, withImage = false): Promise<CreatedPost> {
  const multipart: Record<string, string | { name: string; mimeType: string; buffer: Buffer }> = { content };
  if (withImage) {
    multipart.image = { name: 'photo.png', mimeType: 'image/png', buffer: await readFile(PHOTO_PATH) };
  }
  const response = await user.api.post('/api/posts', { multipart });
  expect(response.status(), await response.text()).toBe(201);
  const body: unknown = await response.json();
  return { id: readString(body, 'id'), content };
}

export async function createComment(user: TestUser, postId: string, content: string): Promise<string> {
  const response = await user.api.post(`/api/posts/${postId}/comments`, { data: { content } });
  expect(response.status(), await response.text()).toBe(201);
  const body: unknown = await response.json();
  return readString(body, 'id');
}

export function postCards(page: Page): Locator {
  return page.getByRole('listitem').filter({ has: page.getByRole('link', { name: /^Ouvrir le post de / }) });
}

export function postCard(page: Page, content: string): Locator {
  return postCards(page).filter({ hasText: content });
}

export function likeButton(scope: Locator | Page): Locator {
  return scope.getByRole('button', { name: /^(Aimer ce post|Retirer le like)$/ });
}

export async function fillLogin(page: Page, email: string, password: string): Promise<void> {
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Mot de passe', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Se connecter à PetCircle' }).click();
}

export async function fillRegister(page: Page, username: string, email: string, password: string): Promise<void> {
  await page.getByLabel('Pseudo').fill(username);
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Mot de passe', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
}

export async function markNoReload(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.sessionStorage.setItem('e2e-marker', String(performance.timeOrigin));
  });
}

export async function expectNoReload(page: Page): Promise<void> {
  const same = await page.evaluate(
    () => window.sessionStorage.getItem('e2e-marker') === String(performance.timeOrigin),
  );
  expect(same, 'the page reloaded').toBe(true);
}
