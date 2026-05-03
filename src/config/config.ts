import dotenv from "dotenv";
import AppError from "../app/utils/AppError";
import { StatusCodes } from "http-status-codes";
import { EnvConfig } from "../types/env.types";

dotenv.config();

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVars = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "AUTH_API_KEY",
    "MONTHLY_PLAN_PRICE_ID",
    "YEARLY_PLAN_PRICE_ID",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "CLIENT_URL",
    "EMAIL_USER",
    "EMAIL_PASS",
    "BACKEND_URL",
    "OPENAI_API_KEY",
    "GOOGLE_GENERATIVE_AI_API_KEY",
  ];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Environment variable ${varName} is required but not defined.`,
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT || "5000",
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    AUTH_API_KEY: process.env.AUTH_API_KEY as string,
    MONTHLY_PLAN_PRICE_ID: process.env.MONTHLY_PLAN_PRICE_ID as string,
    YEARLY_PLAN_PRICE_ID: process.env.YEARLY_PLAN_PRICE_ID as string,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
    CLIENT_URL: process.env.CLIENT_URL as string,
    EMAIL_USER: process.env.EMAIL_USER as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,
    BACKEND_URL: process.env.BACKEND_URL as string,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
  };
};

export const envVars = loadEnvVariables();
