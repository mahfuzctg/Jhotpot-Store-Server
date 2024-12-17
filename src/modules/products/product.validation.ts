import { z } from 'zod';

const createProductValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Product Name is required',
    }),
    image: z.array(
      z.string({
        required_error: 'Product image is required',
      }),
    ),
    price: z
      .number({
        required_error: 'Product price is required',
      })
      .nonnegative('Price must be a non-negative number'),
    inventory: z
      .number({
        required_error: 'Product inventory is required',
      })
      .int('Inventory must be an integer')
      .nonnegative('Inventory must be a non-negative integer'),
    description: z.string({
      required_error: 'Product description is required',
    }),
    categoryId: z.string({
      required_error: 'Category ID is required',
    }),
    flashSale: z.boolean().optional(),
    discount: z
      .number()
      .nonnegative('Discount must be a non-negative number')
      .optional(),
  }),
});

const updateProductValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Product Name is required',
    }),
    image: z.array(
      z
        .string({
          required_error: 'Product image is required',
        })
        .optional(),
    ),
    price: z
      .number({
        required_error: 'Product price is required',
      })
      .nonnegative('Price must be a non-negative number')
      .optional(),
    inventory: z
      .number({
        required_error: 'Product inventory is required',
      })
      .int('Inventory must be an integer')
      .nonnegative('Inventory must be a non-negative integer')
      .optional(),
    description: z
      .string({
        required_error: 'Product description is required',
      })
      .optional(),
    categoryId: z
      .string({
        required_error: 'Category ID is required',
      })
      .optional(),
    flashSale: z.boolean().optional(),
    discount: z
      .number()
      .nonnegative('Discount must be a non-negative number')
      .optional(),
  }),
});

export const ProductValidation = {
  createProductValidation,
  updateProductValidation,
};