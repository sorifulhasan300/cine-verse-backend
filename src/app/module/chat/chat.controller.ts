import { Request, Response } from "express";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import catchAsync from "../../utils/catchAsync";

const chat = catchAsync(async (req: Request, res: Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      success: false,
      message: "Messages array is required",
    });
  }

  const result = await streamText({
    model: google("gemini-2.5-flash"),
    system:
      "You are CineVerse AI, an expert on the CineVerse movie platform. CineVerse uses Next.js, Express, PostgreSQL, and Better Auth. Help users with movie info and technical questions about the site.",
    messages,
  });

  result.pipeTextStreamToResponse(res);
});

export const ChatController = {
  chat,
};
