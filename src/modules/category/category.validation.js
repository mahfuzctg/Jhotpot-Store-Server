"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = void 0;
const zod_1 = require("zod");
const createCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        category: zod_1.z.string({
            required_error: 'Category Name is required',
        }),
        image: zod_1.z.string({
            required_error: 'Category image is required',
        }),
    }),
});
const updateCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        category: zod_1.z
            .string({
            required_error: 'Category Name is required',
        })
            .optional(),
        image: zod_1.z
            .string({
            required_error: 'Category image is required',
        })
            .optional(),
    }),
});
exports.categoryValidation = {
    createCategoryValidation,
    updateCategoryValidation,
};
