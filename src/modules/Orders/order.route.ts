import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderControllers } from './order.controller';
import { OrderValidations } from './order.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.CUSTOMER),
  validateRequest(OrderValidations.createOrderValidationSchema),
  OrderControllers.createOrder,
);

router.get(
  '/',
  auth(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  OrderControllers.getAllOrders,
);

export const OrderRoutes = router;