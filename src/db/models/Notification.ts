import { Schema, model, Document, Types } from "mongoose";
import { handleSaveError, setUpdateSettings } from "../hooks.js";


export interface INotification extends Document {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: "like" | "comment" | "follow" | "likeOnComment";
  post?: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["like", "comment", "follow", "likeOnComment"],
      required: true,
    },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: false },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

notificationSchema.post("save", handleSaveError);
notificationSchema.pre(/findOneAndUpdate/, setUpdateSettings);
notificationSchema.post("findOneAndUpdate", handleSaveError);

const Notification = model<INotification>(
  "notification",
  notificationSchema,
);

export default Notification;