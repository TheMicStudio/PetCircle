import { z } from "zod";

export const postIdParamSchema = z.object({
  id: z.string().min(1),
});

export const feedQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  // "following" needs a token: it only keeps the authors you follow
  scope: z.enum(["all", "following"]).default("all"),
});

export const createPostSchema = z.object({
  content: z
    .string({ message: "Ce champ est obligatoire" })
    .trim()
    .min(1, { message: "Le contenu ne peut pas être vide" })
    .max(500, { message: "Maximum 500 caractères" }),
});

export type FeedQuery = z.infer<typeof feedQuerySchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;

