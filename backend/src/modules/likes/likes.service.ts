import { Prisma } from "@prisma/client";
import { HttpError } from "../../http/errors";
import { prisma } from "../../lib/prisma";
import { AuthUser } from "../auth/auth.schema";

export interface LikeState {
  liked: boolean;
  likeCount: number;
}

const UNIQUE_CONSTRAINT_ERROR = "P2002";

// how many likes on this post
async function countLikes(postId: string): Promise<number> {
  return prisma.like.count({ where: { postId } });
}

// 404 when the post does not exist
async function requirePost(postId: string): Promise<void> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (post === null) {
    throw new HttpError(404, "Post not found");
  }
}

// like a post, doing it twice changes nothing
export async function likePost(postId: string, user: AuthUser): Promise<LikeState> {
  await requirePost(postId);

  try {
    await prisma.like.create({ data: { postId, userId: user.id } });
  } catch (error) {
    // the unique constraint does the job, even on a double click
    const isDuplicate =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === UNIQUE_CONSTRAINT_ERROR;

    if (!isDuplicate) {
      throw error;
    }
  }

  return { liked: true, likeCount: await countLikes(postId) };
}

// remove the like if there is one
export async function unlikePost(postId: string, user: AuthUser): Promise<LikeState> {
  await requirePost(postId);

  // deleteMany does not throw when there is nothing, so unlike twice is fine
  await prisma.like.deleteMany({ where: { postId, userId: user.id } });

  return { liked: false, likeCount: await countLikes(postId) };
}
