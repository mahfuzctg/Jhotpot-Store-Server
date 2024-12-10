import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import { OrderServices } from './order.service';
import { IAuthUser } from '../users/user.interfaces';

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.createOrder(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order Created Successfully',
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
};