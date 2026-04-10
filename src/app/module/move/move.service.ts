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
    include: { categories: true },
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
