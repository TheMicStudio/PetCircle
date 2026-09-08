import { HttpError } from "../../http/errors";
import { prisma } from "../../lib/prisma";
import { AuthUser } from "../auth/auth.schema";
import { CreateCommentInput } from "./comments.schema";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string };
}

interface CommentRecord {
  id: string;
  content: string;
  createdAt: Date;
  author: { id: string; username: string };
}

function toComment(comment: CommentRecord): Comment {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    author: comment.author,
  };
}

export async function createComment(
  postId: string,
  input: CreateCommentInput,
  user: AuthUser,
): Promise<Comment> {
  // Sans ce contrôle, Prisma lèverait une erreur de clé étrangère, donc un 500.
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (post === null) {
    throw new HttpError(404, "Post not found");
  }

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
