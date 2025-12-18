import User from "../db/models/User.js";
import { Types } from "mongoose";


// Получить пользователя по username с populated followers/following
export const getUserProfileService = async (username: string) => {
  const user = await User.findOne({ username })
    .select("-password -verificationCode -token -__v")
    .populate("followers", "username avatarUrl")
    .populate("following", "username avatarUrl");
  if (!user) throw new Error("User not found");
  return user;
};

// Получить пользователя по ID с populated followers/following
export const getUserByIdService = async (userId: string) => {
  const user = await User.findById(userId)
    .select("-password -verificationCode -token -__v")
    .populate("followers", "username avatarUrl")
    .populate("following", "username avatarUrl");
  if (!user) throw new Error("User not found");
  return user;
};

const followUser = async (
  targetUserId: string,
  currentUserId: Types.ObjectId,
) => {
  if (targetUserId === currentUserId.toString()) {
    throw new Error("Нельзя подписаться на себя");
  }

  const [targetUser, currentUser] = await Promise.all([
    User.findById(targetUserId),
    User.findById(currentUserId),
  ]);

  if (!targetUser || !currentUser) {
    throw new Error("Пользователь не найден");
  }

  if (!targetUser.followers.some(id => id.equals(currentUserId))) {
    targetUser.followers.push(currentUserId);
  }

  if (!currentUser.following.some(id => id.equals(targetUser._id))) {
    currentUser.following.push(targetUser._id);
  }

  await Promise.all([targetUser.save(), currentUser.save()]);

  return targetUser.toObject();
};


// Отписка
const unfollowUser = async (
  targetUserId: string,
  currentUserId: Types.ObjectId,
) => {
   const [targetUser, currentUser] = await Promise.all([
    User.findById(targetUserId),
    User.findById(currentUserId),
  ]);

  if (!targetUser || !currentUser) {
    throw new Error("Пользователь не найден");
  }

  targetUser.followers = targetUser.followers.filter(
    id => !id.equals(currentUserId)
  );

  currentUser.following = currentUser.following.filter(
    id => !id.equals(targetUser._id)
  );

  await Promise.all([targetUser.save(), currentUser.save()]);

  return targetUser.toObject(); 
};

export default {
  followUser,
  unfollowUser,
  getUserProfileService,
  getUserByIdService

};
