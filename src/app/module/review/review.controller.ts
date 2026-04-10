import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";
import { StatusCodes } from "http-status-codes";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await ReviewService.createReview(userId as string, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Review added successfully",
    data: result,
  });
});

const getMovieReviews = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const result = await ReviewService.getReviewsByMovie(movieId as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getMovieReviews,
};
