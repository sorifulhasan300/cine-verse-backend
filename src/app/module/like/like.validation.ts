import { z } from "zod";

export const likeValidationSchema = z.object({
  movieId: z.string("Movie ID is required"),
});
