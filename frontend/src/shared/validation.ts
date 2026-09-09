import type { ZodError } from "zod";
import type { FieldErrors } from "./api/mutation/mutation";

export function toFieldErrors(error: ZodError): FieldErrors {
    const fields: FieldErrors = {};

    for (const issue of error.issues) {
        const key = String(issue.path[0]);

        if (fields[key] === undefined) {
            fields[key] = issue.message;
        }
    }

    return fields;
}
