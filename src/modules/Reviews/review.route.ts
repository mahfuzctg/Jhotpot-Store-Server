import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidations } from './review.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.CUSTOMER),
  validateRequest(ReviewValidations.createReviewValidation),
  ReviewController.createReview,
);

router.get(
  '/',
  auth(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CUSTOMER,
    UserRole.VENDOR,
  ),
  ReviewController.getAllReviews,
);

export const ReviewRoutes = router;