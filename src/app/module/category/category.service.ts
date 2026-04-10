import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (payload: Category): Promise<Category> => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    include: {
      _count: {
        select: { movies: true },
      },
    },
  });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
};





