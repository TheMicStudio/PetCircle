import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const POST_COUNT = 60;
const CAPTIONS = ['Belle journée', 'Balade au parc', 'Sieste au soleil', 'Nouveau jouet', 'Premier bain'];
const COMMENTS = ['Trop mignon', 'Bravo', 'On adore', 'Magnifique'];

async function main(): Promise<void> {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const password = bcrypt.hashSync('password123', 4);
  await prisma.user.createMany({
    data: [
      { id: 'seed-alice', email: 'alice@test.com', username: 'alice', password },
      { id: 'seed-bob', email: 'bob@test.com', username: 'bob', password },
      { id: 'seed-admin', email: 'admin@test.com', username: 'admin', password, role: 'ADMIN' },
    ],
  });

  const authors = ['seed-alice', 'seed-bob', 'seed-admin'];
  const start = Date.now() - POST_COUNT * 60 * 60 * 1000;
  await prisma.post.createMany({
    data: Array.from({ length: POST_COUNT }, (_, index) => ({
      id: `seed-post-${String(index).padStart(3, '0')}`,
      content: `${CAPTIONS[index % CAPTIONS.length]} #${index}`,
      imageUrl: index % 2 === 0 ? `/seed-images/img-${String((index % 20) + 1).padStart(2, '0')}.jpg` : null,
      authorId: authors[index % authors.length],
      createdAt: new Date(start + index * 60 * 60 * 1000),
    })),
  });

  await prisma.comment.createMany({
    data: Array.from({ length: POST_COUNT }, (_, index) => ({
      content: COMMENTS[index % COMMENTS.length],
      postId: `seed-post-${String(index).padStart(3, '0')}`,
      authorId: authors[(index + 1) % authors.length],
    })),
  });

  await prisma.like.createMany({
    data: Array.from({ length: POST_COUNT }, (_, index) => ({
      postId: `seed-post-${String(index).padStart(3, '0')}`,
      userId: authors[(index + 2) % authors.length],
    })),
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
