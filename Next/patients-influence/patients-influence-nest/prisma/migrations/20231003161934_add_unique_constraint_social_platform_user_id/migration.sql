/*
  Warnings:

  - A unique constraint covering the columns `[socialPlatformUserId]` on the table `stakeholders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "stakeholders_socialPlatformUserId_key" ON "stakeholders"("socialPlatformUserId");
