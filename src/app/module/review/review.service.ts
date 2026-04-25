import { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";

const createReview = async (userId: string, payload: Review) => {
  // Check if user already reviewed this movie
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_movieId: {
        userId,
        movieId: payload.movieId,
      },
    },
  });

  if (existingReview) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "You have already reviewed this movie. You can only submit one review per movie."
    );
  }

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
