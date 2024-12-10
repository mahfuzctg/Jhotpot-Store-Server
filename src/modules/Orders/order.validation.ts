import { z } from 'zod';

const createOrderValidationSchema = z.object({
  body: z.object({
    vendorId: z
      .string({
        required_error: 'Vendor Id is required',
        invalid_type_error: 'Vendor Id must be a string',
      })
      .trim(),
    transactionId: z.string({
      required_error: 'TransactionId is required',
    }),
    totalPrice: z
      .number({
        required_error: 'Total Price is required',
      })
      .nonnegative('Total Price must be a non-negative number'),
    coupon: z
      .string({
        required_error: 'Vendor Id is required',
        invalid_type_error: 'Vendor Id must be a string',
      })
      .trim()
      .optional(),
    orderDetails: z.array(
      z.object({
        productId: z
          .string({
            required_error: 'Product Id is required',
            invalid_type_error: 'Product Id must be a string',
          })
          .trim(),
        quantity: z
          .number({
            required_error: 'Product Quantity is required',
          })
          .int()
          .positive(),
        pricePerUnit: z
          .number({
            required_error: 'Product Per unit is required',
          })
          .nonnegative('Product Price Per Unit must be a non-negative number'),
      }),
    ),
  }),
});

export const OrderValidations = {
  createOrderValidationSchema,
};