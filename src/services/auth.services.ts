import bcrypt from "bcrypt";
import User from "../db/models/User.js";

import HttpError from "../utils/HttpError.js";

import { RegisterPayload } from "../schemas/auth.schemas.js";

export const registerUser = async (payload: RegisterPayload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) throw HttpError(409, "Email already exist");

  const hashPassword = await bcrypt.hash(payload.password, 10);
  return User.create({ ...payload, password: hashPassword });
};

// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken"

// import User from "../db/models/User.js";
// import HttpError from "../utils/HttpError.js";

// import { UserDocument } from "../db/models/User.js";
// import { LoginPayload } from "../schemas/auth.schemas.js";

// const { JWT_SECRET = "devsecret" } = process.env;

// export interface ILoginResponse {
//   token: string;
//   user: IUserDto;
// }

// export interface IJWTTokenPayload {
//   id: string;
// }

// const createToken = (user: UserDocument): string => {
//   const payload: IJWTTokenPayload = {
//     id: user.id.toString(),
//   };

//   const token = jwt.sign(payload, JWT_SECRET, {
//     expiresIn: "24h",
//   });

//   return token;
// };

// export const login = async ({
//   identifier,
//   password,
// }: LoginPayload): Promise<ILoginResponse> => {
//   const user = (await User.findOne({
//     $or: [{ email: identifier }, { username: identifier }],
//   })) as UserDocument | null;

//   if (!user) {
//     throw HttpError(401, `User with identifier ${identifier} not exist`);
//   }

//   if (!user.verify) {
//     throw HttpError(403, "Please verify your email before logging in");
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     throw HttpError(401, "Password invalid");
//   }

//   const token = createToken(user);
//   user.token = token;
//   await user.save();

//   return {
//     token,
//     user: toUserDto(user),
//   };
// };

// export const getCurrent = async (user: UserDocument): Promise<ILoginResponse> => {
//   return {
//     token: user.token!,
//     user: toUserDto(user),
//   };
// };

// export const logout = async ({ _id }: UserDocument): Promise<void> => {
//   const user = (await User.findById(_id)) as UserDocument | null;

//   if (!user) {
//     throw HttpError(401, `User not found`);
//   }

//   user.token = "";
//   await user.save();
// };
