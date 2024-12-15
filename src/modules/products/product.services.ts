/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from '@prisma/client';
import {
  calculatePagination,
  IPaginationOptions,
} from '../../utils/calculatePagination';
import prisma from '../../utils/prisma';

import { TProductFilterRequest, TProducts } from './product.interface';
import { IAuthUser } from '../users/user.interfaces';

const createProduct = async (payload: TProducts, user: IAuthUser) => {
  const vendor = await prisma.vendor.findUniqueOrThrow({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  const productInfo = {
    ...payload,
    vendorId: vendor.id,
  };

  const result = await prisma.product.create({
    data: productInfo,
    include: {
      category: true,
      vendor: true,
    },
  });

  return result;
};

const getAllProducts = async (
  filters: TProductFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = calculatePagination(options);
  const {
    searchTerm,
    minPrice,
    maxPrice,
    vendorId,
    flashSale,
    category,
    ...filterData
  } = filters;

  const andConditions: Prisma.ProductWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          category: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    });
  }

  const minPriceNum = minPrice ? Number(minPrice) : undefined;
  const maxPriceNum = maxPrice ? Number(maxPrice) : undefined;

  // Filter by price range
  if (minPriceNum !== undefined && maxPriceNum !== undefined) {
    andConditions.push({
      price: {
        gte: minPriceNum,
        lte: maxPriceNum,
      },
    });
  }

  // Filter by Flash Sale
  const flashSaleBoolean =
    typeof flashSale === 'string' ? flashSale === 'true' : undefined;

  if (flashSaleBoolean !== undefined) {
    andConditions.push({
      flashSale: flashSaleBoolean,
    });
  }

  // Filter by vendorId
  if (vendorId) {
    andConditions.push({
      vendorId: {
        equals: vendorId,
      },
    });
  }

  if (category) {
    andConditions.push({
      category: {
        name: {
          equals: category,
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    vendor: {
      isDeleted: false,
    },
  });

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { price: 'asc' },
    include: {
      category: true,
      vendor: true,
      reviews: true,
    },
  });

  const total = await prisma.product.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getProductById = async (productId: string) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
      isDeleted: false,
    },
    include: {
      category: true,
      vendor: true,
      reviews: true,
      orderDetails: true,
    },
  });

  return product;
};

const updateProduct = async (
  productId: string,
  updateData: Prisma.ProductUpdateInput,
) => {
  await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });

  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: updateData,
    include: {
      category: true,
      vendor: true,
      reviews: true,
    },
  });

  return updatedProduct;
};

const deleteProduct = async (productId: string) => {
  await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });

  const deletedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      isDeleted: true,
    },
  });

  return deletedProduct;
};

export const ProductServices = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};