import { prisma } from "../../lib/prisma";

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

export const WatchlistService = {
  toggleWatchlist,
  getMyWatchlist,
};
