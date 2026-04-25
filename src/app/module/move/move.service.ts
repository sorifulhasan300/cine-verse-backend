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
  // Default to sorting by releaseYear descending for latest movies first
  if (!query.sort) {
    query.sort = 'releaseYear';
  }
  if (!query.sortOrder) {
    query.sortOrder = 'desc';
  }

  const movieQuery = new QueryBuilder(prisma.movie, query)
    .search(["title", "director", "cast"])
    .filter()
    .sort()
    .paginate();

  const result = await movieQuery.execute();
  return result;
};

const getAllMoviesForAdmin = async (query: Record<string, any>) => {
  // Default to sorting by releaseYear descending for latest movies first
  if (!query.sort) {
    query.sort = 'releaseYear';
  }
  if (!query.sortOrder) {
    query.sortOrder = 'desc';
  }

  const movieQuery = new QueryBuilder(prisma.movie, query)
    .search(["title", "director", "cast"])
    .filter()
    .sort()
    .paginate();

  const result = await movieQuery.execute();
  return result;
};

const updateMovie = async (id: string, payload: any) => {
  const { categoryIds, ...movieData } = payload;
  console.log(payload);
  const updateData: any = { ...movieData };

  if (categoryIds) {
    updateData.categories = {
      set: [], // Disconnect all existing categories
      connect: categoryIds.map((id: string) => ({ id })),
    };
  }

  const result = await prisma.movie.update({
    where: { id },
    data: updateData,
    include: {
      categories: true,
    },
  });
  return result;
};

const getSingleMovie = async (id: string, userId?: string) => {
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
      watchLists: userId ? { where: { userId } } : false,
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
  updateMovie,
  getAllMovies,
  getAllMoviesForAdmin,
  getSingleMovie,
};
