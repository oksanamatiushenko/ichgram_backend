import bcrypt from "bcrypt";
import { Types } from "mongoose";
import HttpError from "../utils/HttpError.js";
import User, { IUserDocument } from "../db/models/User.js";
import { LoginPayload, RegisterPayload } from "../schemas/auth.schemas.js";
import { generateToken } from "../utils/jwt.js";

export type UserFindResult = IUserDocument | null;
export interface ILoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    username: string;
  };
}

export const createTokens = (id: Types.ObjectId) => {
  const accessToken: string = generateToken({ id }, { expiresIn: "15m" });
  const refreshToken: string = generateToken(
    { id },
    {
      expiresIn: "7d",
    },
  );
  return {
    accessToken,
    refreshToken,
  };
};

type UserQuery = Parameters<(typeof User)["findOne"]>[0];

export const findUser = (query: UserQuery): Promise<UserFindResult> =>
  User.findOne(query);

export const registerUser = async (
  payload: RegisterPayload,
): Promise<IUserDocument> => {
  const user: UserFindResult = await User.findOne({ email: payload.email });
  if (user) throw HttpError(409, "Email already exist");

  const hashPassword = await bcrypt.hash(payload.password, 10);
  return User.create({ ...payload, password: hashPassword });
};

export const loginUser = async (
  payload: LoginPayload,
): Promise<ILoginResult> => {
  const user: UserFindResult = await User.findOne({
    $or: [{ username: payload.email }, { email: payload.email }],
  });

  if (!user) throw HttpError(401, "User not found");

  const passwordCompare: boolean = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!passwordCompare) throw HttpError(401, "Password invalid!");

  const { accessToken, refreshToken } = createTokens(user._id);

  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  return {
    accessToken,
    refreshToken,
    user: {
      email: user.email,
      username: user.username,
    },
  };
};
