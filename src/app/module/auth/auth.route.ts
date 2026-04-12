import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../../middleware/validateRequest";
import {
  signUpValidationSchema,
  verifyOtpValidationSchema,
} from "./auth.validation";

const router = express.Router();

router.post(
  "/verify-email",
  validateRequest(verifyOtpValidationSchema),
  AuthController.verifyEmail,
);

export const AuthRoutes = router;
