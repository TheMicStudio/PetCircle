import { Request, Response } from "express";
import { parseInput } from "../../http/parseInput";
import { feedQuerySchema, userIdParamSchema } from "@petcircle/contracts";
import { getPublicUser, listUserPosts } from "./users.service";

export async function handleGetUser(req: Request, res: Response): Promise<void> {
  const { id } = parseInput(userIdParamSchema, req.params);

  res.json(await getPublicUser(id));
}

export async function handleGetUserPosts(req: Request, res: Response): Promise<void> {
  const { id } = parseInput(userIdParamSchema, req.params);
  const query = parseInput(feedQuerySchema, req.query);

  res.json(await listUserPosts(id, query));
}
