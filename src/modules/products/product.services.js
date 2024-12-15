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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const calculatePagination_1 = require("../../utils/calculatePagination");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createProduct = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield prisma_1.default.vendor.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            isDeleted: false,
        },
    });
    yield prisma_1.default.category.findUniqueOrThrow({
        where: {
            id: payload.categoryId,
        },
    });
    const productInfo = Object.assign(Object.assign({}, payload), { vendorId: vendor.id });
    const result = yield prisma_1.default.product.create({
        data: productInfo,
        include: {
            category: true,
            vendor: true,
        },
    });
    return result;
});
const getAllProducts = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = (0, calculatePagination_1.calculatePagination)(options);
    const { searchTerm, minPrice, maxPrice, vendorId, flashSale, category } = filters, filterData = __rest(filters, ["searchTerm", "minPrice", "maxPrice", "vendorId", "flashSale", "category"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    category: {
                        name: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
            ],
        });
    }
    const minPriceNum = minPrice ? Number(minPrice) : undefined;
    const maxPriceNum = maxPrice ? Number(maxPrice) : undefined;
    // Filter by price range
    if (minPriceNum !== undefined && maxPriceNum !== undefined) {
        andConditions.push({
            price: {
                gte: minPriceNum,
                lte: maxPriceNum,
            },
        });
    }
    // Filter by Flash Sale
    const flashSaleBoolean = typeof flashSale === 'string' ? flashSale === 'true' : undefined;
    if (flashSaleBoolean !== undefined) {
        andConditions.push({
            flashSale: flashSaleBoolean,
        });
    }
    // Filter by vendorId
    if (vendorId) {
        andConditions.push({
            vendorId: {
                equals: vendorId,
            },
        });
    }
    if (category) {
        andConditions.push({
            category: {
                name: {
                    equals: category,
                },
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: filterData[key],
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
        isDeleted: false,
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.product.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { price: 'asc' },
        include: {
            category: true,
            vendor: true,
            reviews: true,
        },
    });
    const total = yield prisma_1.default.product.count({
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
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: productId,
            isDeleted: false,
        },
        include: {
            category: true,
            vendor: true,
            reviews: true,
            orderDetails: true,
        },
    });
    return product;
});
const updateProduct = (productId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.product.findUniqueOrThrow({
        where: { id: productId },
    });
    const updatedProduct = yield prisma_1.default.product.update({
        where: {
            id: productId,
        },
        data: updateData,
        include: {
            category: true,
            vendor: true,
            reviews: true,
        },
    });
    return updatedProduct;
});
const deleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.product.findUniqueOrThrow({
        where: { id: productId },
    });
    const deletedProduct = yield prisma_1.default.product.update({
        where: {
            id: productId,
        },
        data: {
            isDeleted: true,
        },
    });
    return deletedProduct;
});
exports.ProductServices = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
