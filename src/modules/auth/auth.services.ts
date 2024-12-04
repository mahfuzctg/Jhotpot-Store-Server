/* eslint-disable @typescript-eslint/no-explicit-any */ // * Disables the rule for explicit `any` type usage
/* eslint-disable @typescript-eslint/no-unused-vars */ // * Disables the rule for unused variables

import { UserStatus } from "@prisma/client"; // * Prisma user status enums
import bcrypt from "bcryptjs"; // * Library for hashing passwords and comparing hashed values
import httpStatus from "http-status"; // * HTTP status codes
import jwt, { JwtPayload } from "jsonwebtoken"; // * Library for creating and verifying JSON Web Tokens
import config from "../../config"; // * Application configuration
import AppError from "../../errors/appError"; // * Custom error handling class

import prisma from "../../utils/prisma"; // * Prisma client instance
import { createToken } from "../../utils/verifyJWT"; // * Utility to create JWTs
import { TLoginUser } from "./auth.interface";

/**
 * AuthService function to handle user login.
 * @param payload - Object containing the user's login details (email and password)
 * @returns Access token and refresh token
 */
const loginUser = async (payload: TLoginUser) => {
  // * Retrieve user details from the database based on email and status
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE, // * Ensure the user is active
    },
  });

  // ! Throw an error if the user is not found
  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found!");
  }

  // * Verify the user's password
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    userData.password
  );

  // ! Throw an error if the password is incorrect
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");
  }

  // !! Create tokens (access and refresh) for authenticated users
  const jwtPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = createToken(
    jwtPayload, // * Payload to encode in the access token
    config.jwt_access_secret as string, // * Secret key for signing the token
    config.jwt_access_expires_in as string // * Token expiration duration
  );

  const refreshToken = createToken(
    jwtPayload, // * Payload to encode in the refresh token
    config.jwt_refresh_secret as string, // * Secret key for signing the token
    config.jwt_refresh_expires_in as string // * Token expiration duration
  );

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * AuthService function to refresh the access token.
 * @param token - Refresh token provided by the client
 * @returns New access token
 */
const refreshToken = async (token: string) => {
  // ! Verify the refresh token. Throws an error if the token is invalid or expired.
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email } = decoded; // * Extract email from the decoded token

  // !! Ensure the user exists and is active
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
      status: UserStatus.ACTIVE, // * Check if user is active
    },
  });

  // !! Generate a new access token
  const jwtPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = createToken(
    jwtPayload, // * Payload to encode in the new access token
    config.jwt_access_secret as string, // * Secret key for signing the token
    config.jwt_access_expires_in as string // * Token expiration duration
  );

  return {
    accessToken, // * Return the new access token
  };
};

// * Exporting AuthServices for use in controllers and routes
export const AuthServices = {
  loginUser, // * Login functionality
  refreshToken, // * Token refresh functionality
};
