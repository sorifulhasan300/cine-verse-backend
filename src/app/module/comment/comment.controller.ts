import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CommentService } from "./comment.service";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await CommentService.createReviewComment(
    userId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: req.body.parentCommentId
      ? "Reply added successfully"
      : "Comment added successfully",
    data: result,
  });
});

const getCommentsByReview = catchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const result = await CommentService.getCommentsByReview(reviewId as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Comments and replies fetched successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const userId = req.user?.id;

  await CommentService.deleteComment(commentId as string, userId as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Comment deleted successfully",
    data: null,
  });
});

export const CommentController = {
  createComment,
  getCommentsByReview,
  deleteComment,
};
