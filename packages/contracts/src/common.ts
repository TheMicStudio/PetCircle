import { z } from "zod";

// Tout ce qui sort de ce paquet finit dans le bundle client : uniquement des
// contrats d'API. Jamais de Prisma, de hash, de payload JWT ni de config.

export const idSchema = z.string().min(1);

// Forme exacte produite par errorHandler : { error, fields? }.
export const apiErrorSchema = z.object({
  error: z.string(),
  fields: z.record(z.string(), z.string()).optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
