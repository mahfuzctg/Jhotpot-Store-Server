import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { CategoryController } from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import { categoryValidation } from './category.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(categoryValidation.createCategoryValidation),
  CategoryController.createCategory,
);

router.get('/', CategoryController.getAllCategories);

router.patch(
  '/:categoryId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(categoryValidation.updateCategoryValidation),
  CategoryController.updateCategory,
);

router.delete(
  '/:categoryId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;