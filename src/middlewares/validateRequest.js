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
exports.validateRequestCookies = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
// ! Middleware to validate request bodies using Zod schemas
const validateRequest = (schema) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // * Parse the request body using the provided schema
        yield schema.parseAsync({
            body: req.body, // ? Pass the request body to Zod schema for validation
        });
        next(); // ? If validation is successful, continue to the next middleware
    }));
};
// ! Middleware to validate cookies using Zod schemas
const validateRequestCookies = (schema) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // * Parse the request cookies using the provided schema
        const parsedCookies = yield schema.parseAsync({
            cookies: req.cookies, // ? Pass the request cookies to Zod schema for validation
        });
        // * Attach parsed cookies back to the request object
        req.cookies = parsedCookies.cookies;
        next(); // ? If validation is successful, continue to the next middleware
    }));
};
exports.validateRequestCookies = validateRequestCookies;
exports.default = validateRequest;
