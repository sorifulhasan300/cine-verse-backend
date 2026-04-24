import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../../middleware/validateRequest";
import { auth } from "../../lib/auth";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";
import {
  signUpValidationSchema,
  verifyOtpValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
} from "./auth.validation";

const router = express.Router();

router.post(
  "/verify-email",
  validateRequest(verifyOtpValidationSchema),
  AuthController.verifyEmail,
);

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordValidationSchema),
  AuthController.forgetPasswordRequest,
);

router.post(
  "/reset-password",
  validateRequest(resetPasswordValidationSchema),
  AuthController.resetPassword,
);

router.get(
  "/me",
  checkAuth(UserRole.USER, UserRole.ADMIN),
  AuthController.getProfile,
);

export const AuthRoutes = router;
