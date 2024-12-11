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



export const CouponServices = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
 
};