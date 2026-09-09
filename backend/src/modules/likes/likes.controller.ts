import { Request, Response } from "express";
import { parseInput } from "../../http/parseInput";
import { requireUser } from "../../middleware/authenticate";
import { likePostIdParamSchema } from "@petcircle/contracts";
import { likePost, unlikePost } from "./likes.service";

export async function handleLikePost(req: Request, res: Response): Promise<void> {
  const { postId } = parseInput(likePostIdParamSchema, req.params);

  res.json(await likePost(postId, requireUser(req)));
}

export async function handleUnlikePost(req: Request, res: Response): Promise<void> {
  const { postId } = parseInput(likePostIdParamSchema, req.params);

  res.json(await unlikePost(postId, requireUser(req)));
}
