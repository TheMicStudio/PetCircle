import { HttpError } from "../../http/errors";
import { prisma } from "../../lib/prisma";
import { FeedQuery } from "../posts/posts.schema";
import { FeedPage, listFeed } from "../posts/posts.service";

export interface PublicUser {
  id: string;
  username: string;
  createdAt: string;
  postCount: number;
}

export async function getPublicUser(id: string): Promise<PublicUser> {
  // select explicite : l'email et le hash du mot de passe ne sortent jamais.
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      createdAt: true,
      _count: { select: { posts: true } },
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
  };
}

export async function listUserPosts(id: string, query: FeedQuery): Promise<FeedPage> {
  // Vérifié d'abord : un utilisateur inexistant vaut 404, pas une page vide.
  await getPublicUser(id);

  return listFeed(query, { authorId: id });
}
