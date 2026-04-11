import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { LikeService } from "./like.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { movieId } = req.body;

  const result = await LikeService.toggleLike(userId as string, movieId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const LikeController = {
  toggleLike,
};
