import { z } from "zod";

// no format check: an unknown id must answer 404
export const postIdParamSchema = z.object({
  postId: z.string().min(1),
});

export const commentIdParamSchema = z.object({
  id: z.string().min(1),
});

export const createCommentSchema = z.object({
  content: z
    .string({ message: "Ce champ est obligatoire" })
    .trim()
    .min(1, { message: "Le commentaire ne peut pas être vide" })
    .max(300, { message: "Maximum 300 caractères" }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const commentsQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CommentsQuery = z.infer<typeof commentsQuerySchema>;
