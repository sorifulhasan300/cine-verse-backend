import express from "express";
import { MovieController } from "./move.controller";
import { checkAuth } from "../../../middleware/auth.middleware";
import { UserRole } from "../../../types/role.types";
import validateRequest from "../../../middleware/validateRequest";
import movieValidationSchema from "./movie.validation";

const router = express.Router();

router.post(
  "/create-movie",
  validateRequest(movieValidationSchema),
  checkAuth(UserRole.ADMIN),
  MovieController.createMovie,
);

router.get("/", MovieController.getAllMovies);

router.get("/:id", MovieController.getSingleMovie);

export const MovieRoutes = router;
