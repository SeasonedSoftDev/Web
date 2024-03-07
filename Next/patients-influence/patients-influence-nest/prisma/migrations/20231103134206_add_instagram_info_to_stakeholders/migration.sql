/*
  Warnings:

  - You are about to drop the column `commentsCount` on the `influencers` table. All the data in the column will be lost.
  - You are about to drop the column `followersCount` on the `influencers` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `influencers` table. All the data in the column will be lost.
  - You are about to drop the column `postCount` on the `influencers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "influencers" DROP COLUMN "commentsCount",
DROP COLUMN "followersCount",
DROP COLUMN "likesCount",
DROP COLUMN "postCount";

-- AlterTable
ALTER TABLE "stakeholders" ADD COLUMN     "commentsCount" INTEGER,
ADD COLUMN     "likesCount" INTEGER,
ADD COLUMN     "postCount" INTEGER;
