import { Request, Response } from "express";
import { parseInput } from "../../http/parseInput";
import { requireUser } from "../../middleware/authenticate";
import { postIdParamSchema } from "./likes.schema";
import { likePost, unlikePost } from "./likes.service";

// POST /posts/:postId/like
export async function handleLikePost(req: Request, res: Response): Promise<void> {
  const { postId } = parseInput(postIdParamSchema, req.params);

  res.json(await likePost(postId, requireUser(req)));
}

// DELETE /posts/:postId/like
export async function handleUnlikePost(req: Request, res: Response): Promise<void> {
  const { postId } = parseInput(postIdParamSchema, req.params);

  res.json(await unlikePost(postId, requireUser(req)));
}
