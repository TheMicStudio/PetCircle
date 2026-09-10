import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { expect, request as playwrightRequest, test as base } from '@playwright/test';
import type { APIRequestContext, BrowserContext, Page } from '@playwright/test';
import { BASE_URL, NYC_DIR } from './env';

declare global {
  interface Window {
    __coverage__?: unknown;
    collectIstanbulCoverage?: (json: string) => Promise<void>;
  }
}

export const PASSWORD = 'password123';

export type TestUser = {
  id: string;
  email: string;
  username: string;
  password: string;
  api: APIRequestContext;
};

let counter = 0;

export function uniqueName(prefix: string): string {
  counter += 1;
  return `${prefix}${Date.now().toString(36)}${counter}${process.pid % 100}`;
}

export function readString(body: unknown, key: string): string {
  if (typeof body === 'object' && body !== null && key in body) {
    const value: unknown = Reflect.get(body, key);
    if (typeof value === 'string') return value;
  }
  throw new Error(`Expected a string "${key}" in ${JSON.stringify(body)}`);
}

export function readNumber(body: unknown, key: string): number {
  if (typeof body === 'object' && body !== null && key in body) {
    const value: unknown = Reflect.get(body, key);
    if (typeof value === 'number') return value;
  }
  throw new Error(`Expected a number "${key}" in ${JSON.stringify(body)}`);
}

export async function createUser(prefix = 'user'): Promise<TestUser> {
  const api = await playwrightRequest.newContext({ baseURL: BASE_URL });
  const username = uniqueName(prefix);
  const email = `${username}@e2e.test`;
  const response = await api.post('/api/auth/register', {
    data: { username, email, password: PASSWORD },
  });
  expect(response.status(), await response.text()).toBe(201);
  const body: unknown = await response.json();
  return { id: readString(body, 'id'), email, username, password: PASSWORD, api };
}

export async function signIn(context: BrowserContext, user: TestUser): Promise<void> {
  const state = await user.api.storageState();
  await context.addCookies(state.cookies);
}

async function saveCoverage(json: string): Promise<void> {
  await writeFile(path.join(NYC_DIR, `${randomUUID()}.json`), json);
}

async function flushPageCoverage(page: Page): Promise<void> {
  const json = await page
    .evaluate(() => (window.__coverage__ === undefined ? null : JSON.stringify(window.__coverage__)))
    .catch(() => null);
  if (json !== null) await saveCoverage(json);
}

// Istanbul keeps its counters on window, a full navigation drops them: the init
// script sends them on pagehide, the teardown collects what the last page holds.
export const guestTest = base.extend({
  context: async ({ context }, use) => {
    await context.exposeFunction('collectIstanbulCoverage', saveCoverage);
    await context.addInitScript(() => {
      window.addEventListener('pagehide', () => {
        if (window.__coverage__ !== undefined && window.collectIstanbulCoverage !== undefined) {
          void window.collectIstanbulCoverage(JSON.stringify(window.__coverage__));
        }
      });
    });
    await use(context);
    for (const page of context.pages()) await flushPageCoverage(page);
  },
});

export const test = guestTest.extend<{ user: TestUser }>({
  user: async ({}, use) => {
    const user = await createUser();
    await use(user);
    await user.api.dispose();
  },
  context: async ({ context, user }, use) => {
    await signIn(context, user);
    await use(context);
  },
});

export { expect };
