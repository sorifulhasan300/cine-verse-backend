import { Router } from "express";
import { StaticsController } from "./statics.controller";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";

const router = Router();

router.get(
  "/admin-statics",
  checkAuth(UserRole.ADMIN),
  StaticsController.adminStatics,
);
router.get(
  "/user-statics",
  checkAuth(UserRole.USER),
  StaticsController.userStatics,
);

export const StaticsRoutes: Router = router;
