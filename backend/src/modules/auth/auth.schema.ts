import { z } from "zod";

// Schémas internes au backend : rôle et payload JWT ne traversent jamais l'API.
// Les contrats d'inscription et de connexion vivent dans @petcircle/contracts.
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

export function toUserRole(value: string): UserRole {
  return userRoleSchema.catch("USER").parse(value);
}
