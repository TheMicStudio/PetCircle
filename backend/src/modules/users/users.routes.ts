import { Router } from "express";
import { optionalAuthenticate } from "../../middleware/authenticate";
import { handleGetUser, handleGetUserPosts } from "./users.controller";

// mounted under /users in routes.ts
export const usersRouter = Router();

usersRouter.get("/:id", optionalAuthenticate, handleGetUser);
usersRouter.get("/:id/posts", optionalAuthenticate, handleGetUserPosts);
