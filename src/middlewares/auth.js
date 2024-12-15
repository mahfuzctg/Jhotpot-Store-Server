"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const appError_1 = __importDefault(require("../errors/appError"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const verifyJWT_1 = require("../utils/verifyJWT");
// Auth middleware to protect routes and validate tokens
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Retrieve the token from the Authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
            }
            const token = authHeader.split(" ")[1];
            // Verify the token using the JWT secret
            let decoded;
            try {
                decoded = (0, verifyJWT_1.verifyToken)(token, config_1.default.jwt_access_secret);
            }
            catch (error) {
                throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token!");
            }
            // Destructure role and email from the decoded JWT payload
            const { role, email } = decoded;
            // Check if the user exists and is active
            const user = yield prisma_1.default.user.findUnique({
                where: { email },
            });
            if (!user || user.status !== client_1.UserStatus.ACTIVE) {
                throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "User is not active or does not exist!");
            }
            // If roles are provided, ensure the user's role is authorized
            if (roles.length > 0 && !roles.includes(role)) {
                throw new appError_1.default(http_status_1.default.FORBIDDEN, "Forbidden!");
            }
            // Attach the decoded user data to the request object
            req.user = decoded;
            // Proceed to the next middleware or route handler
            next();
        }
        catch (err) {
            // Catch and pass any errors to the error handling middleware
            next(err);
        }
    });
};
exports.default = auth;
