import { z } from "zod";

export const reviewValidationSchema = z.object({
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  text: z.string().min(10, "Comment must be at least 10 characters long"),
  movieId: z.string("Movie ID is required"),
});
