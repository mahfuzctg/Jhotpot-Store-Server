import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryController } from "./category.controller";
import { categoryValidation } from "./category.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(categoryValidation.createCategoryValidation),
  CategoryController.createCategory
);

router.get("/", CategoryController.getAllCategories);

router.patch(
  "/:categoryId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(categoryValidation.updateCategoryValidation),
  CategoryController.updateCategory
);

export const CategoryRoutes = router;
