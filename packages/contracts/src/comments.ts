import { z } from "zod";
import { idSchema } from "./common";
import { postAuthorSchema } from "./posts";

export const commentPostIdParamSchema = z.object({
    postId: idSchema,
});

export const commentIdParamSchema = z.object({
    id: idSchema,
});

export const commentsQuerySchema = z.object({
    cursor: z.string().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const createCommentSchema = z.object({
    content: z
        .string({ message: "Ce champ est obligatoire" })
        .trim()
        .min(1, { message: "Le commentaire ne peut pas être vide" })
        .max(300, { message: "Maximum 300 caractères" }),
});

export const postCommentSchema = z.object({
    id: idSchema,
    content: z.string(),
    createdAt: z.iso.datetime(),
    author: postAuthorSchema,
});

export const commentPageSchema = z.object({
    items: z.array(postCommentSchema),
    nextCursor: z.string().nullable(),
});

export type CommentsQuery = z.infer<typeof commentsQuerySchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type PostComment = z.infer<typeof postCommentSchema>;
export type CommentPage = z.infer<typeof commentPageSchema>;
