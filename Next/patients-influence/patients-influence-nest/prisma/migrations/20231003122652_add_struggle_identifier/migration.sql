/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `struggles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "struggles" ADD COLUMN     "identifier" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "struggles_identifier_key" ON "struggles"("identifier");
