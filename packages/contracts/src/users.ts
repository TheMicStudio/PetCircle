import { z } from "zod";
import { idSchema } from "./common";

export const userIdParamSchema = z.object({
    id: idSchema,
});

export const publicUserSchema = z.object({
    id: idSchema,
    username: z.string(),
    createdAt: z.string(),
    postCount: z.number().int(),
    followerCount: z.number().int(),
    followingCount: z.number().int(),
    followedByMe: z.boolean(),
});

export type PublicUser = z.infer<typeof publicUserSchema>;
