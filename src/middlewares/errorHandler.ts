import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../types/interfaces.js";

const errorHandler = (
  error: ResponseError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const { status = 500, message = "Server error" } = error;
  res.status(status).json({
    message,
  });
};

export default errorHandler;
