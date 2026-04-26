import { Router } from "express";
import { CommentController } from "./comment.controller";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";
import validationMiddleware from "../../../middleware/validateRequest";
import { commentValidationSchema } from "./comment.validation";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.USER),
  validationMiddleware(commentValidationSchema),
  CommentController.createComment,
);

router.get("/:reviewId", CommentController.getCommentsByReview);

router.delete(
  "/:commentId",
  checkAuth(UserRole.USER),
  CommentController.deleteComment,
);

export const CommentRoutes: Router = router;
