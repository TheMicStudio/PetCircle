import { Request, Response } from "express";
import { parseInput } from "../../http/parseInput";
import { feedQuerySchema } from "../posts/posts.schema";
import { userIdParamSchema } from "./users.schema";
import { getPublicUser, listUserPosts } from "./users.service";

// GET /users/:id
export async function handleGetUser(req: Request, res: Response): Promise<void> {
  const { id } = parseInput(userIdParamSchema, req.params);

  res.json(await getPublicUser(id, req.user?.id));
}

// GET /users/:id/posts
export async function handleGetUserPosts(req: Request, res: Response): Promise<void> {
  const { id } = parseInput(userIdParamSchema, req.params);
  const query = parseInput(feedQuerySchema, req.query);

  res.json(await listUserPosts(id, query, req.user?.id));
}
