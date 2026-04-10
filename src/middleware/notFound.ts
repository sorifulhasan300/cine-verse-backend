import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API Path Not Found!",
    errorSources: [
      {
        path: req.originalUrl,
        message: `Your requested URL [${req.method}] ${req.originalUrl} was not found on this server.`,
      },
    ],
  });
};

export default notFound;
