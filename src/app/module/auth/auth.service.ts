import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

const verifyEmail = async (email: string, otp: string) => {
  console.log("Verifying email with OTP:", email, otp);
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
  await auth.api.requestPasswordReset({
    body: { email },
  });
  return { message: "OTP sent to your email for password reset" };
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  await auth.api.resetPassword({
    body: { newPassword, token: otp },
  });
  return { message: "Password reset successfully" };
};

const getProfile = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      status: true,
      emailVerified: true,
    },
  });
};

export const authService = {
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
};
