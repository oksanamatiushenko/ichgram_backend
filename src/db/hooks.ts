import { Document, CallbackError, Query } from "mongoose";

type MongooseErrorWithStatus = CallbackError & { status?: number };
type MongooseNext = (err?: CallbackError) => void;

export const handleSaveError = (
  error: MongooseErrorWithStatus,
  doc: Document,
  next: MongooseNext,
) => {
  if (error?.name === "ValidationError") {
    error.status = 400;
  }
  if (error?.name === "MongoServerError") {
    error.status = 409;
  }
  next(error);
};

export const setUpdateSettings = function (this: Query<unknown, Document>) {
  this.setOptions({
    new: true,
    runValidators: true,
  });
};
