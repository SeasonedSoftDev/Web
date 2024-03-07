/*
  Warnings:

  - You are about to drop the column `subTypeId` on the `custom_statements` table. All the data in the column will be lost.
  - You are about to drop the `custom_statements_subtypes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "custom_statements" DROP CONSTRAINT "custom_statements_subTypeId_fkey";

-- AlterTable
ALTER TABLE "custom_statements" DROP COLUMN "subTypeId";

-- DropTable
DROP TABLE "custom_statements_subtypes";
