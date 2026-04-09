import express from "express";
import { MovieController } from "./move.controller";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";

const router = express.Router();

router.post(
  "/create-movie",
  checkAuth(UserRole.ADMIN),
  MovieController.createMovie,
);

router.get("/", MovieController.getAllMovies);

router.get("/:id", MovieController.getSingleMovie);

export const MovieRoutes = router;
