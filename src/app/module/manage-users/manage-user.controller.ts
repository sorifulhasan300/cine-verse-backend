import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { manageUsersService } from "./manage-users.service";

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;
  const result = await manageUsersService.getUsers({
    search: search as string,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await manageUsersService.blockUser(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User blocked successfully",
    data: result,
  });
});

const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await manageUsersService.unblockUser(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User unblocked successfully",
    data: result,
  });
});

const deactivateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await manageUsersService.deactivateUser(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User deactivated successfully",
    data: result,
  });
});

const activateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await manageUsersService.activateUser(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User activated successfully",
    data: result,
  });
});

export const ManageUserController = {
  getUsers,
  blockUser,
  unblockUser,
  deactivateUser,
  activateUser,
};