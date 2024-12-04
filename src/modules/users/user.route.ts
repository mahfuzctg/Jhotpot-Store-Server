import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";

import { userController } from "./auth.controller";
import { userValidation } from "./user.validation";

const router = express.Router();

router.get(
  "/me",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER
  ),
  userController.getMyProfile
);

router.post(
  "/create-admin",
  validateRequest(userValidation.createUser),
  userController.createAdmin
);

router.post(
  "/create-vendor",
  validateRequest(userValidation.createUser),
  userController.createVendor
);

router.post(
  "/create-customer",
  validateRequest(userValidation.createUser),
  userController.createCustomer
);

export const UserRoutes = router;
