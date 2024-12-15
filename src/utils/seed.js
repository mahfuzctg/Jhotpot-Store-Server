"use strict";
/* eslint-disable no-console */ // * Disabling ESLint for console statements, usually for debugging purposes
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
exports.seedSuperAdmin = void 0;
const client_1 = require("@prisma/client"); // * Importing UserRole from Prisma to ensure proper role assignments
const bcryptjs_1 = __importDefault(require("bcryptjs")); // * Importing bcryptjs for password hashing
const config_1 = __importDefault(require("../config")); // * Importing configuration settings, such as admin credentials and bcrypt salt rounds
const prisma_1 = __importDefault(require("./prisma")); // * Importing Prisma client for database interaction
// !! Function to seed the Super Admin user if not already present in the database
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // * Checking if a Super Admin with the specified email already exists in the database
        const isSuperAdminExists = yield prisma_1.default.user.findUnique({
            where: {
                role: client_1.UserRole.SUPER_ADMIN, // !! Ensuring the role is SUPER_ADMIN
                email: config_1.default.admin_email, // !! Ensuring the email is the one specified in the config
            },
        });
        // * If the Super Admin does not exist, proceed with creating a new one
        if (!isSuperAdminExists) {
            // !! Hashing the password using bcrypt with the salt rounds specified in the config
            const hashedPassword = yield bcryptjs_1.default.hash(config_1.default.admin_password, // * Hashing the password provided in the config
            Number(config_1.default.bcrypt_salt_rounds) // * Number of salt rounds specified in the config for bcrypt
            );
            // !! Using a Prisma transaction to ensure both user and admin records are created atomically
            yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                // * Creating the Super Admin user record
                const user = yield tx.user.create({
                    data: {
                        email: config_1.default.admin_email, // * Admin email from config
                        password: hashedPassword, // * Hashed password
                        role: client_1.UserRole.SUPER_ADMIN, // !! Assigning the SUPER_ADMIN role
                    },
                });
                // * Creating the corresponding admin record in the database
                yield tx.admin.create({
                    data: {
                        name: "Super Admin", // * Admin name set to "Super Admin"
                        email: user.email, // * Using the created user's email
                        profilePhoto: config_1.default.admin_profile_photo, // * Admin profile photo from config
                    },
                });
            }));
            console.log("Super Admin created successfully..."); // * Logging success message if Super Admin creation is successful
            console.log("Seeding completed..."); // * Logging completion of seeding process
        }
    }
    catch (err) {
        console.log("Error in seeding", err); // * Logging any errors that occur during seeding
    }
    finally {
        yield prisma_1.default.$disconnect(); // * Ensuring Prisma client is disconnected after operation
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
