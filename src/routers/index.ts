import { Router } from "express";
import { MovieRoutes } from "../app/module/move/move.route";

const router = Router();

// Define your routes here
router.use("/movie", MovieRoutes);

export const routers = router;
