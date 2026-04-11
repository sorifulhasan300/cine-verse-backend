import QueryBuilder from "../../../builder/QueryBuilder";
import { Movie, Pricing } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createMovie = async (payload: any) => {
  const { categoryIds, ...movieData } = payload;

  const result = await prisma.movie.create({
    data: {
      ...movieData,
      categories: {
        connect: categoryIds.map((id: string) => ({ id })),
      },
    },
    include: {
      categories: true,
    },
  });
  return result;
};

const getAllMovies = async (query: Record<string, any>) => {
  const movieQuery = new QueryBuilder(prisma.movie, query)
    .search(["title", "director", "cast"])
    .filter()
    .sort()
    .paginate();

  const result = await movieQuery.execute();
  return result;
};

const getSingleMovie = async (id: string) => {
  return await prisma.movie.findUnique({
    where: {
      id: id,
    },
    include: {
      categories: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },

          comments: {
            include: {
              user: true,
            },
          },
        },
      },
      likes: true,
      _count: {
        select: {
          likes: true,
          reviews: true,
        },
      },
    },
  });
};

export const MovieService = {
  createMovie,
  getAllMovies,
  getSingleMovie,
};
