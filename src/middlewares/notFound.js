"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
// ! Middleware to handle 404 errors when no matching route is found
const notFound = (req, res) => {
    // * Return a 404 response with error details
    return res.status(http_status_1.default.NOT_FOUND).json({
        success: false, // ? Indicates the response is an error
        message: "API NOT FOUND!", // ? Main message to inform the user of the error
        error: {
            path: req.originalUrl, // ? Log the path the user tried to access
            message: "Your requested path is not found!", // Custom message about the error
        },
    });
};
exports.default = notFound;
