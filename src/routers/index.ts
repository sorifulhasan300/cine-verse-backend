import { Router } from "express";
import { MovieRoutes } from "../app/module/move/move.route";
import { CategoryRoutes } from "../app/module/category/category.route";
import { ReviewRoutes } from "../app/module/review/review.route";

const router = Router();

// Define your routes here
router.use("/movie", MovieRoutes);
router.use("/categories", CategoryRoutes);
router.use("/review", ReviewRoutes);

export const routers = router;
