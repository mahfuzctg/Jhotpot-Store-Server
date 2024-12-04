/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";
import { createToken } from "../../utils/verifyJWT";
import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found!");
  }

  //checking if the password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");
  }

  //create token and sent to the  client
  const jwtPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

// const socialLogin = async (payload: TSocialLoginUser) => {
//   const user = await User.isUserExistsByEmail(payload?.email);

//   if (!user) {
//     payload.role = USER_ROLE.USER;

//     // create new user

//     const newUser = await User.create(payload);

//     //create token and sent to the  client

//     const jwtPayload = {
//       _id: newUser._id,
//       name: newUser.name,
//       email: newUser.email,
//       profilePhoto: newUser.profilePhoto,
//       role: newUser.role,
//       status: newUser.status,
//       followers: newUser.followers,
//       following: newUser.following,
//       isVerified: newUser.isVerified,
//       totalUpvote: newUser.totalUpvote,
//       postCount: newUser.postCount,
//       premiumStart: newUser.premiumStart,
//       premiumEnd: newUser.premiumEnd,
//     };

//     const accessToken = createToken(
//       jwtPayload,
//       config.jwt_access_secret as string,
//       config.jwt_access_expires_in as string,
//     );

//     const refreshToken = createToken(
//       jwtPayload,
//       config.jwt_refresh_secret as string,
//       config.jwt_refresh_expires_in as string,
//     );

//     return {
//       accessToken,
//       refreshToken,
//     };
//   }

//   //create token and sent to the  client

//   const jwtPayload = {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     profilePhoto: user.profilePhoto,
//     role: user.role,
//     status: user.status,
//     followers: user.followers,
//     following: user.following,
//     isVerified: user.isVerified,
//     totalUpvote: user.totalUpvote,
//     postCount: user.postCount,
//     premiumStart: user.premiumStart,
//     premiumEnd: user.premiumEnd,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string,
//   );

//   const refreshToken = createToken(
//     jwtPayload,
//     config.jwt_refresh_secret as string,
//     config.jwt_refresh_expires_in as string,
//   );

//   return {
//     accessToken,
//     refreshToken,
//   };
// };

// const resetPassword = async (
//   payload: { email: string; newPassword: string },
//   token: string,
// ) => {
//   // checking if the user is exist
//   const user = await User.isUserExistsByEmail(payload.email);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
//   }

//   const decoded = jwt.verify(
//     token,
//     config.jwt_access_secret as string,
//   ) as JwtPayload;

//   if (payload.email !== decoded.email) {
//     throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
//   }

//   //hash new password
//   const newHashedPassword = await bcrypt.hash(
//     payload.newPassword,
//     Number(config.bcrypt_salt_rounds),
//   );

//   await User.findOneAndUpdate(
//     {
//       email: decoded.email,
//       role: decoded.role,
//     },
//     {
//       password: newHashedPassword,
//       passwordChangedAt: new Date(),
//     },
//   );

//   return null;
// };

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email } = decoded;

  // checking if the user is exist
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
      status: UserStatus.ACTIVE,
    },
  });

  const jwtPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

// const forgetPassword = async (userEmail: string) => {
//   const user = await User.isUserExistsByEmail(userEmail);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User does not exist!');
//   }

//   const jwtPayload = {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     profilePhoto: user.profilePhoto,
//     role: user.role,
//     status: user.status,
//     followers: user.followers,
//     following: user.following,
//     isVerified: user.isVerified,
//     totalUpvote: user.totalUpvote,
//     postCount: user.postCount,
//     premiumStart: user.premiumStart,
//     premiumEnd: user.premiumEnd,
//   };

//   const resetToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     '20m',
//   );

//   const resetUILink = `${config.reset_pass_ui_link}?email=${user.email}&token=${resetToken} `;

//   sendEmail(user.email, resetUILink);
// };

export const AuthServices = {
  loginUser,
  //   resetPassword,
  refreshToken,
  //   socialLogin,
  //   forgetPassword,
};
