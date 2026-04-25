import express from "express";
import { SubscriptionController } from "./subscription.controller";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";

const router = express.Router();

router.post(
  "/create-checkout-session",
  checkAuth(UserRole.USER, UserRole.ADMIN),
  SubscriptionController.createCheckoutSession,
);

router.get(
  "/check-status",
  checkAuth(UserRole.USER, UserRole.ADMIN),
  SubscriptionController.CheckSubscriptionStatus,
);
export const SubscriptionRoutes = router;
