import { NextFunction, Request, RequestHandler, Response } from "express"; // * Importing necessary types from Express

// !! A higher-order function that wraps an async request handler to catch errors
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // * Wrapping the asynchronous request handler in a Promise to catch unhandled errors
    Promise.resolve(fn(req, res, next)).catch((err) => next(err)); // !! Passing any caught errors to the next middleware (error handler)
  };
};

// * Exporting the catchAsync function for use in other parts of the application
export default catchAsync;
