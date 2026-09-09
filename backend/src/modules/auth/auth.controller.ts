import { Request, Response } from "express";
import { parseInput } from "../../http/parseInput";
import { loginSchema, registerSchema } from "@petcircle/contracts";
import { login, register } from "./auth.service";

export async function handleRegister(req: Request, res: Response): Promise<void> {
  const result = await register(parseInput(registerSchema, req.body));

  res.status(201).json(result);
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  const result = await login(parseInput(loginSchema, req.body));

  res.json(result);
}
