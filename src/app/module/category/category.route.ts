import express from "express";
import { CategoryController } from "./category.controller";
import validationMiddleware from "../../../middleware/validateRequest";
import { categoryValidationSchema } from "./category.validation";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";

const router = express.Router();

router.post(
  "/create-category",
  validationMiddleware(categoryValidationSchema),
  checkAuth(UserRole.ADMIN),
  CategoryController.createCategory,
);
router.get("/", checkAuth(UserRole.ADMIN), CategoryController.getAllCategories);

export const CategoryRoutes = router;
