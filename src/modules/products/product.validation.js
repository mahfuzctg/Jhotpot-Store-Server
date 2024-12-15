"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const createProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Product Name is required",
        }),
        image: zod_1.z
            .array(zod_1.z.string(), {
            required_error: "At least one product image is required",
        })
            .nonempty("Product image list cannot be empty"), // Validates that at least one image is provided
        price: zod_1.z
            .number({
            required_error: "Product price is required",
        })
            .nonnegative("Price must be a non-negative number"),
        inventory: zod_1.z
            .number({
            required_error: "Product inventory is required",
        })
            .int("Inventory must be an integer")
            .nonnegative("Inventory must be a non-negative integer"),
        description: zod_1.z.string({
            required_error: "Product description is required",
        }),
        categoryId: zod_1.z.string({
            required_error: "Category ID is required",
        }),
        flashSale: zod_1.z.boolean().optional(),
        discount: zod_1.z
            .number()
            .nonnegative("Discount must be a non-negative number")
            .optional(),
    }),
});
const updateProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "Product Name is required",
        })
            .optional(),
        image: zod_1.z
            .array(zod_1.z.string(), {
            required_error: "At least one product image is required",
        })
            .nonempty("Product image list cannot be empty")
            .optional(),
        price: zod_1.z
            .number({
            required_error: "Product price is required",
        })
            .nonnegative("Price must be a non-negative number")
            .optional(),
        inventory: zod_1.z
            .number({
            required_error: "Product inventory is required",
        })
            .int("Inventory must be an integer")
            .nonnegative("Inventory must be a non-negative integer")
            .optional(),
        description: zod_1.z
            .string({
            required_error: "Product description is required",
        })
            .optional(),
        categoryId: zod_1.z
            .string({
            required_error: "Category ID is required",
        })
            .optional(),
        flashSale: zod_1.z.boolean().optional(),
        discount: zod_1.z
            .number()
            .nonnegative("Discount must be a non-negative number")
            .optional(),
    }),
});
exports.ProductValidation = {
    createProductValidation,
    updateProductValidation,
};
