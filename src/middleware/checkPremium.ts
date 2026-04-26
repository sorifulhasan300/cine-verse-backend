import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../app/lib/auth";
import { prisma } from "../app/lib/prisma";
import catchAsync from "../app/utils/catchAsync";

export const checkPremium = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const movie = await prisma.movie.findUnique({
    where: { id: id as string },
    select: { pricing: true },
  });

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  if (movie.pricing === "FREE") {
    return next();
  }

  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res
      .status(401)
      .json({ message: "Please login first to watch premium content" });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    select: { plan: true },
  });

  if (!user || user.plan === "FREE") {
    return res.status(403).json({
      message: "Access Denied. Please subscribe to watch this movie.",
      redirectTo: "/pricing",
    });
  }

  next();
});
