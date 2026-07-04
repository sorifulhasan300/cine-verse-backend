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
  console.log(email);
  // Send an OTP for password reset using the email-otp plugin
  await auth.api.sendVerificationOTP({
    body: { email, type: "forget-password" },
  });
  return { message: "OTP sent to your email for password reset" };
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  console.log(email, otp, newPassword);
  // Reset password using the email-otp reset endpoint
  await auth.api.resetPasswordEmailOTP({
    body: { email, otp, password: newPassword },
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
