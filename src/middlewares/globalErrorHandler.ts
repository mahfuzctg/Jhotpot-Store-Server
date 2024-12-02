import { Prisma } from "@prisma/client";
import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError, ZodIssue } from "zod";
import config from "../config";
import AppError from "../errors/appError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode;
  let message = err.message || "Something went wrong!";
  let error = err;

  // Prisma validation error (usually thrown for invalid data formats)
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Validation Error";
    error = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma error code 'P2002' indicates a unique constraint violation (duplicate key error)
    if (err.code === "P2002") {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Duplicate Key error";
      error = err.meta;
    }
  }
  // Zod Validation Error
  else if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Zod Validation Error";
    error = err.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1],
        message: issue?.message,
      };
    });
  }
  // throw new AppError validation
  else if (err instanceof AppError) {
    message = err?.message;
    error = err.message;
  }

  return res.status(statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message,
    error,
    stack: config.NODE_ENV === "development" ? err.stack : null,
  });
};

export default globalErrorHandler;
