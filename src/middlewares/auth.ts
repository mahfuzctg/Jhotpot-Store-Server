/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/appError";
import prisma from "../utils/prisma";
import { verifyToken } from "../utils/verifyJWT";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Auth middleware to protect routes and validate tokens
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Retrieve the token from the Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const token = authHeader.split(" ")[1];

      // Verify the token using the JWT secret
      let decoded: JwtPayload;
      try {
        decoded = verifyToken(
          token,
          config.jwt_access_secret as string
        ) as JwtPayload;
      } catch (error) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Invalid or expired token!"
        );
      }

      // Destructure role and email from the decoded JWT payload
      const { role, email } = decoded;

      // Check if the user exists and is active
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "User is not active or does not exist!"
        );
      }

      // If roles are provided, ensure the user's role is authorized
      if (roles.length > 0 && !roles.includes(role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
      }

      // Attach the decoded user data to the request object
      req.user = decoded;

      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      // Catch and pass any errors to the error handling middleware
      next(err);
    }
  };
};

export default auth;
