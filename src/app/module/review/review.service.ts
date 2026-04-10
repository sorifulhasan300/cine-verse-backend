import { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReview = async (userId: string, payload: Review) => {
  const result = await prisma.review.create({
    data: {
      ...payload,
      userId,
    },
  });
  return result;
};

const getReviewsByMovie = async (movieId: string) => {
  return await prisma.review.findMany({
    where: { movieId },
    include: {
      user: {
        select: { name: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const ReviewService = {
  createReview,
  getReviewsByMovie,
};
