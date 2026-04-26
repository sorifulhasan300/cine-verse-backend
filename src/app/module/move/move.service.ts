import QueryBuilder from "../../../builder/QueryBuilder";
import { Movie, Pricing } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ca } from "zod/locales";

const createMovie = async (payload: any) => {
  const { categoryIds, ...movieData } = payload;

  // Ensure releaseYear is full ISO DateTime
  if (movieData.releaseYear) {
    if (movieData.releaseYear.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
      movieData.releaseYear += ":00Z";
    }
  }

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
    query.sort = "releaseYear";
  }
  if (!query.sortOrder) {
    query.sortOrder = "desc";
  }

  // Include categories in the result
  query.include = {
    categories: true,
    _count: { select: { likes: true, reviews: true } },
    rating: true,
  };

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
    query.sort = "releaseYear";
  }
  if (!query.sortOrder) {
    query.sortOrder = "desc";
  }

  // Include categories in the result
  query.include = { categories: true };

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

  // Ensure releaseYear is full ISO DateTime
  if (
    movieData.releaseYear &&
    movieData.releaseYear.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  ) {
    movieData.releaseYear += ":00Z";
  }

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

const getMostPopularMovies = async () => {
  const result = await prisma.movie.findMany({
    include: {
      categories: true,
      _count: {
        select: {
          likes: true,
          reviews: true,
        },
      },
    },
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
    take: 4,
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
  getMostPopularMovies,
  getSingleMovie,
};
