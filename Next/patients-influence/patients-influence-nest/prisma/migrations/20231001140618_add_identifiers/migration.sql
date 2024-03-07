/*
  Warnings:

  - You are about to drop the column `type` on the `stakeholders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identifier]` on the table `disease_areas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier]` on the table `interests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier]` on the table `symptoms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `interests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identifier` to the `symptoms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "disease_areas" ADD COLUMN     "identifier" TEXT;

-- AlterTable
ALTER TABLE "interests" ADD COLUMN     "identifier" TEXT;

-- AlterTable
ALTER TABLE "stakeholders" DROP COLUMN "type",
ADD COLUMN     "typeIndentifier" TEXT;

-- AlterTable
ALTER TABLE "symptoms" ADD COLUMN     "identifier" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "disease_areas_identifier_key" ON "disease_areas"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "interests_identifier_key" ON "interests"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "symptoms_identifier_key" ON "symptoms"("identifier");
