import { STATUS_CODES } from "node:http";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";

const createComment = async (
  userId: string,
  payload: { text: string; reviewId: string; parentId?: string },
) => {
  // return console.log("parent id", payload);

  // Check if the review exists and get its userId
  const review = await prisma.review.findUnique({
    where: { id: payload.reviewId },
    select: { userId: true },
  });

  if (!review) {
    throw new AppError(StatusCodes.NOT_FOUND, "Review not found!");
  }

  // Prevent user from commenting on their own review
  if (review.userId === userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You cannot comment on your own review."
    );
  }

  const result = await prisma.comment.create({
    data: {
      text: payload.text,
      reviewId: payload.reviewId,
      userId: userId,
      parentId: payload.parentId || null,
    },

    include: {
      user: { select: { name: true, image: true } },
      replies: {
        include: {
          user: { select: { name: true, image: true } },
        },
      },
    },
  });
  return result;
};

const getCommentsByReview = async (reviewId: string) => {
  return await prisma.comment.findMany({
    where: {
      reviewId,
      parentId: null,
    },
    include: {
      user: { select: { name: true, image: true } },
      replies: {
        include: {
          user: { select: { name: true, image: true } },
          replies: {
            include: {
              user: { select: { name: true, image: true } },
              replies: {
                include: {
                  user: { select: { name: true, image: true } },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const deleteComment = async (commentId: string, userId: string) => {
  const isCommentExist = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!isCommentExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Comment not found!");
  }

  if (isCommentExist.userId !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to delete this comment!",
    );
  }

  const result = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return result;
};

export const CommentService = {
  createReviewComment: createComment,
  getCommentsByReview,
  deleteComment,
};
