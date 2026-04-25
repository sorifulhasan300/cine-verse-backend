import express from "express";
import { CategoryController } from "./category.controller";
import validationMiddleware from "../../../middleware/validateRequest";
import {
  categoryValidationSchema,
  updateCategoryValidationSchema,
} from "./category.validation";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";

const router = express.Router();

router.post(
  "/create-category",
  validationMiddleware(categoryValidationSchema),
  checkAuth(UserRole.ADMIN),
  CategoryController.createCategory,
);
router.get("/", CategoryController.getAllCategories);
router.put(
  "/:id",
  validationMiddleware(updateCategoryValidationSchema),
  checkAuth(UserRole.ADMIN),
  CategoryController.updateCategory,
);
router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
