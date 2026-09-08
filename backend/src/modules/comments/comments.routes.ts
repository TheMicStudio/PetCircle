import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import {
  handleCreateComment,
  handleDeleteComment,
  handleListComments,
} from "./comments.controller";

// two URL families, so two routers. The prefixes are added in routes.ts
export const postCommentsRouter = Router();
export const commentsRouter = Router();

postCommentsRouter.get("/:postId/comments", handleListComments);
postCommentsRouter.post("/:postId/comments", authenticate, handleCreateComment);
commentsRouter.delete("/:id", authenticate, handleDeleteComment);
