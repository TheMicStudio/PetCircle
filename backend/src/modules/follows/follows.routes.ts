import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { handleFollowUser, handleUnfollowUser } from "./follows.controller";


// mounted under /users in routes.ts
export const followsRouter = Router();

followsRouter.post("/:id/follow", authenticate, handleFollowUser);
followsRouter.delete("/:id/follow", authenticate, handleUnfollowUser);
