import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { handleLikePost, handleUnlikePost } from "./likes.controller";

// Monté sous /posts dans routes.ts.
export const likesRouter = Router();

likesRouter.post("/:postId/like", authenticate, handleLikePost);
likesRouter.delete("/:postId/like", authenticate, handleUnlikePost);
