import { z } from "zod";
import { idSchema } from "./common";

const emailField = z
    .string({ message: "Ce champ est obligatoire" })
    .trim()
    .toLowerCase()
    .email({ message: "Adresse email invalide" });

export const registerSchema = z.object({
    email: emailField,
    username: z
        .string({ message: "Ce champ est obligatoire" })
        .trim()
        .min(3, { message: "Minimum 3 caractères" })
        .max(30, { message: "Maximum 30 caractères" }),
    password: z
        .string({ message: "Ce champ est obligatoire" })
        .min(8, { message: "Minimum 8 caractères" })
        .max(72, { message: "Maximum 72 caractères" }),
});

export const loginSchema = z.object({
    email: emailField,
    password: z
        .string({ message: "Ce champ est obligatoire" })
        .min(1, { message: "Ce champ est obligatoire" }),
});

export const sessionUserSchema = z.object({
    id: idSchema,
    email: z.string(),
    username: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
