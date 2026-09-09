import {
  CommentPage,
  CommentsQuery,
  CreateCommentInput,
  PostComment,
} from "@petcircle/contracts";
import { HttpError } from "../../http/errors";
import { prisma } from "../../lib/prisma";
import { AuthUser } from "../auth/auth.schema";

interface CommentRecord {
  id: string;
  content: string;
  createdAt: Date;
  author: { id: string; username: string };
}

// without this check Prisma throws a foreign key error, so a 500
async function requirePost(postId: string): Promise<void> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (post === null) {
    throw new HttpError(404, "Post not found");
  }
}

// public shape of a comment
function toComment(comment: CommentRecord): PostComment {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    author: comment.author,
  };
}

// oldest first: a discussion is read from top to bottom
const COMMENT_ORDER = [{ createdAt: "asc" }, { id: "asc" }] as const;

// comments of a post, page by page
export async function listComments(postId: string, query: CommentsQuery): Promise<CommentPage> {
  await requirePost(postId);

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: [...COMMENT_ORDER],
    take: query.limit + 1,
    ...(query.cursor === undefined
      ? {}
      : { cursor: { id: query.cursor }, skip: 1 }),
    include: {
      author: { select: { id: true, username: true } },
    },
  });

  const hasMore = comments.length > query.limit;
  const page = comments.slice(0, query.limit);
  const last = page.at(-1);

  return {
    items: page.map(toComment),
    nextCursor: hasMore ? (last?.id ?? null) : null,
  };
}

// add a comment on a post
export async function createComment(
  postId: string,
  input: CreateCommentInput,
  user: AuthUser,
): Promise<PostComment> {
  await requirePost(postId);

  const comment = await prisma.comment.create({
    data: {
      content: input.content,
      postId,
      authorId: user.id,
    },
    include: {
      author: { select: { id: true, username: true } },
    },
  });

  return toComment(comment);
}

// only the author can delete his comment
export async function deleteComment(id: string, user: AuthUser): Promise<void> {
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (comment === null) {
    throw new HttpError(404, "Comment not found");
  }

  if (comment.authorId !== user.id) {
    throw new HttpError(403, "You cannot delete this comment");
  }

  await prisma.comment.delete({ where: { id } });
}
