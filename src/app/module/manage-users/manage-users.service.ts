import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../generated/prisma/client";

interface GetUsersParams {
  search?: string;
  page?: number;
  limit?: number;
}

const getUsers = async ({ search, page = 1, limit = 10 }: GetUsersParams) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const blockUser = async (id: string) => {
  return await prisma.user.update({
    where: { id },
    data: { status: UserStatus.BLOCKED },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    },
  });
};

const unblockUser = async (id: string) => {
  return await prisma.user.update({
    where: { id },
    data: { status: UserStatus.ACTIVE },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    },
  });
};

const deactivateUser = async (id: string) => {
  return await prisma.user.update({
    where: { id },
    data: { status: UserStatus.INACTIVE },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    },
  });
};

const activateUser = async (id: string) => {
  return await prisma.user.update({
    where: { id },
    data: { status: UserStatus.ACTIVE },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    },
  });
};

export const manageUsersService = {
  getUsers,
  blockUser,
  unblockUser,
  deactivateUser,
  activateUser,
};