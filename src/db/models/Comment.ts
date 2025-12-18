import { Schema, model, Document, Types } from "mongoose";
import { handleSaveError, setUpdateSettings } from "../hooks.js";

export interface IComment extends Document {
  author: Types.ObjectId;
  text: string;
  likes: Types.ObjectId[];
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

commentSchema.post("save", handleSaveError);
commentSchema.pre(/findOneAndUpdate/, setUpdateSettings);
commentSchema.post("findOneAndUpdate", handleSaveError);

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;