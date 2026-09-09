import { CreatePostInput, FeedPage, FeedPost, FeedQuery } from "@petcircle/contracts";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../http/errors";
import { AuthUser } from "../auth/auth.schema";

const FEED_ORDER = [{ createdAt: "desc" }, { id: "desc" }] as const;

export interface FeedFilter {
  authorId?: string;
}

export async function listFeed(query: FeedQuery, filter: FeedFilter = {}): Promise<FeedPage> {
  const posts = await prisma.post.findMany({
    where: filter.authorId === undefined ? {} : { authorId: filter.authorId },
    orderBy: [...FEED_ORDER],
    take: query.limit + 1,
    ...(query.cursor === undefined
      ? {}
      : { cursor: { id: query.cursor }, skip: 1 }),
    include: {
      author: { select: { id: true, username: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  const hasMore = posts.length > query.limit;
  const page = posts.slice(0, query.limit);
  const last = page.at(-1);

  if (page.length === 0 && query.cursor !== undefined) {
    const cursorPost = await prisma.post.findUnique({
      where: { id: query.cursor },
      select: { id: true },
    });

    if (cursorPost === null) {
      throw new HttpError(400, "Invalid cursor", {
        cursor: "Ce post n'existe plus, recharge le fil.",
      });
    }
  }

  return {
    items: page.map((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt.toISOString(),
      author: post.author,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
    })),
    nextCursor: hasMore ? (last?.id ?? null) : null,
  };
}


export async function getPostById(id: string): Promise<FeedPost> {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      _count: { select: { likes: true, comments: true } },
      author: { select: { id: true, username: true } },
    },
  });

  if (post === null) {
    throw new HttpError(404, "Post not found", {
      id: "Post introuvable",
    });
  }
  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt.toISOString(),
    author: post.author,
    likeCount: post._count.likes,
    commentCount: post._count.comments,
  };
}


export async function deletePost(id: string, user: AuthUser): Promise<void> {

  const post = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (post === null) {
    throw new HttpError(404, "Post not found");
  }

  if (post.authorId !== user.id) {
    throw new HttpError(403, "You cannot delete this post");
  }

  await prisma.post.delete({ where: { id } });
}

export async function createPost(input: CreatePostInput,imageUrl: string | null,user: AuthUser,): Promise<FeedPost> {
  const post = await prisma.post.create({
    data: {
      content: input.content,
      imageUrl,
      authorId: user.id,
    },
    include: {
      author: { select: { id: true, username: true } },
    },
  });

  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt.toISOString(),
    author: post.author,
    likeCount: 0,
    commentCount: 0,
  };
}
