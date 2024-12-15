"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidations = void 0;
const zod_1 = require("zod");
const createReviewValidation = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string({
            required_error: 'Product Id is required',
        }),
        comment: zod_1.z.string({
            required_error: 'Review comment is required',
        }),
        rating: zod_1.z
            .number({
            required_error: 'Review rating is required',
        })
            .nonnegative('Rating must be a non-negative number')
            .max(5),
    }),
});
exports.ReviewValidations = {
    createReviewValidation,
};
