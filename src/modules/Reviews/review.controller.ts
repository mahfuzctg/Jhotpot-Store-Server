import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.services';
import { IAuthUser } from '../Users/user.interface';

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.createReview(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review created successfully!',
    data: result,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const query: Record<string, string> = Object.keys(req.query).reduce(
    (acc, key) => {
      const value = req.query[key];
      if (typeof value === 'string') {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  const result = await ReviewServices.getAllReviews(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully!',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
};