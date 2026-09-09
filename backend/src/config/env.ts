import path from "path";
import dotenv from "dotenv";

const rootDir = path.join(__dirname, "..", "..");

dotenv.config({ path: path.join(rootDir, ".env") });

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

// read a number from the env, or keep the default
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

// an env value is a string: split it, remove spaces (the origin match is exact)
function readOrigins(value: string): string[] {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

// the JWT secret, with a fallback only good enough for dev
function readJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (secret !== undefined) {
    return secret;
  }

  // a default secret in production means anyone can forge a token
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }

  return "dev-secret-change-me";
}

export const env = {
  port: readNumber("PORT", 3000),
  isProduction: process.env.NODE_ENV === "production",
  jwtSecret: readJwtSecret(),
  jwtExpiresInSeconds: readNumber("JWT_EXPIRES_IN_SECONDS", SEVEN_DAYS_IN_SECONDS),
  allowedOrigins: readOrigins(process.env.ALLOWED_ORIGINS ?? "http://localhost:5173"),
  uploadsDir: path.join(rootDir, "uploads"),
  publicDir: path.join(rootDir, "public"),
};
