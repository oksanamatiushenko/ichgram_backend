import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import HttpError from "../utils/HttpError.js";

import User, { IUserDocument } from "../db/models/User.js";

import { LoginPayload, RegisterPayload } from "../schemas/auth.schemas.js";

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not define in environment variables");
}

type UserFindResult = IUserDocument | null;

export interface ILoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
  };
}

export const registerUser = async (payload: RegisterPayload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) throw HttpError(409, "Email already exist");

  const hashPassword = await bcrypt.hash(payload.password, 10);
  return User.create({ ...payload, password: hashPassword });
};

export const loginUser = async (
  payload: LoginPayload,
): Promise<ILoginResult> => {
  const user: UserFindResult = await User.findOne({
    //@ts-expect-error
    $or: [{ username: payload.username }, { email: payload.username }],
  });

  if (!user) throw HttpError(401, "User not found");

  const passwordCompare: boolean = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!passwordCompare) throw HttpError(401, "Password invalid!");
  const tokenPayload = {
    //@ts-expect-error
    id: user._id.toString(),
  };

  const accessToken: string = jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken: string = jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: "7d",
  });
//@ts-expect-error
  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  return {
    accessToken,
    refreshToken,
    user: {
      email: user.email,
    },
  };
};


