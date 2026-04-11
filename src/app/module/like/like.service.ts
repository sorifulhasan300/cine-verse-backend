import { prisma } from "../../lib/prisma";

const toggleLike = async (userId: string, movieId: string) => {
  const isExist = await prisma.like.findUnique({
    where: {
      userId_movieId: {
        userId,
        movieId,
      },
    },
  });

  if (isExist) {
    await prisma.like.delete({
      where: {
        id: isExist.id,
      },
    });
    return { message: "Unliked successfully" };
  } else {
    await prisma.like.create({
      data: {
        userId,
        movieId,
      },
    });

    return { message: "Liked successfully" };
  }
};

export const LikeService = {
  toggleLike,
};
