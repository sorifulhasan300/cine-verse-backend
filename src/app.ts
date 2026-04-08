import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";

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

// // ৩. অ্যাপ্লিকেশন রাউটস (API Endpoints)
// app.use("/api/v1", router);

// // ৪. গ্লোবাল এরর হ্যান্ডলিং মিডলওয়্যার (সবার শেষে থাকবে)
// app.use(globalErrorHandler);

// // ৫. নট ফাউন্ড রাউট (৪শে৪ হ্যান্ডলার)
// app.use(notFound);

export default app;
