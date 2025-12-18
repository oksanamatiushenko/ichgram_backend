import { Schema, Document, model, Types } from "mongoose";
import { handleSaveError, setUpdateSettings } from "../hooks.js";

export interface IPost extends Document {
  author: Types.ObjectId;
  imageUrl: string;
  caption?: string;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  createdAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

postSchema.post("save", handleSaveError);
postSchema.pre(/findOneAndUpdate/, setUpdateSettings);
postSchema.post("findOneAndUpdate", handleSaveError);

const Post = model<IPost>("Post", postSchema);

export default Post;
