/* eslint-disable no-unused-vars */ // * Disable unused variable warnings
/* eslint-disable @typescript-eslint/no-explicit-any */ // * Disable explicit 'any' type warnings
import { UserRole } from "@prisma/client"; // * Importing UserRole enum for defining user roles
import jwt, { JwtPayload } from "jsonwebtoken"; // * Importing JWT functionality for token creation and verification
import AppError from "../errors/appError"; // * Importing custom error handling class for authorization errors

// ! Function to create a new JWT token with user info (id, email, role)
export const createToken = (
  jwtPayload: {
    id: string; // * User's unique ID
    email: string; // * User's email address
    role: UserRole; // * User's role (e.g., ADMIN, USER)
  },
  secret: string, // * Secret key to sign the JWT
  expiresIn: string // * Expiration time for the token (e.g., '1h', '7d')
) => {
  return jwt.sign(jwtPayload, secret, {
    // * Sign and return the JWT with the provided payload, secret, and expiration
    expiresIn, // * The token expiration time
  });
};

// ! Function to verify a given JWT token and return the decoded payload or throw an error if invalid
export const verifyToken = (
  token: string, // * The JWT token to be verified
  secret: string // * Secret key to verify the token's signature
): JwtPayload | Error => {
  try {
    return jwt.verify(token, secret) as JwtPayload; // * Verify the token and return the decoded payload
  } catch (error: any) {
    // ? Catch any errors if the token is invalid or expired
    throw new AppError(401, "You are not authorized!"); // * Throw an authorization error if verification fails
  }
};
