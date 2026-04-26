import express, { Router } from "express";
import { ManageUserController } from "./manage-user.controller";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";

const router = express.Router();

// All routes require admin authentication
router.use(checkAuth(UserRole.ADMIN));

router.get("/users", ManageUserController.getUsers);
router.put("/users/:id/block", ManageUserController.blockUser);
router.put("/users/:id/unblock", ManageUserController.unblockUser);
router.put("/users/:id/inactive", ManageUserController.deactivateUser);
router.put("/users/:id/active", ManageUserController.activateUser);

export const ManageUserRoutes: Router = router;
