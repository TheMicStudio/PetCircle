import { CookieOptions } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AuthUser, tokenPayloadSchema } from "./auth.schema";

// sign a token for a user
export function generateToken(user: AuthUser): string {
  return jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresInSeconds,
  });
}

// returns null instead of throwing, the middleware picks the HTTP code
export function verifyToken(token: string): AuthUser | null {
  let payload: unknown;

  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    return null;
  }

  // the signature is valid, but we still check what is inside
  const result = tokenPayloadSchema.safeParse(payload);

  if (!result.success) {
    return null;
  }

  return { id: result.data.userId, role: result.data.role };
}

export const TOKEN_COOKIE = "token";

export const tokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax",
  path: "/",
};
