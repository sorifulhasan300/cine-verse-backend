import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { handleZodError } from "./handleZodError";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "../generated/prisma/internal/prismaNamespace";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    if (simplifiedError) {
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorSources = simplifiedError.errorSources.map((error) => ({
        path: String(error.path),
        message: error.message,
      }));
    }
  } else if (err instanceof PrismaClientKnownRequestError) {
    // Handle known Prisma errors with specific codes
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Unique constraint violation";
        break;
      case "P2003":
        statusCode = 400;
        message = "Foreign key constraint failed";
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;
      case "P2000":
        statusCode = 400;
        message = "Value too long for column";
        break;
      case "P2014":
        statusCode = 400;
        message = "Invalid ID provided";
        break;
      case "P2011":
        statusCode = 400;
        message = "Null constraint violation";
        break;
      case "P2028":
        statusCode = 400;
        message = "Transaction API error";
        break;
      default:
        statusCode = 400;
        message = "Database operation failed";
    }
    errorSources = [
      {
        path: err.meta?.target ? String(err.meta.target) : "",
        message: err.message,
      },
    ];
  } else if (err instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = "Validation error in database query";
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Unknown database error occurred";
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof PrismaClientInitializationError) {
    statusCode = 500;
    message = "Database connection failed";
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof PrismaClientRustPanicError) {
    statusCode = 500;
    message = "Database engine error";
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: process.env.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
