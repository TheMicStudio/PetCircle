import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../../middleware/authenticate";
import { uploadImage } from "../../middleware/upload";
import {
  handleCreatePost,
  handleDeletePost,
  handleGetFeed,
  handleGetPost,
} from "./posts.controller";

export const postsRouter = Router();

// the /posts prefix is added in routes.ts
postsRouter.get("/", optionalAuthenticate, handleGetFeed);
postsRouter.get("/:id", optionalAuthenticate, handleGetPost);
postsRouter.post("/", authenticate, uploadImage.single("image"), handleCreatePost);
postsRouter.delete("/:id", authenticate, handleDeletePost);
