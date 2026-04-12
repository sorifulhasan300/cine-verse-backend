import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendEmail } from "../utils/emailSender";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const html = `Click here to reset your password: ${url}`;
      await sendEmail(user.email, html, "Reset Password");
    },
  },
  // emailVerification: {
  //   sendOnSignUp: true,
  //   autoSignInAfterVerification: true,
  //   sendVerificationEmail: async ({ user, url }) => {
  //     const html = `
  //               <h1>Verify your email</h1>
  //               <p>Hi ${user.name}, please verify your email by clicking the link below:</p>
  //               <a href="${url}">Verify Email</a>
  //           `;
  //     await sendEmail(user.email, html, "Verify your CineVerse account");
  //   },
  // },
  plugins: [
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
          const html = `Your password reset code is: ${otp}`;
          await sendEmail(email, html, "Reset Password");
        }
      },
    }),
  ],
  trustedOrigins: ["http://localhost:5000"],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
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
});
