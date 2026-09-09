import { z } from "zod";
import { idSchema } from "./common";
import { postAuthorSchema } from "./posts";

// Pas de contrôle de format : un identifiant inconnu doit répondre 404.
export const commentPostIdParamSchema = z.object({
  postId: idSchema,
});

export const commentIdParamSchema = z.object({
  id: idSchema,
});

export const createCommentSchema = z.object({
  content: z
    .string({ message: "Ce champ est obligatoire" })
    .trim()
    .min(1, { message: "Le commentaire ne peut pas être vide" })
    .max(300, { message: "Maximum 300 caractères" }),
});

// PostComment et non Comment : Comment est un type global du DOM cote frontend.
export const postCommentSchema = z.object({
  id: idSchema,
  content: z.string(),
  createdAt: z.string(),
  author: postAuthorSchema,
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type PostComment = z.infer<typeof postCommentSchema>;
