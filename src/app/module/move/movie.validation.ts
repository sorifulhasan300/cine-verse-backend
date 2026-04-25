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
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/, "Invalid date format, expected ISO-8601 DateTime (e.g., 2008-07-18T00:00 or 2008-07-18T00:00:00Z)"),
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

export const updateMovieValidationSchema = z.object({
  title: z
    .string("Title must be a string")
    .min(4, "Title must be at least 4 characters long")
    .optional(),

  description: z
    .string("Description must be a string")
    .min(10, "Description must be at least 10 characters long")
    .optional(),
  releaseYear: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/, "Invalid date format, expected ISO-8601 DateTime (e.g., 2008-07-18T00:00 or 2008-07-18T00:00:00Z)")
    .optional(),
  director: z.string("Director name must be a string").optional(),
  cast: z.string().optional(),
  videoUrl: z.string().url("Invalid video URL").optional(),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
  pricing: z.enum(
    ["FREE", "PREMIUM"],
    "Pricing must be either 'FREE' or 'PREMIUM'",
  ).optional(),
  categoryIds: z.array(z.string(), "Category IDs must be strings").optional(),
});

export default movieValidationSchema;
