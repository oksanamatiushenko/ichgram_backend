import bcrypt from "bcrypt";
import { Types } from "mongoose";
import HttpError from "../utils/HttpError.js";
import User, { IUserDocument } from "../db/models/User.js";
import { LoginPayload, RegisterPayload } from "../schemas/auth.schemas.js";
import { verifyToken } from "../utils/jwt.js";
import createTokens from "../utils/createTokens.js";

export type UserFindResult = IUserDocument | null;
export interface ILoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    username: string;
  };
}

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

export const logoutUser = async (_id: Types.ObjectId) => {
  await User.findByIdAndUpdate(_id, {
    accessToken: null,
    refreshToken: null,
  });
};

export const refreshUser = async (
  refreshTokenOld: string,
): Promise<ILoginResult> => {
  // Проверяем, что токен передан
  if (!refreshTokenOld) {
    throw HttpError(401, "Refresh token missing");
  }

  // Проверяем JWT
  const { error, data } = verifyToken(refreshTokenOld);
  if (error) throw HttpError(401, error.message);
  if (!data) throw HttpError(401, "Invalid refresh token");

  // Ищем пользователя с этим refreshToken в базе
  const user: UserFindResult = await findUser({
    refreshToken: refreshTokenOld,
  });
  if (!user) throw HttpError(401, "User not found");

  // Генерируем новые токены
  const { accessToken, refreshToken } = createTokens(user._id);
  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  console.log("New refresh token:", refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      email: user.email,
      username: user.username,
    },
  };
};
