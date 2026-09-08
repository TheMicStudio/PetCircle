import { Prisma } from "@prisma/client";
import { HttpError } from "../../http/errors";
import { prisma } from "../../lib/prisma";
import { AuthUser } from "../auth/auth.schema";

export interface LikeState {
  liked: boolean;
  likeCount: number;
}

const UNIQUE_CONSTRAINT_ERROR = "P2002";

async function countLikes(postId: string): Promise<number> {
  return prisma.like.count({ where: { postId } });
}

async function requirePost(postId: string): Promise<void> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (post === null) {
    throw new HttpError(404, "Post not found");
  }
}

export async function likePost(postId: string, user: AuthUser): Promise<LikeState> {
  await requirePost(postId);

  try {
    await prisma.like.create({ data: { postId, userId: user.id } });
  } catch (error) {
    // La contrainte unique garantit l'unicité même en cas de double clic :
    // le second like est refusé par la base, pas par une lecture préalable.
    const isDuplicate =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === UNIQUE_CONSTRAINT_ERROR;

    if (!isDuplicate) {
      throw error;
    }
  }

  return { liked: true, likeCount: await countLikes(postId) };
}

export async function unlikePost(postId: string, user: AuthUser): Promise<LikeState> {
  await requirePost(postId);

  // deleteMany ne lève pas quand il n'y a rien à supprimer : retirer un like
  // absent est sans effet plutôt qu'une erreur.
  await prisma.like.deleteMany({ where: { postId, userId: user.id } });

  return { liked: false, likeCount: await countLikes(postId) };
}
