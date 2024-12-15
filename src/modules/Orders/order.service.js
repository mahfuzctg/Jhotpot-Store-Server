"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const payment_1 = require("../../utils/payment");
const client_1 = require("@prisma/client");
const calculatePagination_1 = require("../../utils/calculatePagination");
const createOrder = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            isDeleted: false,
        },
    });
    if (!customer) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Customer doesn't exist!");
    }
    const vendor = yield prisma_1.default.vendor.findUnique({
        where: {
            id: payload.vendorId,
            isDeleted: false,
        },
    });
    if (!vendor) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Vendor doesn't exist!");
    }
    let existingCoupon;
    if (payload.coupon) {
        existingCoupon = yield prisma_1.default.coupon.findUnique({
            where: { code: payload.coupon },
        });
        if (!existingCoupon) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found!');
        }
        if (new Date() > existingCoupon.endDate) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon is inactive or expired!');
        }
        const alreadyRedeemed = yield prisma_1.default.customerCoupon.findUnique({
            where: {
                customerId_couponId: {
                    customerId: customer.id,
                    couponId: existingCoupon.id,
                },
            },
        });
        if (alreadyRedeemed) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon already redeemed!');
        }
    }
    const order = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const order = yield tx.order.create({
            data: {
                customerId: customer.id,
                vendorId: vendor.id,
                deliveryAddress: payload.deliveryAddress,
                transactionId: payload.transactionId,
                paymentStatus: client_1.PaymentStatus.PENDING,
                totalPrice: payload.totalPrice,
            },
        });
        for (const detail of payload.orderDetails) {
            // Updating product inventory
            const product = yield tx.product.update({
                where: { id: detail.productId },
                data: {
                    inventory: {
                        decrement: detail.quantity,
                    },
                },
            });
            if (product.inventory < 0) {
                throw new appError_1.default(http_status_1.default.BAD_REQUEST, `Insufficient inventory for product ID ${detail.productId}. Available: ${product.inventory + detail.quantity}, Required: ${detail.quantity}`);
            }
            yield tx.orderDetail.create({
                data: {
                    orderId: order.id,
                    productId: detail.productId,
                    quantity: detail.quantity,
                    pricePerUnit: detail.pricePerUnit,
                },
            });
        }
        if (existingCoupon) {
            yield tx.coupon.update({
                where: { id: existingCoupon.id },
                data: { usedCount: { increment: 1 } },
            });
            yield tx.customerCoupon.create({
                data: {
                    customerId: customer.id,
                    couponId: existingCoupon.id,
                    redeemedAt: new Date(),
                    isRedeemed: true,
                },
            });
        }
        return order;
    }));
    const paymentData = {
        transactionId: payload === null || payload === void 0 ? void 0 : payload.transactionId,
        amount: payload === null || payload === void 0 ? void 0 : payload.totalPrice,
        customerName: customer.name,
        customerEmail: customer.email,
    };
    const paymentSession = yield (0, payment_1.initiatePayment)(paymentData);
    return { paymentSession, order };
});
const getAllOrders = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = (0, calculatePagination_1.calculatePagination)(options);
    const andConditions = [];
    if (Object.keys(filters).length > 0) {
        const filterConditions = Object.keys(filters).map((key) => ({
            [key]: {
                equals: filters[key],
            },
        }));
        andConditions.push(...filterConditions);
    }
    andConditions.push({
        vendor: {
            isDeleted: false,
        },
    });
    andConditions.push({
        customer: {
            isDeleted: false,
        },
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.order.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { paymentStatus: 'asc' },
        include: {
            vendor: true,
            customer: true,
            orderDetails: {
                include: {
                    product: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.order.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
exports.OrderServices = {
    createOrder,
    getAllOrders,
};
