import { FeedPage, FeedQuery, PublicUser } from "@petcircle/contracts";
import { HttpError } from "../../http/errors";
import { prisma } from "../../lib/prisma";
import { isFollowing } from "../follows/follows.service";
import { listFeed } from "../posts/posts.service";

// public profile, no email and no password
export async function getPublicUser(id: string, viewerId?: string): Promise<PublicUser> {
  // explicit select: email and password hash never go out
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      createdAt: true,
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });

  if (user === null) {
    throw new HttpError(404, "User not found");
  }

  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt.toISOString(),
    postCount: user._count.posts,
    followerCount: user._count.followers,
    followingCount: user._count.following,
    followedByMe: await isFollowing(id, viewerId),
  };
}

export async function listUserPosts(
  id: string,
  query: FeedQuery,
  viewerId?: string,
): Promise<FeedPage> {
  // check the user first: unknown user is a 404, not an empty page
  await getPublicUser(id);

  return listFeed(query, { authorId: id, viewerId });
}
