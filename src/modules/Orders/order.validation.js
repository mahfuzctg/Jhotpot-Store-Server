"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidations = void 0;
const zod_1 = require("zod");
const createOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        vendorId: zod_1.z
            .string({
            required_error: 'Vendor Id is required',
            invalid_type_error: 'Vendor Id must be a string',
        })
            .trim(),
        transactionId: zod_1.z.string({
            required_error: 'TransactionId is required',
        }),
        totalPrice: zod_1.z
            .number({
            required_error: 'Total Price is required',
        })
            .nonnegative('Total Price must be a non-negative number'),
        deliveryAddress: zod_1.z
            .string({
            required_error: 'Delivery address is required',
            invalid_type_error: 'Delivery address must be a string',
        })
            .trim(),
        coupon: zod_1.z
            .string({
            required_error: 'Vendor Id is required',
            invalid_type_error: 'Vendor Id must be a string',
        })
            .trim()
            .optional(),
        orderDetails: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z
                .string({
                required_error: 'Product Id is required',
                invalid_type_error: 'Product Id must be a string',
            })
                .trim(),
            quantity: zod_1.z
                .number({
                required_error: 'Product Quantity is required',
            })
                .int()
                .positive(),
            pricePerUnit: zod_1.z
                .number({
                required_error: 'Product Per unit is required',
            })
                .nonnegative('Product Price Per Unit must be a non-negative number'),
        })),
    }),
});
exports.OrderValidations = {
    createOrderValidationSchema,
};
