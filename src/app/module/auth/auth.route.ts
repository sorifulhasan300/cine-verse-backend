import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../../middleware/validateRequest";
import { auth } from "../../lib/auth";
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

export const AuthRoutes = router;
