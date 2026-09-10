import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { uploadImage } from "../../middleware/upload";
import {
  handleCreatePost,
  handleDeletePost,
  handleGetFeed,
  handleGetPost,
} from "./posts.controller";

export const postsRouter = Router();

// the /posts prefix is added in routes.ts
postsRouter.get("/", authenticate, handleGetFeed);
postsRouter.get("/:id", authenticate, handleGetPost);
postsRouter.post("/", authenticate, uploadImage.single("image"), handleCreatePost);
postsRouter.delete("/:id", authenticate, handleDeletePost);
