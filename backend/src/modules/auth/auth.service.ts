import bcrypt from "bcryptjs";
import { HttpError } from "../../http/errors";
import { prisma } from "../../lib/prisma";
import { AuthResult, LoginInput, RegisterInput } from "@petcircle/contracts";
import { toUserRole } from "./auth.schema";
import { generateToken } from "./token.service";

const PASSWORD_SALT_ROUNDS = 10;

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing !== null) {
    throw new HttpError(409, "Email already used", {
      email: "Cet email est déjà utilisé",
    });
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      password: await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS),
    },
  });

  return {
    token: generateToken({ id: user.id, role: toUserRole(user.role) }),
    user: { id: user.id, email: user.email, username: user.username },
  };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (user === null) {
    throw new HttpError(401, "Invalid credentials");
  }

  const valid = await bcrypt.compare(input.password, user.password);

  if (!valid) {
    throw new HttpError(401, "Invalid credentials");
  }

  return {
    token: generateToken({ id: user.id, role: toUserRole(user.role) }),
    user: { id: user.id, email: user.email, username: user.username },
  };
}
