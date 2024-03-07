/*
  Warnings:

  - You are about to drop the column `typeIndentifier` on the `stakeholders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stakeholders" DROP COLUMN "typeIndentifier",
ADD COLUMN     "type" INTEGER;
