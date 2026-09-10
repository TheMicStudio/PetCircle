import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authLimiter } from "../../middleware/rateLimit";
import { handleGetMe, handleLogin, handleLogout, handleRegister } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", authLimiter, handleRegister);
authRouter.post("/login", authLimiter, handleLogin);
authRouter.post("/logout", handleLogout);
authRouter.get("/me", authenticate, handleGetMe);
