import { Router } from "express";

import { authRouter } from "./modules/auth/auth.routes";
import { commentsRouter, postCommentsRouter } from "./modules/comments/comments.routes";
import { likesRouter } from "./modules/likes/likes.routes";
import { postsRouter } from "./modules/posts/posts.routes";
import { usersRouter } from "./modules/users/users.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/posts", postsRouter);
router.use("/posts", postCommentsRouter);
router.use("/posts", likesRouter);
router.use("/comments", commentsRouter);
router.use("/users", usersRouter);

export default router;
