import { Request, Response } from "express";
import { loginSchema, registerSchema } from "@petcircle/contracts";
import { env } from "../../config/env";
import { parseInput } from "../../http/parseInput";
import { requireUser } from "../../middleware/authenticate";
import { getCurrentUser, login, register } from "./auth.service";
import { TOKEN_COOKIE, tokenCookieOptions } from "./token.service";

function setTokenCookie(res: Response, token: string): void {
  res.cookie(TOKEN_COOKIE, token, {
    ...tokenCookieOptions,
    maxAge: env.jwtExpiresInSeconds * 1000,
  });
}

// POST /auth/register
export async function handleRegister(req: Request, res: Response): Promise<void> {
  const result = await register(parseInput(registerSchema, req.body));

  setTokenCookie(res, result.token);
  res.status(201).json(result.user);
}

// POST /auth/login
export async function handleLogin(req: Request, res: Response): Promise<void> {
  const result = await login(parseInput(loginSchema, req.body));

  setTokenCookie(res, result.token);
  res.json(result.user);
}

// POST /auth/logout: the front cannot clear an httpOnly cookie itself
export function handleLogout(_req: Request, res: Response): void {
  res.clearCookie(TOKEN_COOKIE, tokenCookieOptions);
  res.status(204).end();
}

// lets the front get the current user after a page reload (S2)
export async function handleGetMe(req: Request, res: Response): Promise<void> {
  res.json(await getCurrentUser(requireUser(req).id));
}
