/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `themes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "themes" ADD COLUMN     "identifier" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "themes_identifier_key" ON "themes"("identifier");
