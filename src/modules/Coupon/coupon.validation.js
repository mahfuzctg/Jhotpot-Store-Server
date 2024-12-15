"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponValidation = void 0;
const zod_1 = require("zod");
const createCouponValidation = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string({
            required_error: 'Coupon code is required',
        }),
        discountType: zod_1.z.string({
            required_error: 'Coupon discount type is required',
        }),
        discountValue: zod_1.z
            .number({
            required_error: 'Coupon discount value is required',
        })
            .nonnegative('Discount value must be a non-negative number'),
        endDate: zod_1.z
            .string({
            required_error: 'Coupon end date is required',
        })
            .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, 'Invalid date format (YYYY-MM-DDTHH:mm:ss.sssZ)')
            .refine((str) => {
            const date = new Date(str);
            const now = new Date();
            return date >= now;
        }, {
            message: 'Coupon end date cannot be in the past',
        }),
    }),
});
const updateCouponValidation = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z
            .string({
            required_error: 'Coupon code is required',
        })
            .optional(),
        discountType: zod_1.z
            .string({
            required_error: 'Coupon discount type is required',
        })
            .optional(),
        discountValue: zod_1.z
            .number({
            required_error: 'Coupon discount value is required',
        })
            .nonnegative('Discount value must be a non-negative number')
            .optional(),
        endDate: zod_1.z
            .string({
            required_error: 'Coupon end date is required',
        })
            .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, 'Invalid date format (YYYY-MM-DDTHH:mm:ss.sssZ)')
            .refine((str) => {
            const date = new Date(str);
            const now = new Date();
            return date >= now;
        }, {
            message: 'Coupon end date cannot be in the past',
        })
            .optional(),
    }),
});
const applyCouponValidation = zod_1.z.object({
    body: zod_1.z.object({
        coupon: zod_1.z.string({
            required_error: 'Coupon code is required',
        }),
    }),
});
exports.couponValidation = {
    createCouponValidation,
    updateCouponValidation,
    applyCouponValidation,
};
