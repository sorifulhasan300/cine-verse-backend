import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, oAuthProxy } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendEmail } from "../utils/emailSender";
import { envVars } from "../../config/config";

const isProduction = envVars.NODE_ENV === "production";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  baseURL: envVars.BETTER_AUTH_URL,
  // trustedOrigins: [
  //   // envVars.CLIENT_URL || "https://cine-verse-frontend-gamma.vercel.app",
  //   // "https://merry-sunflower-fe240d.netlify.app",
  //   // "http://localhost:3000",
  //   // "https://cine-verse-backend-pro.vercel.app",

  // ],
  trustedOrigins: ["*"],

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
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

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
        name: "better-auth.session_token",
        attributes: {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
        },
      },
      state: {
        name: "better-auth.state",
        attributes: {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
        },
      },
    },
  },
  // advanced: {
  //   cookies: {
  //     session_token: {
  //       name: "session_token", // Force this exact name
  //       attributes: {
  //         httpOnly: true,
  //         secure: true,
  //         sameSite: "none",
  //       },
  //     },
  //     state: {
  //       name: "session_token", // Force this exact name
  //       attributes: {
  //         httpOnly: true,
  //         secure: true,
  //         sameSite: "none",
  //       },
  //     },
  //   },
  // },
});
