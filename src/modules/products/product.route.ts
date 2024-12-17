import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.VENDOR),
  validateRequest(ProductValidation.createProductValidation),
  ProductController.createProduct,
);

router.get(
  '/:productId',
  auth(
    UserRole.VENDOR,
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.CUSTOMER,
  ),
  ProductController.getSingleProduct,
);

router.patch(
  '/:productId',
  auth(UserRole.VENDOR),
  validateRequest(ProductValidation.updateProductValidation),
  ProductController.updateProduct,
);

router.delete(
  '/:productId',
  auth(UserRole.VENDOR),
  ProductController.deleteProduct,
);

router.get('/', ProductController.getAllProducts);

export const ProductRoutes = router;