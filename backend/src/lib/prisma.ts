
import { PrismaClient } from "@prisma/client";

// one Prisma client for the whole app
export const prisma = new PrismaClient();
