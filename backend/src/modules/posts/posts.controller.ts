import { Request, Response } from "express";
import { parseInput } from "../../http/parseInput";
import { HttpError } from "../../http/errors";
import { requireUser } from "../../middleware/authenticate";
import { listFollowedUserIds } from "../follows/follows.service";
import { createPostSchema, feedQuerySchema, postIdParamSchema } from "./posts.schema";
import { createPost, deletePost, getPostById, listFeed } from "./posts.service";

// GET /posts
export async function handleGetFeed(req: Request, res: Response): Promise<void> {
  const query = parseInput(feedQuerySchema, req.query);
  const viewer = req.user;

  if (query.scope === "following" && viewer === undefined) {
    throw new HttpError(401, "Authentication required");
  }

  const authorIds =
    query.scope === "following" && viewer !== undefined
      ? await listFollowedUserIds(viewer.id)
      : undefined;

  const feed = await listFeed(query, { viewerId: viewer?.id, authorIds });

  res.json(feed);
}

// GET /posts/:id
export async function handleGetPost(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = parseInput(postIdParamSchema, req.params);

  const post = await getPostById(id, req.user?.id);

  res.json(post);
}

// POST /posts
export async function handleCreatePost(req: Request, res: Response): Promise<void> {
  const input = parseInput(createPostSchema, req.body);
  const imageUrl = req.file === undefined ? null : `/uploads/${req.file.filename}`;

  const post = await createPost(input, imageUrl, requireUser(req));

  res.status(201).json(post);
}

// DELETE /posts/:id
export async function handleDeletePost(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = parseInput(postIdParamSchema, req.params);

  await deletePost(id, requireUser(req));

  res.status(204).send();
}
