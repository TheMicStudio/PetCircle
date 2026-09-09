import { z } from "zod";

export const followStateSchema = z.object({
    following: z.boolean(),
    followerCount: z.number().int(),
});

export type FollowState = z.infer<typeof followStateSchema>;
