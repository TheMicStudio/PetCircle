import { NextFunction, Request, Response } from "express";
import { HttpError } from "../http/errors";
import { AuthUser } from "../modules/auth/auth.schema";
import { TOKEN_COOKIE, verifyToken } from "../modules/auth/token.service";

const BEARER_PREFIX = "Bearer ";

// read the token from the Authorization header
function readBearerToken(header: string | undefined): string | null {
  if (header === undefined || !header.startsWith(BEARER_PREFIX)) {
    return null;
  }

  const token = header.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

// the cookie is the normal path, the header stays for API clients
function readToken(req: Request): string | null {
  const cookie: unknown = req.cookies?.[TOKEN_COOKIE];

  if (typeof cookie === "string" && cookie.length > 0) {
    return cookie;
  }

  return readBearerToken(req.headers.authorization);
}

// stop the request when the token is missing or bad
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = readToken(req);

  if (token === null) {
    throw new HttpError(401, "No token provided");
  }

  const user = verifyToken(token);

  if (user === null) {
    throw new HttpError(401, "Invalid token");
  }

  req.user = user;
  next();
}

// for public routes: no token is fine, a bad token is still an error
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = readToken(req);

  if (token !== null) {
    const user = verifyToken(token);

    if (user === null) {
      throw new HttpError(401, "Invalid token");
    }

    req.user = user;
  }

  next();
}

// use it after authenticate, it avoids a cast on req
export function requireUser(req: Request): AuthUser {
  if (req.user === undefined) {
    throw new Error("requireUser called on a route without authenticate");
  }

  return req.user;
}
