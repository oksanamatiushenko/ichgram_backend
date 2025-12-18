import { Request, Response, RequestHandler } from "express";
import { registerUser, loginUser, logoutUser, refreshUser } from "../services/auth.services.js"
import validateBody from "../utils/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/auth.schemas.js";
import { AuthRequest } from "../types/interfaces.js";
import HttpError from "../utils/HttpError.js";

export const registerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  validateBody(registerSchema, req.body);
  await registerUser(req.body);

  res.status(201).json({
    message: "User register successfully",
  });
};

export const loginController: RequestHandler = async (req, res) => {
  validateBody(loginSchema, req.body);
  const result = await loginUser(req.body);

  res.status(200).json(result);
};

export const getCurrentController = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw HttpError(401, "User not authenticated");
  }

  res.json({
    user: {
      email: req.user.email,
      username: req.user.username,
      avatarUrl: req.user.avatarUrl || null,
    },
  });
};

export const logoutController = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw HttpError(401, "User not authenticated");

  await logoutUser(req.user._id);

  res.json({ message: "Logout successfully" });
  
};

export const refreshController: RequestHandler = async (req, res) => {
  const result = await refreshUser(req.body.refreshToken);

  res.json(result);
};