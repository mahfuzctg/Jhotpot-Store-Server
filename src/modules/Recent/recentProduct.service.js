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
exports.RecentProductViewServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createRecentProducts = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            isDeleted: false,
        },
    });
    if (!customer) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist!");
    }
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id: payload.productId,
            isDeleted: false,
        },
    });
    if (!product) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Product doesn't exist!");
    }
    const existingRecentProduct = yield prisma_1.default.recentProductView.findFirst({
        where: {
            customerId: customer.id,
            productId: product.id,
        },
        include: {
            customer: true,
            product: true,
        },
    });
    if (existingRecentProduct) {
        return;
    }
    const recentProduct = yield prisma_1.default.recentProductView.create({
        data: {
            customerId: customer.id,
            productId: product.id,
        },
        include: {
            customer: true,
            product: true,
        },
    });
    return recentProduct;
});
const getAllRecentProducts = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            isDeleted: false,
        },
    });
    if (!customer) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist!");
    }
    const result = yield prisma_1.default.recentProductView.findMany({
        where: {
            customerId: customer.id,
        },
        include: {
            product: true,
            customer: true,
        },
    });
    return result;
});
const deleteRecentView = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            isDeleted: false,
        },
    });
    if (!customer) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist!");
    }
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id: payload.productId,
            isDeleted: false,
        },
    });
    if (!product) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Product doesn't exist!");
    }
    const recentView = yield prisma_1.default.recentProductView.findFirst({
        where: {
            customerId: customer.id,
            productId: payload.productId,
        },
    });
    if (!recentView) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Recent product view not found!');
    }
    const result = yield prisma_1.default.recentProductView.delete({
        where: {
            id: recentView.id,
        },
    });
    return result;
});
exports.RecentProductViewServices = {
    createRecentProducts,
    getAllRecentProducts,
    deleteRecentView,
};
