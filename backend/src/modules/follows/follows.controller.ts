import { Request, Response } from "express";
import { parseInput } from "../../http/parseInput";
import { requireUser } from "../../middleware/authenticate";
import { userIdParamSchema } from "./follows.schema";
import { followUser, unfollowUser } from "./follows.service";

// POST /users/:id/follow
export async function handleFollowUser(req: Request, res: Response): Promise<void> {
  const { id } = parseInput(userIdParamSchema, req.params);

  res.json(await followUser(id, requireUser(req)));
}

// DELETE /users/:id/follow
export async function handleUnfollowUser(req: Request, res: Response): Promise<void> {
  const { id } = parseInput(userIdParamSchema, req.params);

  res.json(await unfollowUser(id, requireUser(req)));
}
