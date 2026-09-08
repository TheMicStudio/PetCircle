import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AuthUser, tokenPayloadSchema } from "./auth.schema";

export function generateToken(user: AuthUser): string {
  return jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresInSeconds,
  });
}

// Rend null plutôt que de lever : le code HTTP est choisi par le middleware.
export function verifyToken(token: string): AuthUser | null {
  let payload: unknown;

  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    return null;
  }

  // La signature garantit l'origine, pas la forme : le contenu reste à valider.
  const result = tokenPayloadSchema.safeParse(payload);

  if (!result.success) {
    return null;
  }

  return { id: result.data.userId, role: result.data.role };
}
