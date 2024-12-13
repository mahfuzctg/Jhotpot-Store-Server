import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import prisma from '../../utils/prisma';
import { TReview } from './review.interface';
import { IAuthUser } from '../users/user.interfaces';


const createReview = async (payload: TReview, user: IAuthUser) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer doesn't exist!");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: payload.productId,
    },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product doesn't exist!");
  }

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: payload.vendorId,
    },
  });

  if (!vendor) {
    throw new AppError(httpStatus.NOT_FOUND, "Vendor doesn't exist!");
  }

  const reviewInfo = { ...payload, customerId: customer.id };

  const result = await prisma.review.create({
    data: reviewInfo,
  });

  return result;
};

const getAllReviews = async (query: Record<string, string>) => {
  if (!query.productId && !query.vendorId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Either productId or vendorId must be provided!',
    );
  }

  if (query.productId) {
    const product = await prisma.product.findUnique({
      where: {
        id: query.productId,
      },
    });

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, "Product doesn't exist!");
    }

    return prisma.review.findMany({
      where: {
        productId: query.productId,
      },
      include: {
        product: true,
        customer: true,
        vendor: true,
      },
    });
  }

  if (query.vendorId) {
    const vendor = await prisma.vendor.findUnique({
      where: {
        id: query.vendorId,
      },
    });

    if (!vendor) {
      throw new AppError(httpStatus.NOT_FOUND, "Vendor doesn't exist!");
    }

    return prisma.review.findMany({
      where: {
        vendorId: query.vendorId,
      },
      include: {
        product: true,
        customer: true,
        vendor: true,
      },
    });
  }
};

export const ReviewServices = {
  createReview,
  getAllReviews,
};