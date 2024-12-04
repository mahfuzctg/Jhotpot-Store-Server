import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import { IAuthUser } from "../Users/user.interface";
import { productFilterableFields } from "./product.constant";
import { ProductServices } from "./product.services";

const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProduct(
    req.body,
    req.user as IAuthUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product created successfully!",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const filters = pick(req.query, productFilterableFields);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ProductServices.getAllProducts(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
};
