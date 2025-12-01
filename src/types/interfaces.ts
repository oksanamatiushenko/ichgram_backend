import { Request } from "express";

import { UserDocument } from "../db/models/User.js";

export interface ResponseError extends Error {
  status: number;
}

export interface AuthenticatedRequest extends Request {
  user: UserDocument;
}