import { z } from "zod";

export const movieValidationSchema = z.object({
  title: z
    .string("Title is required")
    .min(4, "Title must be at least 4 characters long"),

  description: z
    .string("Description is required")
    .min(10, "Description must be at least 10 characters long"),
  releaseYear: z
    .string()
    .datetime({ message: "Invalid date format, expected ISO string" }),
  director: z.string("Director name is required"),
  cast: z.string().optional(),
  videoUrl: z.string().url("Invalid video URL"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL"),
  pricing: z.enum(
    ["FREE", "PREMIUM"],
    "Pricing must be either 'FREE' or 'PREMIUM'",
  ),
  categoryIds: z.array(z.string(), "At least one category is required").min(1),
});

export default movieValidationSchema;
