import path from 'node:path';

export const ROOT_DIR = path.resolve(__dirname, '..');
export const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
export const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
export const NYC_DIR = path.join(ROOT_DIR, '.nyc_output');

export const FRONT_PORT = 5174;
export const API_PORT = 3101;
export const BASE_URL = `http://localhost:${FRONT_PORT}`;
export const API_URL = `http://localhost:${API_PORT}`;

export const BACKEND_ENV: Record<string, string> = {
  PORT: String(API_PORT),
  DATABASE_URL: 'file:./e2e.db',
  JWT_SECRET: 'e2e-only-secret',
  ALLOWED_ORIGINS: BASE_URL,
  RATE_LIMIT_DISABLED: 'true',
};
