import { auth } from "../app/lib/auth";
import { prisma } from "../app/lib/prisma";
import { fromNodeHeaders } from "better-auth/node";
import catchAsync from "../app/utils/catchAsync";

export const checkPremium = catchAsync(async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ message: "Please login first" });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription || subscription.plan === "FREE") {
    return res.status(403).json({
      message: "Access Denied. Please subscribe to watch this movie.",
      redirectTo: "/pricing",
    });
  }

  next();
});
