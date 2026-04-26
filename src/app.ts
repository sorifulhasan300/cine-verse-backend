import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { auth } from "./app/lib/auth";
import { toNodeHandler } from "better-auth/node";
import { routers } from "./routers";
import notFound from "./middleware/notFound";
import globalErrorHandler from "./errors/globalErrorHandler";
import { StatusCodes } from "http-status-codes";
import { SubscriptionController } from "./app/module/subscription/subscription.controller";

const app: Application = express();

//parser and common middlewares
// app.use(cors({ origin: true, credentials: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    // allowedHeaders: [["Content-Type", "Authorization", "Cookie"],
  }),
);
app.use(cookieParser());

// webhook not working properly need to fix and generate
// new webhook secret and update in env vars and stripe dashboard and test with stripe cli
app.post(
  "/api/v1/subscriptions/webhook",
  express.raw({ type: "application/json" }),
  SubscriptionController.stripeWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//home route
app.get("/", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Welcome to CineVerse API! 🚀",
  });
});

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/v1", routers);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
