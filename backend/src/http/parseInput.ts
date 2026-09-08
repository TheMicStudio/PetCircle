import { ZodType } from "zod";
import { HttpError } from "./errors";

// Valide n'importe quelle entrée client : corps, query ou paramètres d'URL.
// Un seul passage, donc toutes les erreurs de champs sont renvoyées ensemble,
// ce que le formulaire d'inscription (S1) attend.
export function parseInput<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  const fields: Record<string, string> = {};

  for (const issue of result.error.issues) {
    // join gère les schémas imbriqués : author.username plutôt que author.
    const field = issue.path.join(".");

    if (field.length > 0 && fields[field] === undefined) {
      fields[field] = issue.message;
    }
  }

  throw new HttpError(400, "Validation failed", fields);
}
