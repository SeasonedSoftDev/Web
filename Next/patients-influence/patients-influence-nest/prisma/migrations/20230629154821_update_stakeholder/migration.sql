/*
  Warnings:

  - Made the column `socialPlatformUsername` on table `stakeholders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "stakeholders" ALTER COLUMN "socialPlatformUsername" SET NOT NULL,
ALTER COLUMN "type" DROP NOT NULL;
