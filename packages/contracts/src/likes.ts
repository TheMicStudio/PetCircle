import { z } from "zod";
import { idSchema } from "./common";

export const likePostIdParamSchema = z.object({
  postId: idSchema,
});

export const likeStateSchema = z.object({
  liked: z.boolean(),
  likeCount: z.number().int(),
});

export type LikeState = z.infer<typeof likeStateSchema>;
export type LikePostIdParam = z.infer<typeof likePostIdParamSchema>;
