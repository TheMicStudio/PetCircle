import { Prisma } from "@prisma/client";
import { HttpError } from "../../http/errors";
import { prisma } from "../../lib/prisma";
import { AuthUser } from "../auth/auth.schema";

export interface FollowState {
  following: boolean;
  followerCount: number;
}

const UNIQUE_CONSTRAINT_ERROR = "P2002";

// 404 when the user does not exist
async function requireUserExists(id: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });

  if (user === null) {
    throw new HttpError(404, "User not found");
  }
}

// how many people follow this user
async function countFollowers(userId: string): Promise<number> {
  return prisma.follow.count({ where: { followingId: userId } });
}

// follow someone, doing it twice changes nothing
export async function followUser(targetId: string, user: AuthUser): Promise<FollowState> {
  if (targetId === user.id) {
    throw new HttpError(400, "You cannot follow yourself");
  }

  await requireUserExists(targetId);

  try {
    await prisma.follow.create({
      data: { followerId: user.id, followingId: targetId },
    });
  } catch (error) {
    // like the likes: the database keeps it unique, so a second call does nothing
    const isDuplicate =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === UNIQUE_CONSTRAINT_ERROR;

    if (!isDuplicate) {
      throw error;
    }
  }

  return { following: true, followerCount: await countFollowers(targetId) };
}

// stop following someone
export async function unfollowUser(targetId: string, user: AuthUser): Promise<FollowState> {
  await requireUserExists(targetId);

  await prisma.follow.deleteMany({
    where: { followerId: user.id, followingId: targetId },
  });

  return { following: false, followerCount: await countFollowers(targetId) };
}

// does the caller already follow this user
export async function isFollowing(targetId: string, viewerId: string | undefined): Promise<boolean> {
  if (viewerId === undefined) {
    return false;
  }

  const follow = await prisma.follow.findFirst({
    where: { followerId: viewerId, followingId: targetId },
    select: { id: true },
  });

  return follow !== null;
}

// used by the following feed
export async function listFollowedUserIds(viewerId: string): Promise<string[]> {
  const follows = await prisma.follow.findMany({
    where: { followerId: viewerId },
    select: { followingId: true },
  });

  return follows.map((follow) => follow.followingId);
}
