import { Movie, Pricing } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createMovie = async (payload: Movie): Promise<Movie> => {
  const result = await prisma.movie.create({
    data: payload,
    include: {
      category: true, 
    },
  });
  return result;
};

const getAllMovies = async (filters: any) => {
  const { searchTerm, categoryId, pricing } = filters;

  return await prisma.movie.findMany({
    where: {
      AND: [
        searchTerm
          ? { title: { contains: searchTerm, mode: "insensitive" } }
          : {},
        categoryId ? { categoryId } : {},
        pricing ? { pricing: pricing as Pricing } : {},
      ],
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
};

const getSingleMovie = async (id: string) => {
  return await prisma.movie.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: { include: { user: true } },
    },
  });
};

export const MovieService = {
  createMovie,
  getAllMovies,
  getSingleMovie,
};
