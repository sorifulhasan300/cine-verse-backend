import express from "express";
import { likeValidationSchema } from "./like.validation";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";
import validationMiddleware from "../../../middleware/validateRequest";
import { LikeController } from "./like.controller";

const router = express.Router();

router.post(
  "/toggle-like",
  checkAuth(UserRole.USER),
  validationMiddleware(likeValidationSchema),
  LikeController.toggleLike,
);

export const LikeRoutes = router;
