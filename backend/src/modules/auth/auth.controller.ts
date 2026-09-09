import { Request, Response } from "express";
import { loginSchema, registerSchema } from "@petcircle/contracts";
import { parseInput } from "../../http/parseInput";
import { requireUser } from "../../middleware/authenticate";
import { getCurrentUser, login, register } from "./auth.service";

// POST /auth/register
export async function handleRegister(req: Request, res: Response): Promise<void> {
  const result = await register(parseInput(registerSchema, req.body));

  res.status(201).json(result);
}

// POST /auth/login
export async function handleLogin(req: Request, res: Response): Promise<void> {
  const result = await login(parseInput(loginSchema, req.body));

  res.json(result);
}

// lets the front get the current user after a page reload (S2)
export async function handleGetMe(req: Request, res: Response): Promise<void> {
  res.json(await getCurrentUser(requireUser(req).id));
}
