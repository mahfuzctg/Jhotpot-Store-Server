import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import prisma from '../../utils/prisma';
import { IAuthUser } from '../users/user.interfaces';

const createRecentProducts = async (
  payload: { productId: string },
  user: IAuthUser,
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: payload.productId,
      isDeleted: false,
    },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product doesn't exist!");
  }

  const existingRecentProduct = await prisma.recentProductView.findFirst({
    where: {
      customerId: customer.id,
      productId: product.id,
    },
    include: {
      customer: true,
      product: true,
    },
  });

  if (existingRecentProduct) {
    return;
  }

  const recentProduct = await prisma.recentProductView.create({
    data: {
      customerId: customer.id,
      productId: product.id,
    },
    include: {
      customer: true,
      product: true,
    },
  });

  return recentProduct;
};

const getAllRecentProducts = async () => {
  const result = await prisma.recentProductView.findMany({
    include: {
      product: true,
      customer: true,
    },
  });
  return result;
};

const deleteRecentView = async (
  payload: { productId: string },
  user: IAuthUser,
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: payload.productId,
      isDeleted: false,
    },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product doesn't exist!");
  }

  const recentView = await prisma.recentProductView.findFirst({
    where: {
      customerId: customer.id,
      productId: payload.productId,
    },
  });

  if (!recentView) {
    throw new AppError(httpStatus.NOT_FOUND, 'Recent product view not found!');
  }

  const result = await prisma.recentProductView.delete({
    where: {
      id: recentView.id,
    },
  });

  return result;
};

export const RecentProductViewServices = {
  createRecentProducts,
  getAllRecentProducts,
  deleteRecentView,
};