import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { handleGetUser, handleGetUserPosts } from "./users.controller";

// mounted under /users in routes.ts
export const usersRouter = Router();

usersRouter.get("/:id", authenticate, handleGetUser);
usersRouter.get("/:id/posts", authenticate, handleGetUserPosts);
