import { Router } from "express";
import { handleGetUser, handleGetUserPosts } from "./users.controller";

// Monté sous /users dans routes.ts.
export const usersRouter = Router();

usersRouter.get("/:id", handleGetUser);
usersRouter.get("/:id/posts", handleGetUserPosts);
