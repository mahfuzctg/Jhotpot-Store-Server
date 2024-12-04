import { Request, Response } from "express";
import httpStatus from "http-status";

// ! Middleware to handle 404 errors when no matching route is found
const notFound = (req: Request, res: Response) => {
  // * Return a 404 response with error details
  return res.status(httpStatus.NOT_FOUND).json({
    success: false, // ? Indicates the response is an error
    message: "API NOT FOUND!", // ? Main message to inform the user of the error
    error: {
      path: req.originalUrl, // ? Log the path the user tried to access
      message: "Your requested path is not found!", // Custom message about the error
    },
  });
};

export default notFound;
