/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `stakeholders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stakeholders" DROP COLUMN "dateOfBirth",
ADD COLUMN     "age" INTEGER;
