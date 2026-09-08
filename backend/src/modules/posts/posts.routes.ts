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

// Le préfixe /posts est ajouté au montage, dans routes.ts.
postsRouter.get("/", handleGetFeed);
postsRouter.get("/:id", handleGetPost);
postsRouter.post("/", authenticate, uploadImage.single("image"), handleCreatePost);
postsRouter.delete("/:id", authenticate, handleDeletePost);
