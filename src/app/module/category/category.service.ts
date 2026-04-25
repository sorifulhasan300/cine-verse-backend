import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (payload: Category): Promise<Category> => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategories = async (options: { search?: string; page?: number; limit?: number } = {}) => {
  const { search, page = 1, limit = 10 } = options;

  const where: any = {};

  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

  const total = await prisma.category.count({ where });

  const result = await prisma.category.findMany({
    where,
    include: {
      _count: {
        select: { movies: true },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  return { data: result, meta: { page, limit, total } };
};

const updateCategory = async (id: string, payload: Partial<Category>) => {
  const result = await prisma.category.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteCategory = async (id: string) => {
  const result = await prisma.category.delete({
    where: { id },
  });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};





