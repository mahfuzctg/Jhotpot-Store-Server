"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // * Importing JWT functionality for token creation and verification
const appError_1 = __importDefault(require("../errors/appError")); // * Importing custom error handling class for authorization errors
// ! Function to create a new JWT token with user info (id, email, role)
const createToken = (jwtPayload, secret, // * Secret key to sign the JWT
expiresIn // * Expiration time for the token (e.g., '1h', '7d')
) => {
    return jsonwebtoken_1.default.sign(jwtPayload, secret, {
        // * Sign and return the JWT with the provided payload, secret, and expiration
        expiresIn, // * The token expiration time
    });
};
exports.createToken = createToken;
// ! Function to verify a given JWT token and return the decoded payload or throw an error if invalid
const verifyToken = (token, // * The JWT token to be verified
secret // * Secret key to verify the token's signature
) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret); // * Verify the token and return the decoded payload
    }
    catch (error) {
        // ? Catch any errors if the token is invalid or expired
        throw new appError_1.default(401, "You are not authorized!"); // * Throw an authorization error if verification fails
    }
};
exports.verifyToken = verifyToken;
