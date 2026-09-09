-- one like per user and per post (S6), enforced by the database
CREATE UNIQUE INDEX "Like_postId_userId_key" ON "Like"("postId", "userId");
