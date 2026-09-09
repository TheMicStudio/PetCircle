import { z } from "zod";

// Schémas internes au backend : rôle et payload JWT ne traversent jamais l'API,
// donc ils ne descendent pas dans @petcircle/contracts.
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
