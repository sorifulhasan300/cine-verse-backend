import { z } from "zod";

export const categoryValidationSchema = z.object({
  name: z
    .string("Category name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
});
