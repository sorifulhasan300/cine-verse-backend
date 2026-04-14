import { NextFunction, Request, Response } from "express";
import { MovieService } from "./move.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";

const createMovie = catchAsync(async (req, res) => {
  const result = await MovieService.createMovie(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Movie created successfully",
    data: result,
  });
});

const getAllMovies = catchAsync(async (req, res) => {
  const filters = req.query;
  const result = await MovieService.getAllMovies(filters);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Movies fetched successfully",
    data: result,
  });
});

const getSingleMovie = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "You are not a premium user",
      data: null,
    });
  }

  // Check if user has active subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription || (subscription.status as string) !== "ACTIVE" || subscription.plan === "FREE") {
    return sendResponse(res, {
      statusCode: StatusCodes.FORBIDDEN,
      success: false,
      message: "You are not a premium user",
      data: null,
    });
  }

  const result = await MovieService.getSingleMovie(
    req.params.id as string,
    userId as string,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Movie detail fetched",
    data: result,
  });
});

export const MovieController = {
  createMovie,
  getAllMovies,
  getSingleMovie,
};
