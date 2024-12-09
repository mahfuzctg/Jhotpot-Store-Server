import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { userController } from './user.controller';

const router = express.Router();



router.get(
  '/me',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  userController.getMyProfile,
);

router.get(
  '/get-vendor/:vendorId',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  userController.getVendorUser,
);

router.get(
  '/get-customer/:email',
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.VENDOR,
    UserRole.CUSTOMER,
  ),
  userController.getCustomerUser,
);

router.post(
  '/create-admin',
  validateRequest(userValidation.createUser),
  userController.createAdmin,
);

router.post(
  '/create-vendor',
  validateRequest(userValidation.createUser),
  userController.createVendor,
);

router.post(
  '/create-customer',
  validateRequest(userValidation.createUser),
  userController.createCustomer,
);

router.post('/follow', auth(UserRole.CUSTOMER), userController.followVendor);

router.delete(
  '/unfollow',
  auth(UserRole.CUSTOMER),
  userController.unfollowVendor,
);



export const UserRoutes = router;