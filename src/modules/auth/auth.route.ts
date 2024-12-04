import express from "express";
import validateRequest, {
  validateRequestCookies,
} from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  "/refresh-token",
  validateRequestCookies(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

export const AuthRoutes = router;
