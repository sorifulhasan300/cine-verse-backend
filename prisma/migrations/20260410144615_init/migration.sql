/*
  Warnings:

  - A unique constraint covering the columns `[userId,movieId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_movieId_key" ON "reviews"("userId", "movieId");
