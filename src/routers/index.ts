import { Router } from "express";
import { MovieRoutes } from "../app/module/move/move.route";
import { CategoryRoutes } from "../app/module/category/category.route";

const router = Router();

// Define your routes here
router.use("/movie", MovieRoutes);
router.use("/categories", CategoryRoutes);

export const routers = router;
