import { z } from "zod";
import { idSchema } from "./common";

export const postIdParamSchema = z.object({
  id: idSchema,
});

export const feedQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const createPostSchema = z.object({
  content: z
    .string({ message: "Ce champ est obligatoire" })
    .trim()
    .min(1, { message: "Le contenu ne peut pas être vide" })
    .max(500, { message: "Maximum 500 caractères" }),
});

export const postAuthorSchema = z.object({
  id: idSchema,
  username: z.string(),
});

// createdAt est une chaine ISO 8601 : les services serialisent avec
// toISOString() pour que le contrat traverse JSON sans perte.
export const feedPostSchema = z.object({
  id: idSchema,
  content: z.string(),
  imageUrl: z.string().nullable(),
  createdAt: z.string(),
  author: postAuthorSchema,
  likeCount: z.number().int(),
  commentCount: z.number().int(),
});

export const feedPageSchema = z.object({
  items: z.array(feedPostSchema),
  nextCursor: z.string().nullable(),
});

export type FeedQuery = z.infer<typeof feedQuerySchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type PostAuthor = z.infer<typeof postAuthorSchema>;
export type FeedPost = z.infer<typeof feedPostSchema>;
export type FeedPage = z.infer<typeof feedPageSchema>;
