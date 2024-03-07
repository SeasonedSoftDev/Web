/*
  Warnings:

  - A unique constraint covering the columns `[instagramUsername]` on the table `influencers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "influencers_instagramUsername_key" ON "influencers"("instagramUsername");
