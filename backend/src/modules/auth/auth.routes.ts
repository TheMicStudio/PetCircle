import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { handleGetMe, handleLogin, handleLogout, handleRegister } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", handleRegister);
authRouter.post("/login", handleLogin);
authRouter.post("/logout", handleLogout);
authRouter.get("/me", authenticate, handleGetMe);
