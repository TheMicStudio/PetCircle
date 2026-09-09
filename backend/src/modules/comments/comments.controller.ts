import { Request, Response } from "express";
import { parseInput } from "../../http/parseInput";
import { requireUser } from "../../middleware/authenticate";
import {
  commentIdParamSchema,
  commentPostIdParamSchema,
  createCommentSchema,
} from "@petcircle/contracts";
import { createComment, deleteComment } from "./comments.service";

export async function handleCreateComment(req: Request, res: Response): Promise<void> {
  const { postId } = parseInput(commentPostIdParamSchema, req.params);
  const input = parseInput(createCommentSchema, req.body);

  const comment = await createComment(postId, input, requireUser(req));

  res.status(201).json(comment);
}

export async function handleDeleteComment(req: Request, res: Response): Promise<void> {
  const { id } = parseInput(commentIdParamSchema, req.params);

  await deleteComment(id, requireUser(req));

  res.status(204).send();
}
