import { Request, Response } from "express";
import { parseInput } from "../../http/parseInput";
import { requireUser } from "../../middleware/authenticate";
import { createPostSchema, feedQuerySchema, postIdParamSchema } from "@petcircle/contracts";
import { createPost, deletePost, getPostById, listFeed } from "./posts.service";

export async function handleGetFeed(req: Request, res: Response): Promise<void> {
  const feed = await listFeed(parseInput(feedQuerySchema, req.query));

  res.json(feed);
}

export async function handleGetPost(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = parseInput(postIdParamSchema, req.params);

  const post = await getPostById(id);

  res.json(post);
}

export async function handleCreatePost(req: Request, res: Response): Promise<void> {
  const input = parseInput(createPostSchema, req.body);
  const imageUrl = req.file === undefined ? null : `/uploads/${req.file.filename}`;

  const post = await createPost(input, imageUrl, requireUser(req));

  res.status(201).json(post);
}

export async function handleDeletePost(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = parseInput(postIdParamSchema, req.params);

  await deletePost(id, requireUser(req));

  res.status(204).send();
}
