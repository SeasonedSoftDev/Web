/*
  Warnings:

  - Added the required column `type` to the `custom_statements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "custom_statements" ADD COLUMN     "type" INTEGER NOT NULL;
