"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.VENDOR), (0, validateRequest_1.default)(product_validation_1.ProductValidation.createProductValidation), product_controller_1.ProductController.createProduct);
router.get("/:productId", (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER), product_controller_1.ProductController.getSingleProduct);
router.patch("/:productId", (0, auth_1.default)(client_1.UserRole.VENDOR), (0, validateRequest_1.default)(product_validation_1.ProductValidation.updateProductValidation), product_controller_1.ProductController.updateProduct);
router.delete("/:productId", (0, auth_1.default)(client_1.UserRole.VENDOR), product_controller_1.ProductController.deleteProduct);
router.get("/", product_controller_1.ProductController.getAllProducts);
exports.ProductRoutes = router;
