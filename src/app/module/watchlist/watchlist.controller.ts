import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WatchlistService } from "./watchlist.service";
import { Request, Response } from "express";

const toggleWatchlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { movieId } = req.body;

  const result = await WatchlistService.toggleWatchlist(
    userId as string,
    movieId,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const getMyWatchlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await WatchlistService.getMyWatchlist(userId as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Watchlist fetched successfully",
    data: result,
  });
});

const removeWatchlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { movieId } = req.body;

  const result = await WatchlistService.removeWatchlist(
    userId as string,
    movieId,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const WatchlistController = {
  toggleWatchlist,
  getMyWatchlist,
  removeWatchlist,
};
