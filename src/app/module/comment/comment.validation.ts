import z from "zod";

export const commentValidationSchema = z.object({
  text: z.string().min(6).max(500),
  reviewId: z.string(),
  parentId: z.string().optional(),
});
