import httpStatus from "http-status";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";

const createCategory = async (payload: { category: string; image: string }) => {
  const isCategoryExists = await prisma.category.findUnique({
    where: {
      name: payload.category,
    },
  });

  if (isCategoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category already exists!");
  }

  const result = await prisma.category.create({
    data: {
      name: payload.category,
      image: payload.image,
    },
  });

  return result;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

const updateCategory = async (
  categoryId: string,
  payload: { category?: string; image?: string }
) => {
  const isCategoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found!");
  }

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(payload.category && { name: payload.category }),
      ...(payload.image && { image: payload.image }),
    },
  });

  return updatedCategory;
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  updateCategory,
};
