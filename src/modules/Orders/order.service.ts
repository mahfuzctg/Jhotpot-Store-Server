import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import prisma from '../../utils/prisma';
import { IAuthUser } from '../Users/user.interface';
import { TOrder } from './order.interface';
import { initiatePayment } from '../../utils/payment';
import { Coupon, PaymentStatus } from '@prisma/client';

const createOrder = async (payload: TOrder, user: IAuthUser) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer doesn't exist!");
  }

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: payload.vendorId,
      isDeleted: false,
    },
  });

  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor doesn't exist!");
  }

  let existingCoupon: null | Coupon;

  if (payload.coupon) {
    existingCoupon = await prisma.coupon.findUnique({
      where: { code: payload.coupon },
    });

    if (!existingCoupon) {
      throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found!');
    }

    if (new Date() > existingCoupon.endDate) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Coupon is inactive or expired!',
      );
    }

    const alreadyRedeemed = await prisma.customerCoupon.findUnique({
      where: {
        customerId_couponId: {
          customerId: customer.id,
          couponId: existingCoupon.id,
        },
      },
    });

    if (alreadyRedeemed) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Coupon already redeemed!');
    }
  }

  const order = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerId: customer.id,
        vendorId: vendor.id,
        transactionId: payload.transactionId,
        paymentStatus: PaymentStatus.PENDING,
        totalPrice: payload.totalPrice,
      },
    });

    for (const detail of payload.orderDetails) {
      // Updating product inventory
      const product = await tx.product.update({
        where: { id: detail.productId },
        data: {
          inventory: {
            decrement: detail.quantity,
          },
        },
      });

      if (product.inventory < 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient inventory for product ID ${detail.productId}. Available: ${product.inventory + detail.quantity}, Required: ${detail.quantity}`,
        );
      }

      await tx.orderDetail.create({
        data: {
          orderId: order.id,
          productId: detail.productId,
          quantity: detail.quantity,
          pricePerUnit: detail.pricePerUnit,
        },
      });
    }

    if (existingCoupon) {
      await tx.coupon.update({
        where: { id: existingCoupon.id },
        data: { usedCount: { increment: 1 } },
      });

      await tx.customerCoupon.create({
        data: {
          customerId: customer.id,
          couponId: existingCoupon.id,
          redeemedAt: new Date(),
          isRedeemed: true,
        },
      });
    }

    return order;
  });

  const paymentData = {
    transactionId: payload?.transactionId,
    amount: payload?.totalPrice,
    customerName: customer.name,
    customerEmail: customer.email,
  };

  const paymentSession = await initiatePayment(paymentData);

  return { paymentSession, order };
};

export const OrderServices = {
  createOrder,
};