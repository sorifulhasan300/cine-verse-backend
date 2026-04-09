import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import { auth } from "./app/lib/auth";
import { toNodeHandler } from "better-auth/node";
import { routers } from "./routers";

const app: Application = express();

//parser and common middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//home route
app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to CineVerse API! 🚀",
  });
});

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/v1", routers);
export default app;
