import { Prisma } from "@prisma/client";
import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError, ZodIssue } from "zod";
import config from "../config";
import AppError from "../errors/appError";

// ! Global error handler middleware for all errors thrown during the request lifecycle
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode;
  let message = err.message || "Something went wrong!"; // Default error message
  let error = err; // Default error object to return

  // * Prisma validation error (usually thrown for invalid data formats)
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Validation Error"; // Customize message for Prisma validation error
    error = err.message; // Attach the Prisma error message
  }
  // * Prisma known request error (e.g., unique constraint violation)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // ? If error code is 'P2002', it indicates a unique constraint violation (duplicate key)
    if (err.code === "P2002") {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Duplicate Key error"; // Customize message for duplicate key errors
      error = err.meta; // Attach meta data from Prisma error for more details
    }
  }
  // * Zod validation error (thrown when data does not match the schema)
  else if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Zod Validation Error"; // Customize message for Zod validation error
    // ? Map through Zod issues to get relevant error details (path and message)
    error = err.issues.map((issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1], // Extract field name from the error path
        message: issue?.message, // Error message for the field
      };
    });
  }
  // * AppError (custom error class for business logic errors)
  else if (err instanceof AppError) {
    message = err?.message; // Use message from AppError
    error = err.message; // Customize error output based on AppError message
  }

  // ! Return the error response with the determined status code and error details
  return res.status(statusCode ?? httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message,
    error,
    // ? Stack trace is only included in development environment for debugging purposes
    stack: config.NODE_ENV === "development" ? err.stack : null,
  });
};

export default globalErrorHandler;
