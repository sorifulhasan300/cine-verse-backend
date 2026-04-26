import express, { Router } from "express";
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

router.post(
  "/remove",
  checkAuth(UserRole.USER),
  WatchlistController.removeWatchlist,
);

export const WatchlistRoutes: Router = router;
