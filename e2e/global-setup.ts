import { mkdir, rm } from 'node:fs/promises';
import { NYC_DIR } from './env';

export default async function globalSetup(): Promise<void> {
  await rm(NYC_DIR, { recursive: true, force: true });
  await mkdir(NYC_DIR, { recursive: true });
}
