import { Types, Schema, model } from "mongoose";

import { emailRegex, fullnameRegex, usernameRegex } from "../../constants/auth.constants.js";

import { handleSaveError, setUpdateSettings } from "../hooks.js";

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  fullname: string;
  username: string;
  password: string;
  verify: boolean;
  accessToken?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: emailRegex,
      unique: true,
      required: true,
    },
    fullname: {
      type: String,
      match: fullnameRegex,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      match: usernameRegex,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post("save", handleSaveError);

userSchema.pre(/findOneAndUpdate/, setUpdateSettings);
userSchema.post(/findOneAndUpdate/, handleSaveError);

const User = model<IUserDocument>("user", userSchema);

export default User;
