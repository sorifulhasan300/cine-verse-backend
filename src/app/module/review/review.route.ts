import express from "express";
import { reviewValidationSchema } from "./review.validation";
import { ReviewController } from "./review.controller";
import validationMiddleware from "../../../middleware/validateRequest";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";

const router = express.Router();

router.post(
  "/",
  checkAuth(UserRole.USER),
  validationMiddleware(reviewValidationSchema),
  ReviewController.createReview,
);

router.get("/:movieId", ReviewController.getMovieReviews);

export const ReviewRoutes = router;
