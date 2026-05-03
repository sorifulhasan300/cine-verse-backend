import { Router } from "express";
import { MovieRoutes } from "../app/module/move/move.route";
import { CategoryRoutes } from "../app/module/category/category.route";
import { ReviewRoutes } from "../app/module/review/review.route";
import { CommentRoutes } from "../app/module/comment/comment.route";
import { LikeRoutes } from "../app/module/like/like.route";
import { WatchlistRoutes } from "../app/module/watchlist/watchlist.route";
import { SubscriptionRoutes } from "../app/module/subscription/subscription.route";
import { AuthRoutes } from "../app/module/auth/auth.route";
import { StaticsRoutes } from "../app/module/statics/statics.route";
import { ManageUserRoutes } from "../app/module/manage-users/manage-user.route";
import { ChatRoutes } from "../app/module/chat/chat.route";

const router = Router();

// Defining routes here
router.use("/movie", MovieRoutes);
router.use("/categories", CategoryRoutes);
router.use("/review", ReviewRoutes);
router.use("/comments", CommentRoutes);
router.use("/likes", LikeRoutes);
router.use("/watchlist", WatchlistRoutes);
router.use("/subscriptions", SubscriptionRoutes);
router.use("/auth", AuthRoutes);
router.use("/statics", StaticsRoutes);
router.use("/manage-users", ManageUserRoutes);
router.use("/chat", ChatRoutes);

export const routers: Router = router;
