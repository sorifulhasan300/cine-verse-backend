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
    sendResetPassword: async ({ email, token }) => {
      try {
        const resetUrl = `${envVars.CLIENT_URL}/reset-password?token=${encodeURIComponent(
          token as string,
        )}&email=${encodeURIComponent(email as string)}`;

        const html = `
              <div style="font-family: sans-serif; padding: 20px;">
                  <h2>Password Reset</h2>
                  <p>We received a request to reset the password for <b>${email}</b>.</p>
                  <p>Click the link below to reset your password (link expires in 2 minutes):</p>
                  <a href="${resetUrl}">Reset your password</a>
                  <p>If you didn't request this, ignore this email.</p>
              </div>
          `;

        await sendEmail(email as string, html, "Reset Your CineVerse Password");
      } catch (err) {
        console.error("Failed to send reset password email:", err);
        throw err;
      }
    },
  },

  baseURL: envVars.BETTER_AUTH_URL,

  trustedOrigins: ["*"],

  plugins: [
    oAuthProxy(),
    emailOTP({
      expiresIn: 120, // 2 minutes in seconds
      overrideDefaultEmailVerification: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type === "email-verification") {
          const html = `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Verify Your Email</h2>
                    <p>Hi, your verification code is:</p>
                    <h1 style="color: #3b82f6;">${otp}</h1>
                    <p>This code will expire in 2 minutes.</p>
                </div>
            `;
          await sendEmail(email, html, "Your Verification Code");
        } else if (type === "forget-password") {
          const html = `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>Hi, use the code below to reset your password:</p>
                    <h1 style="color: #ef4444; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 2 minutes. If you didn't request this, please ignore this email.</p>
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
});
