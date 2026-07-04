import e, { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";
import { auth } from "../../lib/auth";

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await authService.verifyEmail(email, otp);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Email verify successfully",
  });
});

export const forgetPasswordRequest = catchAsync(async (req, res) => {
  const { email } = req.body;

  await authService.forgotPassword(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent to your email for password reset.",
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  await authService.resetPassword(email, otp, newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message:
      "Password reset successful! You can now login with your new password.",
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const profile = await authService.getProfile(user.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: profile,
  });
});

export const AuthController = {
  verifyEmail,
  forgetPasswordRequest,
  resetPassword,
  getProfile,
};
