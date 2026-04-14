import { Router } from "express";
import { StaticsController } from "./statics.controller";

const router = Router();

router.post("/admin-statics", StaticsController.adminStatics);
router.post("/user-statics", StaticsController.userStatics);

export const StaticsRoutes = router;
