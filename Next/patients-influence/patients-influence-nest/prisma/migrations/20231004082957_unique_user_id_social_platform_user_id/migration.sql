/*
  Warnings:

  - A unique constraint covering the columns `[influencerId,socialPlatformUserId]` on the table `stakeholders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "stakeholders_socialPlatformId_socialPlatformUserId_key";

-- DropIndex
DROP INDEX "stakeholders_socialPlatformUserId_key";

-- CreateIndex
CREATE UNIQUE INDEX "stakeholders_influencerId_socialPlatformUserId_key" ON "stakeholders"("influencerId", "socialPlatformUserId");
