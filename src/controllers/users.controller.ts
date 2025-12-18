import { Request, Response } from "express";
import User from "../db/models/User.js";
import HttpError from "../utils/HttpError.js";
import usersService from "../services/users.services.js";
import { Types } from "mongoose";

export const getUserByUsernameController = async (
  req: Request,
  res: Response,
) => {
  const { username } = req.params;
  if (!username) throw HttpError(400, "Username is required");

  try {
    const user = await usersService.getUserProfileService(username);

    res.json({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      avatarUrl: user.avatarUrl || "/icon-no-profile.svg",
      bio: user.bio || "",
      link: user.link || "",
      followers: user.followers || [],
      following: user.following || [],
    });
  } catch (error: unknown) {
    const err = error as Error;
    const status = err.message === "User not found" ? 400 : 404;
    res.status(status).json({ message: err.message });
  }
};

export const updateUserProfileController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?._id as Types.ObjectId;
  const { fullname, bio, link } = req.body;

  const user = await User.findById(userId);
  if (!user) throw HttpError(404, "User not found");

  if (fullname) user.fullname = fullname;
  if (bio) user.bio = bio;
  if (link) user.link = link;

  if (req.file) {
    user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
  }

  await user.save();

  res.json({
    message: "Profile updated",
    user: {
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      avatarUrl: user.avatarUrl || "/icon-no-profile.svg",
      bio: user.bio || "",
      link: user.link || "",
      followers: user.followers || [],
      following: user.following || [],
    },
  });
};

export const searchUsersController = async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query || typeof query !== "string") return res.json([]);
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 1) return res.json([]);
  const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^${escapedQuery}`, "i");
  const users = await User.find({
    $or: [{ username: regex }, { fullname: regex }],
  })
    .select("_id username fullname avatarUrl")
    .limit(10);
  res.json(users);
};

export const followUserController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user?._id as Types.ObjectId;

    if (!currentUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const updatedUser = await usersService.followUser(
      targetUserId,
      currentUserId,
    );

    updatedUser.followers = updatedUser.followers || [];
    updatedUser.following = updatedUser.following || [];

    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    const err = error as Error;
    const status = err.message === "Нельзя подписаться на себя" ? 400 : 404;
    res.status(status).json({ message: err.message });
  }
};

export const unfollowUserController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user?._id as Types.ObjectId;

    if (!currentUserId)
      return res.status(401).json({ message: "Unauthorized" });

    const updatedUser = await usersService.unfollowUser(
      targetUserId,
      currentUserId,
    );

    updatedUser.followers = updatedUser.followers || [];
    updatedUser.following = updatedUser.following || [];

    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ message: err.message });
  }
};
