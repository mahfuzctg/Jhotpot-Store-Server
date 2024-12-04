import { z } from "zod"; // * Importing Zod for schema validation

// !! Validation schema for user login
const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required", // * Error message if email is missing
    }),
    password: z.string({
      required_error: "Password is required", // * Error message if password is missing
    }),
  }),
});

// !! Validation schema for resetting a user's password
const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required", // * Error message if email is missing
    }),
    newPassword: z.string({
      required_error: "New Password is required", // * Error message if new password is missing
    }),
  }),
});

// !! Validation schema for refreshing tokens
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!", // * Error message if refresh token is missing
    }),
  }),
});

// !! Validation schema for forgotten password requests
const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Please enter a valid email address!"), // !! Ensures the email is in a valid format
  }),
});

// * Exporting all the validation schemas as part of AuthValidation
export const AuthValidation = {
  loginValidationSchema, // * Used to validate login requests
  changePasswordValidationSchema: resetPasswordValidationSchema, // !! Alias for reset password validation
  refreshTokenValidationSchema, // * Used to validate refresh token requests
  forgetPasswordValidationSchema, // * Used to validate forgot password requests
};
