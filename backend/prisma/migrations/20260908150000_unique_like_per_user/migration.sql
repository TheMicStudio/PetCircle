-- Un seul like par utilisateur et par post (S6), garanti par la base.
CREATE UNIQUE INDEX "Like_postId_userId_key" ON "Like"("postId", "userId");
