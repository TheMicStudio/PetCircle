import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { handleGetMe, handleLogin, handleRegister } from "./auth.controller";

// mounted under /auth in routes.ts
export const authRouter = Router();

authRouter.post("/register", handleRegister);
authRouter.post("/login", handleLogin);
authRouter.get("/me", authenticate, handleGetMe);
