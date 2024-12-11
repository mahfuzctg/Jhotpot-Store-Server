import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { CouponController } from './coupon.controller';
import validateRequest from '../../middlewares/validateRequest';
import { couponValidation } from './coupon.validation';


const router = express.Router();

router.post(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(couponValidation.createCouponValidation),
  CouponController.createCoupon,
);



router.get(
  '/',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.VENDOR,
  ),
  CouponController.getAllCoupons,
);

router.patch(
  '/:couponId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(couponValidation.updateCouponValidation),
  CouponController.updateCoupon,
);

router.delete(
  '/:couponId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CouponController.deleteCoupon,
);

export const CouponRoutes = router;