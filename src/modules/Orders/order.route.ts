import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderControllers } from './order.controller';

import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { OrderValidations } from './order.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.CUSTOMER),
  validateRequest(OrderValidations.createOrderValidationSchema),
  OrderControllers.createOrder,
);

// router.get('/', OrderControllers.getAllOrders);

export const OrderRoutes = router;