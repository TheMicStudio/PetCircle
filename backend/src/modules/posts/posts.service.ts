import { prisma } from "../../lib/prisma";
import { FeedQuery } from "./posts.schema";
import { HttpError } from "../../http/errors";
import { AuthUser } from "../auth/auth.schema";
import { CreatePostInput } from "./posts.schema";



export interface FeedPost {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: { id: string; username: string };
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}


export interface FeedPage {
  items: FeedPost[];
  nextCursor: string | null;
}
const FEED_ORDER = [{ createdAt: "desc" }, { id: "desc" }] as const;

export interface FeedFilter {
  authorId?: string;
  authorIds?: string[];
  // id of the caller when we know it, used for likedByMe
  viewerId?: string;
}

interface PostRecord {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  author: { id: string; username: string };
  _count: { likes: number; comments: number };
  likes: { id: string }[];
}

// the only place where a post gets its public shape
function toFeedPost(post: PostRecord): FeedPost {
  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt.toISOString(),
    author: post.author,
    likeCount: post._count.likes,
    commentCount: post._count.comments,
    likedByMe: post.likes.length > 0,
  };
}

// no caller: the where clause matches nothing, so likedByMe stays false
function viewerLikeFilter(viewerId: string | undefined): { where: { userId: string } } {
  return { where: { userId: viewerId ?? "" } };
}

// the feed, one page at a time with a cursor
export async function listFeed(query: FeedQuery, filter: FeedFilter = {}): Promise<FeedPage> {
  const posts = await prisma.post.findMany({
    where: {
      ...(filter.authorId === undefined ? {} : { authorId: filter.authorId }),
      ...(filter.authorIds === undefined ? {} : { authorId: { in: filter.authorIds } }),
    },
    orderBy: [...FEED_ORDER],
    take: query.limit + 1,
    ...(query.cursor === undefined
      ? {}
      : { cursor: { id: query.cursor }, skip: 1 }),
    include: {
      author: { select: { id: true, username: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { ...viewerLikeFilter(filter.viewerId), select: { id: true } },
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
    items: page.map(toFeedPost),
    nextCursor: hasMore ? (last?.id ?? null) : null,
  };
}


// one post with its author and its counters
export async function getPostById(id: string, viewerId?: string): Promise<FeedPost> {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      _count: { select: { likes: true, comments: true } },
      author: { select: { id: true, username: true } },
      likes: { ...viewerLikeFilter(viewerId), select: { id: true } },
    },
  });

  if (post === null) {
    throw new HttpError(404, "Post not found");
  }
  return toFeedPost(post);
}

// only the author can delete his post
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

// create a post, the image is optional
export async function createPost(input: CreatePostInput,imageUrl: string | null,user: AuthUser,): Promise<FeedPost> {
  const post = await prisma.post.create({
    data: {
      content: input.content,
      imageUrl,
      authorId: user.id,
    },
    include: {
      author: { select: { id: true, username: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { ...viewerLikeFilter(user.id), select: { id: true } },
    },
  });

  return toFeedPost(post);
}
