import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ProductController } from "./product.controller";
import { ProductValidation } from "./product.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.VENDOR),
  validateRequest(ProductValidation.createProductValidation),
  ProductController.createProduct
);

router.get("/", ProductController.getAllProducts);

// router.patch(
//   '/:categoryId',
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//   validateRequest(categoryValidation.updateCategoryValidation),
//   CategoryController.updateCategory,
// );

export const ProductRoutes = router;
