import { defineConfig, devices } from '@playwright/test';
import { API_URL, BACKEND_DIR, BACKEND_ENV, BASE_URL, FRONTEND_DIR, FRONT_PORT } from './e2e/env';

const isCI = process.env.CI !== undefined;

const resetDatabase = `node -e "require('fs').rmSync('prisma/e2e.db', { force: true })"`;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : 3,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    locale: 'fr-FR',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'app', testIgnore: /landing\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'landing', testMatch: /landing\.spec\.ts/, dependencies: ['app'], use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: [
    {
      command: `${resetDatabase} && npx prisma migrate deploy && npx tsx ../e2e/seed.ts && npx tsx src/index.ts`,
      cwd: BACKEND_DIR,
      url: `${API_URL}/api/auth/me`,
      reuseExistingServer: false,
      timeout: 180_000,
      env: BACKEND_ENV,
    },
    {
      command: `npx vite --port ${FRONT_PORT} --strictPort`,
      cwd: FRONTEND_DIR,
      url: BASE_URL,
      reuseExistingServer: false,
      timeout: 60_000,
      env: { VITE_API_TARGET: API_URL, VITE_COVERAGE: 'true' },
    },
  ],
});
