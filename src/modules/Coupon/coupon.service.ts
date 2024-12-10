import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { ICoupon } from './coupon.interface';
import prisma from '../../utils/prisma';
import { DiscountType } from '@prisma/client';

const createCoupon = async (payload: ICoupon) => {
  if (payload.discountValue <= 0) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Discount value must be greater than 0.',
    );
  }

  const coupon = await prisma.coupon.create({
    data: payload,
  });

  return coupon;
};

const getAllCoupons = async () => {
  const activeCoupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
    },
  });

  return activeCoupons;
};

const updateCoupon = async (
  couponId: string,
  payload: {
    code?: string;
    discountType?: DiscountType;
    discountValue?: number;
    endDate?: Date;
  },
) => {
  const isCouponExists = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!isCouponExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found!');
  }

  const updatedCoupon = await prisma.coupon.update({
    where: { id: couponId },
    data: payload,
  });

  return updatedCoupon;
};

const deleteCoupon = async (couponId: string) => {
  const isCouponExists = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!isCouponExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found!');
  }

  const deletedCoupon = await prisma.coupon.update({
    where: { id: couponId },
    data: {
      isActive: false,
    },
  });

  return deletedCoupon;
};

// const applyCoupon = async (
//   payload: {
//     coupon: string;
//   },
//   user: IAuthUser,
// ) => {
//   const customer = await prisma.customer.findUnique({
//     where: {
//       email: user?.email,
//       isDeleted: false,
//     },
//   });

//   if (!customer) {
//     throw new AppError(httpStatus.NOT_FOUND, "Customer doesn't exist!");
//   }

//   const existingCoupon = await prisma.coupon.findUnique({
//     where: {
//       code: payload.coupon,
//     },
//   });

//   if (!existingCoupon) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found!');
//   }

//   if (new Date() > existingCoupon.endDate) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'Coupon is inactive or expired!',
//     );
//   }

//   const alreadyRedeemed = await prisma.customerCoupon.findUnique({
//     where: {
//       customerId_couponId: {
//         customerId: customer.id,
//         couponId: existingCoupon.id,
//       },
//     },
//   });

//   if (alreadyRedeemed) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Coupon already redeemed!');
//   }

//   const result = await prisma.$transaction(async (tx) => {
//     await tx.coupon.update({
//       where: { id: existingCoupon.id },
//       data: { usedCount: { increment: 1 } },
//     });

//     const customerUsedCoupon = await tx.customerCoupon.create({
//       data: {
//         customerId: customer.id,
//         couponId: existingCoupon.id,
//         redeemedAt: new Date(),
//         isRedeemed: true,
//       },
//       include: {
//         customer: true,
//         coupon: true,
//       },
//     });

//     return customerUsedCoupon;
//   });

//   return result;
// };

export const CouponServices = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  // applyCoupon,
};