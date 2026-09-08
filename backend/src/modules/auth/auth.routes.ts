import { Router } from "express";
import { handleLogin, handleRegister } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", handleRegister);
authRouter.post("/login", handleLogin);
