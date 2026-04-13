import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
      },
    });
  }
};

const forgotPassword = async (email: string) => {
  await auth.api.forgetPassword({
    body: {
      email,
    },
  });
};

const resetPassword = async (email: string, otp: string, newPassword: string) => {
  // First verify the OTP for password reset
  const verifyResult = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
      type: "forget-password", // Assuming it accepts type
    },
  });

  if (verifyResult.status) {
    // Now reset the password
    await auth.api.resetPassword({
      body: {
        email,
        newPassword,
      },
    });
  } else {
    throw new Error("Invalid OTP");
  }
};

export const authService = {
  verifyEmail,
  forgotPassword,
  resetPassword,
};
