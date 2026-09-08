import { z } from "zod";

export const userRoleSchema = z.enum(["USER", "ADMIN"]);

export const tokenPayloadSchema = z.object({
  userId: z.string().min(1),
  role: userRoleSchema,
});

export const authUserSchema = z.object({
  id: z.string().min(1),
  role: userRoleSchema,
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type TokenPayload = z.infer<typeof tokenPayloadSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;

// the role is a free string in the database, we close it here
export function toUserRole(value: string): UserRole {
  return userRoleSchema.catch("USER").parse(value);
}


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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
