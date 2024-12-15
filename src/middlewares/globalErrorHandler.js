"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const appError_1 = __importDefault(require("../errors/appError"));
// ! Global error handler middleware for all errors thrown during the request lifecycle
const globalErrorHandler = (err, req, res, next) => {
    let statusCode;
    let message = err.message || "Something went wrong!"; // Default error message
    let error = err; // Default error object to return
    // * Prisma validation error (usually thrown for invalid data formats)
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = "Validation Error"; // Customize message for Prisma validation error
        error = err.message; // Attach the Prisma error message
    }
    // * Prisma known request error (e.g., unique constraint violation)
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // ? If error code is 'P2002', it indicates a unique constraint violation (duplicate key)
        if (err.code === "P2002") {
            statusCode = http_status_1.default.BAD_REQUEST;
            message = "Duplicate Key error"; // Customize message for duplicate key errors
            error = err.meta; // Attach meta data from Prisma error for more details
        }
    }
    // * Zod validation error (thrown when data does not match the schema)
    else if (err instanceof zod_1.ZodError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = "Zod Validation Error"; // Customize message for Zod validation error
        // ? Map through Zod issues to get relevant error details (path and message)
        error = err.issues.map((issue) => {
            return {
                path: issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1], // Extract field name from the error path
                message: issue === null || issue === void 0 ? void 0 : issue.message, // Error message for the field
            };
        });
    }
    // * AppError (custom error class for business logic errors)
    else if (err instanceof appError_1.default) {
        message = err === null || err === void 0 ? void 0 : err.message; // Use message from AppError
        error = err.message; // Customize error output based on AppError message
    }
    // ! Return the error response with the determined status code and error details
    return res.status(statusCode !== null && statusCode !== void 0 ? statusCode : http_status_1.default.INTERNAL_SERVER_ERROR).json({
        success: false,
        message,
        error,
        // ? Stack trace is only included in development environment for debugging purposes
        stack: config_1.default.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.default = globalErrorHandler;
