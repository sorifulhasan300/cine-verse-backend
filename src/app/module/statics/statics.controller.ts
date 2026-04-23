import { NextFunction, Request, Response } from "express";
import { StaticsService } from "./statics.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";

const adminStatics = catchAsync(async (req, res) => {
  const result = await StaticsService.adminStatics();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin statistics fetched successfully",
    data: result,
  });
});

const userStatics = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  const result = await StaticsService.userStatics(userId as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User statistics fetched successfully",
    data: result,
  });
});

export const StaticsController = {
  adminStatics,
  userStatics,
};
