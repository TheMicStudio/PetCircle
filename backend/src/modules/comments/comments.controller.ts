import { Request, Response } from "express";
import {
  commentIdParamSchema,
  commentPostIdParamSchema,
  commentsQuerySchema,
  createCommentSchema,
} from "@petcircle/contracts";
import { parseInput } from "../../http/parseInput";
import { requireUser } from "../../middleware/authenticate";
import { createComment, deleteComment, listComments } from "./comments.service";

// GET /posts/:postId/comments
export async function handleListComments(req: Request, res: Response): Promise<void> {
  const { postId } = parseInput(commentPostIdParamSchema, req.params);
  const query = parseInput(commentsQuerySchema, req.query);

  res.json(await listComments(postId, query));
}

// POST /posts/:postId/comments
export async function handleCreateComment(req: Request, res: Response): Promise<void> {
  const { postId } = parseInput(commentPostIdParamSchema, req.params);
  const input = parseInput(createCommentSchema, req.body);

  const comment = await createComment(postId, input, requireUser(req));

  res.status(201).json(comment);
}

// DELETE /comments/:id
export async function handleDeleteComment(req: Request, res: Response): Promise<void> {
  const { id } = parseInput(commentIdParamSchema, req.params);

  await deleteComment(id, requireUser(req));

  res.status(204).send();
}
