import express, { Router } from "express";
import { MovieController } from "./move.controller";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";
import validateRequest from "../../../middleware/validateRequest";
import {
  movieValidationSchema,
  updateMovieValidationSchema,
} from "./movie.validation";
import { checkPremium } from "../../../middleware/checkPremium";

const router = express.Router();

router.post(
  "/create-movie",
  validateRequest(movieValidationSchema),
  checkAuth(UserRole.ADMIN),
  MovieController.createMovie,
);

router.get("/", MovieController.getAllMovies);

router.get("/most-popular", MovieController.getMostPopularMovies);

router.get(
  "/admin",
  checkAuth(UserRole.ADMIN),
  MovieController.getAllMoviesForAdmin,
);

router.put(
  "/admin/:id",
  validateRequest(updateMovieValidationSchema),
  checkAuth(UserRole.ADMIN),
  MovieController.updateMovie,
);

router.get(
  "/:id",
  checkAuth(UserRole.USER, UserRole.ADMIN),
  checkPremium,
  MovieController.getSingleMovie,
);

export const MovieRoutes: Router = router;
