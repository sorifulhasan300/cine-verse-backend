import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, oAuthProxy } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendEmail } from "../utils/emailSender";
import { UserRole } from "../../types/role.types";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  baseURL: process.env.FRONTEND_URL,
  trustedOrigins: [process.env.FRONTEND_URL!, process.env.BACKEND_URL!],

  plugins: [
    oAuthProxy(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type === "email-verification") {
          const html = `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Verify Your Email</h2>
                    <p>Hi, your verification code is:</p>
                    <h1 style="color: #3b82f6;">${otp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `;
          await sendEmail(email, html, "Your Verification Code");
        } else if (type === "forget-password") {
          const html = `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>Hi, use the code below to reset your password:</p>
                    <h1 style="color: #ef4444; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            `;
          await sendEmail(email, html, "Reset Your Password - CineVerse");
        }
      },
    }),
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      plan: {
        type: "string",
        defaultValue: "FREE",
        required: false,
      },
      currentPeriodEnd: {
        type: "date",
        required: false,
      },

      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  advanced: {
    cookies: {
      session_token: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
      state: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
    },
  },
});
