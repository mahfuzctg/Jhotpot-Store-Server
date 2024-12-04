import express from "express"; // * Importing Express framework
import validateRequest, {
  validateRequestCookies,
} from "../../middlewares/validateRequest"; // * Middleware for validating requests and cookies
import { AuthControllers } from "./auth.controller"; // * Importing authentication controller methods
import { AuthValidation } from "./auth.validation"; // * Importing authentication validation schemas

const router = express.Router(); // * Initializing the Express router

// !! Route to handle user login
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema), // !! Middleware to validate request body against the login schema
  AuthControllers.loginUser // !! Controller to handle the login logic
);

// !! Route to handle refreshing the access token
router.post(
  "/refresh-token",
  validateRequestCookies(AuthValidation.refreshTokenValidationSchema), // !! Middleware to validate cookies against the refresh token schema
  AuthControllers.refreshToken // !! Controller to handle token refresh logic
);

export const AuthRoutes = router; // * Exporting the router for use in the main application
