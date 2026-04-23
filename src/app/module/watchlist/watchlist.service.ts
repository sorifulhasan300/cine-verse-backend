import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";

const toggleWatchlist = async (userId: string, movieId: string) => {
  const isExist = await prisma.watchList.findUnique({
    where: {
      userId_movieId: { userId, movieId },
    },
  });

  if (isExist) {
    await prisma.watchList.delete({
      where: { id: isExist.id },
    });
    return { message: "Removed from watchlist" };
  } else {
    await prisma.watchList.create({
      data: { userId, movieId },
    });
    return { message: "Added to watchlist" };
  }
};

const getMyWatchlist = async (userId: string) => {
  const result = await prisma.watchList.findMany({
    where: { userId },
    include: {
      movie: {
        include: {
          categories: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const removeWatchlist = async (userId: string, movieId: string) => {
  const isExist = await prisma.watchList.findUnique({
    where: {
      userId_movieId: { userId, movieId },
    },
  });

  if (!isExist) {
    throw new AppError(404, "Movie not found in watchlist");
  }

  await prisma.watchList.delete({
    where: { id: isExist.id },
  });
  return { message: "Removed from watchlist" };
};

export const WatchlistService = {
  toggleWatchlist,
  getMyWatchlist,
  removeWatchlist,
};
