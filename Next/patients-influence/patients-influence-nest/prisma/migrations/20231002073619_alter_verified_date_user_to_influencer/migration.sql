/*
  Warnings:

  - You are about to drop the column `verifiedSince` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "influencers" ADD COLUMN     "verifiedSince" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "verifiedSince";
