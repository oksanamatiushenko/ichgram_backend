import Router from "express";
import {
  getExplorePosts,
  createPostController,
  getUserPostsController,
  getPostByIdController,
  likeCommentController,
  unlikeCommentController,
  likePostController,
  unlikePostController,
  deletePostController,
  editPostController,
  getFeedPostsController,
  createCommentController,
} from "../controllers/posts.controller.js";
import authenticate from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const postsRouter = Router();

postsRouter.get("/", authenticate, getFeedPostsController);

postsRouter.get("/explore", getExplorePosts);

postsRouter.get("/:username/posts", getUserPostsController);
postsRouter.get("/:postId", getPostByIdController);

postsRouter.post(
  "/create-new-post",
  authenticate,
  upload.single("image"),
  createPostController,
);

postsRouter.post("/:postId/like", authenticate, likePostController);
postsRouter.post("/:postId/unlike", authenticate, unlikePostController);
postsRouter.post(
  "/:postId/comments/:commentId/like",
  authenticate,
  likeCommentController,
);
postsRouter.post(
  "/:postId/comments/:commentId/unlike",
  authenticate,
  unlikeCommentController,
);

postsRouter.post("/:postId/comments", authenticate, createCommentController);

postsRouter.delete("/:postId", authenticate, deletePostController);
postsRouter.put("/:postId/edit", authenticate, editPostController);

export default postsRouter;
