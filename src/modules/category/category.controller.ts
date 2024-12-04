import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoryServices } from "./category.services";

const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.createCategory(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category created successfully!",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategories();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully!",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;

  const result = await CategoryServices.updateCategory(categoryId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully!",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
};
