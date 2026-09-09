import { ZodType } from "zod";
import { HttpError } from "./errors";

// validates any client input: body, query or URL params.
// one pass, so the user gets all the field errors at once (S1)
export function parseInput<T>(schema: ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  const fields: Record<string, string> = {};

  for (const issue of result.error.issues) {
    // join handles nested schemas: author.username
    const field = issue.path.join(".");

    if (field.length > 0 && fields[field] === undefined) {
      fields[field] = issue.message;
    }
  }

  throw new HttpError(400, "Validation failed", fields);
}
