
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import { OrderServices } from './order.service';
import pick from '../../utils/pick';
import { orderFilterableFields } from './order.constant';
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

const getAllOrders = catchAsync(async (req, res) => {
  const filters = pick(req.query, orderFilterableFields);

  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await OrderServices.getAllOrders(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrders,
};
