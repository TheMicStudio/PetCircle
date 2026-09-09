import { z } from "zod";
import { idSchema } from "./common";

export const userIdParamSchema = z.object({
  id: idSchema,
});

// L'email et le hash du mot de passe n'apparaissent pas : ce profil est lisible
// par n'importe qui.
export const publicUserSchema = z.object({
  id: idSchema,
  username: z.string(),
  createdAt: z.string(),
  postCount: z.number().int(),
});

export type PublicUser = z.infer<typeof publicUserSchema>;
