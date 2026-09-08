import type { AuthUser } from "../modules/auth/auth.schema";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
