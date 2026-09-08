import { z } from "zod";

// Pas de contrôle de format : un identifiant inconnu doit répondre 404.
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
