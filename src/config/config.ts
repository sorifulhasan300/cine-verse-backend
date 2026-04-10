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
  };
};

export const envVars = loadEnvVariables();
