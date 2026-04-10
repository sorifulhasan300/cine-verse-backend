/*
  Warnings:

  - You are about to drop the column `categoryId` on the `movies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_categoryId_fkey";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "_MovieToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MovieToCategory_B_index" ON "_MovieToCategory"("B");

-- AddForeignKey
ALTER TABLE "_MovieToCategory" ADD CONSTRAINT "_MovieToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieToCategory" ADD CONSTRAINT "_MovieToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
