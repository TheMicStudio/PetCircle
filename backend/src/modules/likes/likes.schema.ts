import { z } from "zod";

export const postIdParamSchema = z.object({
  postId: z.string().min(1),
});
