import express from "express";
import { WatchlistController } from "./watchlist.controller";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";

const router = express.Router();

router.post(
  "/toggle",
  checkAuth(UserRole.USER),
  WatchlistController.toggleWatchlist,
);

router.get(
  "/my-watchlist",
  checkAuth(UserRole.USER),
  WatchlistController.getMyWatchlist,
);

export const WatchlistRoutes = router;
