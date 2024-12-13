import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    newPassword: z.string({ required_error: 'New Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address!'),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'New Password is required' }),
    newPassword: z.string({ required_error: 'New Password is required' }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  resetPasswordValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
};