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
exports.AuthServices = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const verifyJWT_1 = require("../../utils/verifyJWT");
const appError_1 = __importDefault(require("../../errors/appError"));
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const sendEmail_1 = require("../../utils/sendEmail");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'User not found!');
    }
    //checking if the password is correct
    const isPasswordMatched = yield bcryptjs_1.default.compare(payload.password, userData.password);
    if (!isPasswordMatched) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    }
    //create token and sent to the  client
    const jwtPayload = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
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
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    // checking if the user is exist
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const jwtPayload = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
const changePassword = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exists!");
    }
    const isCorrectPassword = yield bcryptjs_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Password incorrect!');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return {
        message: 'Password changed successfully!',
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: payload === null || payload === void 0 ? void 0 : payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist!");
    }
    const jwtPayload = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
    };
    const resetToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '20m');
    const resetUILink = `${config_1.default.reset_pass_ui_link}?email=${userData.email}&token=${resetToken} `;
    yield (0, sendEmail_1.sendEmail)(userData === null || userData === void 0 ? void 0 : userData.email, resetUILink);
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ token, payload });
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist!");
    }
    const decoded = (0, verifyJWT_1.verifyToken)(token, config_1.default.jwt_access_secret);
    const { email } = decoded;
    if ((payload === null || payload === void 0 ? void 0 : payload.email) !== email) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'You are forbidden!');
    }
    // hash password
    const newHashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    // update into database
    yield prisma_1.default.user.update({
        where: {
            email: payload.email,
        },
        data: {
            password: newHashedPassword,
        },
    });
});
exports.AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    //   socialLogin,
    forgotPassword,
    resetPassword,
};
