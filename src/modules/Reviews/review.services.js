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
exports.ReviewServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createReview = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            isDeleted: false,
        },
    });
    if (!customer) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Customer doesn't exist!");
    }
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id: payload.productId,
        },
    });
    if (!product) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Product doesn't exist!");
    }
    const vendor = yield prisma_1.default.vendor.findUnique({
        where: {
            id: payload.vendorId,
        },
    });
    if (!vendor) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Vendor doesn't exist!");
    }
    const reviewInfo = Object.assign(Object.assign({}, payload), { customerId: customer.id });
    const result = yield prisma_1.default.review.create({
        data: reviewInfo,
    });
    return result;
});
const getAllReviews = (query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!query.productId && !query.vendorId) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Either productId or vendorId must be provided!');
    }
    if (query.productId) {
        const product = yield prisma_1.default.product.findUnique({
            where: {
                id: query.productId,
            },
        });
        if (!product) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Product doesn't exist!");
        }
        return prisma_1.default.review.findMany({
            where: {
                productId: query.productId,
            },
            include: {
                product: true,
                customer: true,
                vendor: true,
            },
        });
    }
    if (query.vendorId) {
        const vendor = yield prisma_1.default.vendor.findUnique({
            where: {
                id: query.vendorId,
            },
        });
        if (!vendor) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Vendor doesn't exist!");
        }
        return prisma_1.default.review.findMany({
            where: {
                vendorId: query.vendorId,
            },
            include: {
                product: true,
                customer: true,
                vendor: true,
            },
        });
    }
});
exports.ReviewServices = {
    createReview,
    getAllReviews,
};
