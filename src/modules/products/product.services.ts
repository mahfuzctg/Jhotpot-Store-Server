/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@prisma/client";

import prisma from "../../utils/prisma";

import {
  calculatePagination,
  IPaginationOptions,
} from "../../utils/calculatePagination";
import { IAuthUser } from "../users/user.interface";
import { TProductFilterRequest, TProducts } from "./product.interface";

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
  options: IPaginationOptions
) => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, minPrice, maxPrice, vendorId, ...filterData } = filters;

  const andConditions: Prisma.ProductWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
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

  // Filter by vendorId
  if (vendorId) {
    andConditions.push({
      vendorId: {
        equals: vendorId,
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

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { price: "asc" },
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

export const ProductServices = {
  createProduct,
  getAllProducts,
};
