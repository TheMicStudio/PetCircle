import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { handleCreateComment, handleDeleteComment } from "./comments.controller";

// Deux familles d'URL, donc deux routeurs : l'un sous /posts, l'autre sous
// /comments. Les préfixes sont ajoutés au montage, dans routes.ts.
export const postCommentsRouter = Router();
export const commentsRouter = Router();

postCommentsRouter.post("/:postId/comments", authenticate, handleCreateComment);
commentsRouter.delete("/:id", authenticate, handleDeleteComment);
