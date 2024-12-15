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
exports.userService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const config_1 = __importDefault(require("../../config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const verifyJWT_1 = require("../../utils/verifyJWT");
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user is already exist!');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    const newUser = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.create({
            data: {
                email: payload.email,
                password: hashedPassword,
                role: client_1.UserRole.ADMIN,
            },
            include: {
                admin: true,
            },
        });
        yield tx.admin.create({
            data: {
                name: payload.name,
                email: user.email,
                profilePhoto: 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/83221961/original/425127947f0688643bcefba40b83c767b13e2a6a/illustrate-your-cartoon-avatar.jpg',
            },
        });
        return user;
    }));
    //create token and sent to the  client
    const jwtPayload = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    const combinedResult = { accessToken, refreshToken, newUser };
    return combinedResult;
});
const createVendor = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user is already exist!');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    const newUser = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.create({
            data: {
                email: payload.email,
                password: hashedPassword,
                role: client_1.UserRole.VENDOR,
            },
            include: {
                vendor: true,
            },
        });
        yield tx.vendor.create({
            data: {
                name: payload.name,
                email: user.email,
            },
            include: {
                user: true,
            },
        });
        return user;
    }));
    //create token and sent to the  client
    const jwtPayload = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    const combinedResult = { accessToken, refreshToken, newUser };
    return combinedResult;
});
const createCustomer = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user is already exist!');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    const newUser = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield tx.user.create({
            data: {
                email: payload.email,
                password: hashedPassword,
                role: client_1.UserRole.CUSTOMER,
            },
            include: {
                customer: true,
            },
        });
        yield tx.customer.create({
            data: {
                name: payload.name,
                email: user.email,
                profilePhoto: 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/83221961/original/425127947f0688643bcefba40b83c767b13e2a6a/illustrate-your-cartoon-avatar.jpg',
            },
        });
        return user;
    }));
    //create token and sent to the  client
    const jwtPayload = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    const combinedResult = { accessToken, refreshToken, newUser };
    return combinedResult;
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    let profileInfo;
    if (userInfo.role === client_1.UserRole.SUPER_ADMIN) {
        profileInfo = yield prisma_1.default.admin.findUnique({
            where: {
                email: userInfo.email,
            },
        });
    }
    else if (userInfo.role === client_1.UserRole.ADMIN) {
        profileInfo = yield prisma_1.default.admin.findUnique({
            where: {
                email: userInfo.email,
            },
        });
    }
    else if (userInfo.role === client_1.UserRole.VENDOR) {
        profileInfo = yield prisma_1.default.vendor.findUnique({
            where: {
                email: userInfo.email,
            },
            include: {
                products: true,
                orders: true,
                followers: {
                    include: {
                        customer: true,
                    },
                },
            },
        });
    }
    else if (userInfo.role === client_1.UserRole.CUSTOMER) {
        profileInfo = yield prisma_1.default.customer.findUnique({
            where: {
                email: userInfo.email,
            },
            include: {
                customerCoupons: true,
                orders: true,
                reviews: true,
                follows: {
                    include: {
                        vendor: true,
                    },
                },
                recentProductView: true,
            },
        });
    }
    return Object.assign(Object.assign({}, userInfo), profileInfo);
});
const getVendorUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield prisma_1.default.vendor.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            products: true,
            followers: true,
            orders: true,
        },
    });
    return vendor;
});
const getCustomerUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield prisma_1.default.customer.findUniqueOrThrow({
        where: {
            email,
            isDeleted: false,
        },
        include: {
            follows: true,
            orders: true,
            reviews: true,
            recentProductView: true,
        },
    });
    return vendor;
});
const followVendor = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            isDeleted: false,
        },
    });
    if (!customer) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist!");
    }
    const vendor = yield prisma_1.default.vendor.findUnique({
        where: {
            id: payload.vendorId,
            isDeleted: false,
        },
    });
    if (!vendor) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist!");
    }
    const follow = yield prisma_1.default.follow.create({
        data: {
            customerId: customer.id,
            vendorId: vendor.id,
        },
        include: {
            customer: true,
            vendor: true,
        },
    });
    return follow;
});
const unfollowVendor = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            isDeleted: false,
        },
    });
    if (!customer) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist!");
    }
    const vendor = yield prisma_1.default.vendor.findUnique({
        where: {
            id: payload.vendorId,
            isDeleted: false,
        },
    });
    if (!vendor) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist!");
    }
    const unfollow = yield prisma_1.default.follow.delete({
        where: {
            customerId_vendorId: {
                customerId: customer.id,
                vendorId: vendor.id,
            },
        },
    });
    return unfollow;
});
const updateCustomer = (payload, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findUnique({
        where: {
            email: userData === null || userData === void 0 ? void 0 : userData.email,
            isDeleted: false,
        },
    });
    if (!customer) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist!");
    }
    const result = yield prisma_1.default.customer.update({
        where: {
            email: customer.email,
        },
        data: payload,
        include: {
            follows: true,
            orders: true,
            reviews: true,
            recentProductView: true,
        },
    });
    return result;
});
const updateVendor = (payload, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield prisma_1.default.vendor.findUnique({
        where: {
            email: userData === null || userData === void 0 ? void 0 : userData.email,
            isDeleted: false,
        },
    });
    if (!vendor) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist!");
    }
    const result = yield prisma_1.default.vendor.update({
        where: {
            email: vendor.email,
        },
        data: payload,
        include: {
            orders: true,
            products: true,
            followers: true,
        },
    });
    return result;
});
exports.userService = {
    createAdmin,
    createVendor,
    createCustomer,
    getMyProfile,
    getVendorUser,
    getCustomerUser,
    followVendor,
    unfollowVendor,
    updateCustomer,
    updateVendor,
};
