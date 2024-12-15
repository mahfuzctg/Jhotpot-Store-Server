"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// !! A higher-order function that wraps an async request handler to catch errors
const catchAsync = (fn) => {
    return (req, res, next) => {
        // * Wrapping the asynchronous request handler in a Promise to catch unhandled errors
        Promise.resolve(fn(req, res, next)).catch((err) => next(err)); // !! Passing any caught errors to the next middleware (error handler)
    };
};
// * Exporting the catchAsync function for use in other parts of the application
exports.default = catchAsync;
