import { z } from 'zod';

const createReviewValidation = z.object({
  body: z.object({
    productId: z.string({
      required_error: 'Product Id is required',
    }),
    comment: z.string({
      required_error: 'Review comment is required',
    }),
    rating: z
      .number({
        required_error: 'Review rating is required',
      })
      .nonnegative('Rating must be a non-negative number')
      .max(5),
  }),
});

export const ReviewValidations = {
  createReviewValidation,
};