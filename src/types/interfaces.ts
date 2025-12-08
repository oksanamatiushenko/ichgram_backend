import { Request } from "express";

import { IUserDocument } from "../db/models/User.js";

export interface ResponseError extends Error {
  status: number;
}

export interface AuthRequest extends Request {
  user?: IUserDocument;
}