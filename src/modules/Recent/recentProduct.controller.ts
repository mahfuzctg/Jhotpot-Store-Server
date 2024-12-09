import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { IAuthUser } from '../Users/user.interface';
import { RecentProductViewServices } from './recentProduct.service';

const createRecentProduct = catchAsync(async (req, res) => {
  const result = await RecentProductViewServices.createRecentProducts(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Added to Recent Products!',
    data: result,
  });
});

const getAllRecentViewProducts = catchAsync(async (req, res) => {
  const result = await RecentProductViewServices.getAllRecentProducts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Recent View Product retrieved successfully!',
    data: result,
  });
});

const deleteRecentProduct = catchAsync(async (req, res) => {
  const result = await RecentProductViewServices.deleteRecentView(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Removed from Recent Viewed Products!',
    data: result,
  });
});

export const RecentProductViewController = {
  createRecentProduct,
  getAllRecentViewProducts,
  deleteRecentProduct,
};