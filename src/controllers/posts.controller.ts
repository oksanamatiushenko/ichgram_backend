import { Request, Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../types/interfaces.js";
import * as postsService from "../services/posts.services.js";
import { IUserDocument } from "../db/models/User.js";
import HttpError from "../utils/HttpError.js";
import { createPostService, getUserPostsService } from "../services/posts.services.js";


export const createPostController = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw HttpError(400, "Image is required");
  }
// console.log(req.file);
// console.log(req.user);

  const post = await createPostService({
    authorId: req.user!._id,
    imageUrl: `/uploads/posts/${req.file.filename}`,
    caption: req.body.caption || "",
  });
console.log("POST CREATED:", post._id);
  res.status(201).json(post);
  // console.log(req.body);
};

export const getUserPostsController = async (req, res) => {
  const { username } = req.params;

  const posts = await getUserPostsService(username);

  res.json(posts || []);
};

export const getPostByIdController = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Неверный ID поста" });
    }

    const post = await postsService.getPostByIdService(postId);

    if (!post) return res.status(404).json({ message: "Пост не найден" });

    res.json(post);
  } catch (error) {
    console.error("Ошибка получения поста с комментариями:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getExplorePosts = async (req: Request, res: Response) => {
  try {
    const posts = await postsService.getExplorePostsService();
    res.json(posts);
  } catch (error) {
    console.error("Error in getExplorePosts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likePostController = async (req: Request, res: Response) => {
  try {
    const postId = req.params;
    const userId = req.user._id;
    const likesCount = await postsService.likePost(postId, userId);
    res.json({ likesCount });
  } catch (err) {
    console.error("LIKE controller error:", err);

    if (err instanceof Error) {
      res
        .status(500)
        .json({ message: "Ошибка при лайке поста", error: err.message });
    } else {
      res.status(500).json({ message: "Неизвестная ошибка при лайке поста" });
    }
  }
};

export const unlikePostController = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const likesCount = await postsService.unlikePost(postId, userId);
    res.status(200).json({ likes: likesCount });
  } catch (err) {
    console.error("Ошибка в unlikePostController:", err);
    res.status(500).json({ message: "Ошибка при удалении лайка" });
  }
};

export const likeCommentController = async (req: Request, res: Response) => {
  try {
    const likesCount = await postsService.likeComment(
      req.params.commentId,
      req.user._id
    );
    res.status(200).json({ message: "Поставлен лайк", likesCount });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const unlikeCommentController = async (req: Request, res: Response) => {
  try {
    const likesCount = await postsService.unlikeComment(
      req.params.commentId,
      req.user._id
    );
    res.status(200).json({ message: "Лайк удалён", likesCount });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const deletePostController = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const success = await postsService.deletePost(postId, userId);
    if (!success) {
      return res.status(403).json({ message: "Нет прав на удаление поста" });
    }

    res.status(200).json({ message: "Пост удалён" });
  } catch (error) {
    console.error("Ошибка при удалении поста:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const editPostController = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { caption } = req.body;
    const userId = req.user._id;

    const updatedPost = await postsService.editPost(postId, caption, userId);
    if (!updatedPost) {
      return res.status(403).json({ message: "Нет доступа к редактированию" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Ошибка при редактировании поста:", error);
    res.status(500).json({ message: "Ошибка при редактировании поста" });
  }
};

export async function getFeedPostsController(req: Request, res: Response) {
  try {
    const userId = (req.user as IUserDocument)._id;

    const feedPosts = await postsService.getFeedPostsService(userId);
    res.status(200).json(feedPosts);
  } catch (error) {
    console.error("Ошибка в getFeedPostsController:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
}


export const createCommentController = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const authorId = String(req.user!._id);
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const comment = await postsService.createComment(postId, authorId, text);
    res.status(201).json(comment);
  } catch (error: any) {
    console.error("Create comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};