
import { z } from 'zod';

const createCouponValidation = z.object({
  body: z.object({
    code: z.string({
      required_error: 'Coupon code is required',
    }),
    discountType: z.string({
      required_error: 'Coupon discount type is required',
    }),
    discountValue: z
      .number({
        required_error: 'Coupon discount value is required',
      })
      .nonnegative('Discount value must be a non-negative number'),
    endDate: z
      .string({
        required_error: 'Coupon end date is required',
      })
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
        'Invalid date format (YYYY-MM-DDTHH:mm:ss.sssZ)',
      )
      .refine(
        (str) => {
          const date = new Date(str);
          const now = new Date();
          return date >= now;
        },
        {
          message: 'Coupon end date cannot be in the past',
        },
      ),
  }),
});

const updateCouponValidation = z.object({
  body: z.object({
    code: z
      .string({
        required_error: 'Coupon code is required',
      })
      .optional(),
    discountType: z
      .string({
        required_error: 'Coupon discount type is required',
      })
      .optional(),
    discountValue: z
      .number({
        required_error: 'Coupon discount value is required',
      })
      .nonnegative('Discount value must be a non-negative number')
      .optional(),
    endDate: z
      .string({
        required_error: 'Coupon end date is required',
      })
      .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
        'Invalid date format (YYYY-MM-DDTHH:mm:ss.sssZ)',
      )
      .refine(
        (str) => {
          const date = new Date(str);
          const now = new Date();
          return date >= now;
        },
        {
          message: 'Coupon end date cannot be in the past',
        },
      )
      .optional(),
  }),
});

const applyCouponValidation = z.object({
  body: z.object({
    coupon: z.string({
      required_error: 'Coupon code is required',
    }),
  }),
});

export const couponValidation = {
  createCouponValidation,
  updateCouponValidation,
  applyCouponValidation,
};
