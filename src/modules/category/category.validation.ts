import { z } from 'zod';

const createCategoryValidation = z.object({
  body: z.object({
    category: z.string({
      required_error: 'Category Name is required',
    }),
    image: z.string({
      required_error: 'Category image is required',
    }),
  }),
});

const updateCategoryValidation = z.object({
  body: z.object({
    category: z
      .string({
        required_error: 'Category Name is required',
      })
      .optional(),
    image: z
      .string({
        required_error: 'Category image is required',
      })
      .optional(),
  }),
});

export const categoryValidation = {
  createCategoryValidation,
  updateCategoryValidation,
};