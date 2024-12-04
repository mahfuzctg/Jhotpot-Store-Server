import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import catchAsync from "../utils/catchAsync";

// ! Middleware to validate request bodies using Zod schemas
const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // * Parse the request body using the provided schema
    await schema.parseAsync({
      body: req.body, // ? Pass the request body to Zod schema for validation
    });
    next(); // ? If validation is successful, continue to the next middleware
  });
};

// ! Middleware to validate cookies using Zod schemas
export const validateRequestCookies = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // * Parse the request cookies using the provided schema
    const parsedCookies = await schema.parseAsync({
      cookies: req.cookies, // ? Pass the request cookies to Zod schema for validation
    });

    // * Attach parsed cookies back to the request object
    req.cookies = parsedCookies.cookies;

    next(); // ? If validation is successful, continue to the next middleware
  });
};

export default validateRequest;
