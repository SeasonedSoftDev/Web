/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `ethnicities` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ethnicities" ADD COLUMN     "identifier" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ethnicities_identifier_key" ON "ethnicities"("identifier");
