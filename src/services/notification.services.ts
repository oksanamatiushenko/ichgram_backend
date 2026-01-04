import Notification, { INotification } from "../db/models/Notification.js";
import { Types } from "mongoose";
import { io } from "../web-socketServer.js";

interface CreateNotificationParams {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: "like" | "comment" | "follow" | "likeOnComment";
  post?: Types.ObjectId;
}

export const createNotification = async ({
  recipient,
  sender,
  type,
  post,
}: CreateNotificationParams): Promise<INotification> => {
  // Формируем объект уведомления
  const notificationData: Partial<INotification> = {
    recipient,
    sender,
    type,
    isRead: false,
    ...(post ? { post } : {}), // добавляем post только если он есть
  };

  // Создаём и сохраняем уведомление
  const notification = new Notification(notificationData);
  const savedNotification = await notification.save();

  // Наполняем данные для отправки через WebSocket
  const populatedNotification = await Notification.findById(savedNotification._id)
    .populate("sender", "username avatarUrl")
    .populate({
      path: "post",
      select: "imageUrl",
    })
    .lean();

  // Отправляем уведомление получателю
  io.to(recipient.toString()).emit("newNotification", populatedNotification);

  return savedNotification;
};

export const getUserNotifications = async (
  userId: Types.ObjectId
): Promise<INotification[]> => {
  return await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .populate("sender", "username avatarUrl")
    .populate({
      path: "post",
      select: "imageUrl",
    })
    .lean();
};

export const markAsRead = async (userId: Types.ObjectId): Promise<void> => {
  await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  );
};
