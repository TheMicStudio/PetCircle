import { z } from "zod";

// Le parametre de route est le meme que pour un profil : userIdParamSchema.
export const followStateSchema = z.object({
  following: z.boolean(),
  followerCount: z.number().int(),
});

export type FollowState = z.infer<typeof followStateSchema>;
