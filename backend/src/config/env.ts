import path from "path";
import dotenv from "dotenv";

const rootDir = path.join(__dirname, "..", "..");

dotenv.config({ path: path.join(rootDir, ".env") });

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

function readNumber(name: string, fallback: number): number {
  const raw = process.env[name];

  if (raw === undefined) {
    return fallback;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${name} must be a number`);
  }

  return parsed;
}

function readJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (secret !== undefined) {
    return secret;
  }

  // Un secret par défaut en production signifierait des jetons forgeables.
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }

  return "dev-secret-change-me";
}

export const env = {
  port: readNumber("PORT", 3000),
  jwtSecret: readJwtSecret(),
  jwtExpiresInSeconds: readNumber("JWT_EXPIRES_IN_SECONDS", SEVEN_DAYS_IN_SECONDS),
  uploadsDir: path.join(rootDir, "uploads"),
  publicDir: path.join(rootDir, "public"),
};
