import httpStatus from "http-status"; // * HTTP status codes library
import config from "../../config"; // * Application configuration file
import catchAsync from "../../utils/catchAsync"; // * Utility to handle async errors
import sendResponse from "../../utils/sendResponse"; // * Utility to standardize API responses
import { AuthServices } from "./auth.services"; // * Service functions related to authentication

/**
 * Controller to handle user login requests.
 * - Calls the AuthServices.loginUser to authenticate the user with the provided credentials.
 * - Sets a secure HTTP-only refresh token in a cookie for session persistence.
 * - Sends back the access token and refresh token in the response.
 */
const loginUser = catchAsync(async (req, res) => {
  // ! Ensure that the `req.body` contains valid and sanitized data to avoid security vulnerabilities.
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  // !! Store the refresh token securely in an HTTP-only cookie to protect against XSS attacks.
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production", // ! Use secure cookies only in production mode.
    httpOnly: true, // ! Prevent client-side scripts from accessing the cookie.
    sameSite: true, // ! Prevent CSRF attacks by restricting cross-site cookie usage.
  });

  // * Send response with access token and refresh token.
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully!",
    data: {
      accessToken,
      refreshToken,
    },
  });
});

/**
 * Controller to handle token refresh requests.
 * - Retrieves the refresh token from the cookies.
 * - Calls AuthServices.refreshToken to validate the refresh token and generate a new access token.
 * - Sends the new access token in the response.
 */
const refreshToken = catchAsync(async (req, res) => {
  // ! If the refresh token cookie is missing, the operation will fail. Ensure proper cookie handling.
  const { refreshToken } = req.cookies;

  // !! Always validate the refresh token to ensure it is not tampered with.
  const result = await AuthServices.refreshToken(refreshToken);

  // * Send response with the new access token.
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token retrieved successfully!",
    data: result,
  });
});

// * Exporting authentication controllers for use in routes.
export const AuthControllers = {
  loginUser, // * Login controller
  refreshToken, // * Token refresh controller
};
