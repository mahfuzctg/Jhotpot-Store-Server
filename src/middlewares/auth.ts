/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";

import AppError from "../errors/appError";

import prisma from "../utils/prisma";
import { verifyToken } from "../utils/verifyJWT";

// ! The auth middleware to protect routes and check the user's role and validity of the token
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // * Retrieve the token from Authorization header
      const token = req.headers.authorization;

      // ? If no token is found in the request headers, throw an error
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      // * Verify the token using the JWT secret and extract the decoded data
      const decoded = verifyToken(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;

      // * Destructure role and email from decoded JWT payload
      const { role, email } = decoded;

      // * Check if the user exists in the database and is active
      await prisma.user.findUniqueOrThrow({
        where: {
          email,
          status: UserStatus.ACTIVE,
        },
      });

      // ? If roles are provided, ensure the user's role is authorized for this route
      if (roles.length && !roles.includes(role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
      }

      // ! Attach the decoded user data to the request object for use in other middleware or route handlers
      req.user = decoded as JwtPayload;

      // * Proceed to the next middleware or route handler
      next();
    } catch (err) {
      // * Catch and pass any errors to the error handling middleware
      next(err);
    }
  };
};

export default auth;
