import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IAuthUser } from "./user.interface";
import { userService } from "./user.service";

const createAdmin = catchAsync(async (req, res) => {
  const result = await userService.createAdmin(req.body);
  const { refreshToken, accessToken, newUser } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully!",
    token: accessToken,
    data: newUser,
  });
});

const createVendor = catchAsync(async (req, res) => {
  const result = await userService.createVendor(req.body);

  const { refreshToken, accessToken, newUser } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor created successfully!",
    token: accessToken,
    data: newUser,
  });
});

const createCustomer = catchAsync(async (req, res) => {
  const result = await userService.createCustomer(req.body);

  const { refreshToken, accessToken, newUser } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer created successfully!",
    token: accessToken,
    data: newUser,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const result = await userService.getMyProfile(req.user as IAuthUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My profile data fetched!",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createVendor,
  createCustomer,
  //   getAllFromDB,
  //   changeProfileStatus,
  getMyProfile,
  //   updateMyProfie,
};
