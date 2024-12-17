import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';
import config from '../../config';

import pick from '../../utils/pick';

const createAdmin = catchAsync(async (req, res) => {
  const result = await userService.createAdmin(req.body);
  const { refreshToken, accessToken, newUser } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully!',
    token: accessToken,
    data: newUser,
  });
});

const createVendor = catchAsync(async (req, res) => {
  const result = await userService.createVendor(req.body);

  const { refreshToken, accessToken, newUser } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor created successfully!',
    token: accessToken,
    data: newUser,
  });
});

const createCustomer = catchAsync(async (req, res) => {
  const result = await userService.createCustomer(req.body);

  const { refreshToken, accessToken, newUser } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer created successfully!',
    token: accessToken,
    data: newUser,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['role', 'status']); // Filterable fields for users
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']); // Pagination and sorting options

  const result = await userService.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const blockUser = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await userService.blockUser(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users profile status changed!',
    data: result,
  });
});

const unblockUser = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await userService.unblockUser(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users profile status changed!',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const result = await userService.getMyProfile(req.user as IAuthUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My profile data fetched!',
    data: result,
  });
});

const getVendorUser = catchAsync(async (req, res) => {
  const { vendorId } = req.params;

  const result = await userService.getVendorUser(vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor retrieved successfully!',
    data: result,
  });
});

const getCustomerUser = catchAsync(async (req, res) => {
  const { email } = req.params;

  const result = await userService.getCustomerUser(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer retrieved successfully!',
    data: result,
  });
});

const followVendor = catchAsync(async (req, res) => {
  const result = await userService.followVendor(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer followed vendor shop successfully!',
    data: result,
  });
});

const unfollowVendor = catchAsync(async (req, res) => {
  const result = await userService.unfollowVendor(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer unfollowed vendor shop successfully!',
    data: result,
  });
});

const updateVendor = catchAsync(async (req, res) => {
  const result = await userService.updateVendor(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor profile updated successfully!',
    data: result,
  });
});

const updateCustomer = catchAsync(async (req, res) => {
  const result = await userService.updateCustomer(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer profile updated successfully!',
    data: result,
  });
});

export const userController = {
  createAdmin,
  createVendor,
  createCustomer,
  getAllUsers,
  getMyProfile,
  getVendorUser,
  getCustomerUser,
  followVendor,
  unfollowVendor,
  updateCustomer,
  updateVendor,
  blockUser,
  unblockUser,
};