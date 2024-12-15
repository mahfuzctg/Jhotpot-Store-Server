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
exports.CategoryServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield prisma_1.default.category.findUnique({
        where: {
            name: payload.category,
        },
    });
    if (isCategoryExists) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Category already exists!');
    }
    const result = yield prisma_1.default.category.create({
        data: {
            name: payload.category,
            image: payload.image,
        },
    });
    return result;
});
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany();
    return categories;
});
const updateCategory = (categoryId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield prisma_1.default.category.findUnique({
        where: { id: categoryId },
    });
    if (!isCategoryExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Category not found!');
    }
    const updatedCategory = yield prisma_1.default.category.update({
        where: { id: categoryId },
        data: Object.assign(Object.assign({}, (payload.category && { name: payload.category })), (payload.image && { image: payload.image })),
    });
    return updatedCategory;
});
const deleteCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield prisma_1.default.category.findUnique({
        where: { id: categoryId },
    });
    if (!isCategoryExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Category not found!');
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.product.updateMany({
            where: { categoryId },
            data: { categoryId: null },
        });
        const deletedCategory = yield tx.category.update({
            where: { id: categoryId },
            data: {
                isDeleted: true,
            },
        });
        return deletedCategory;
    }));
    return result;
});
exports.CategoryServices = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
