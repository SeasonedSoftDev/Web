/*
  Warnings:

  - A unique constraint covering the columns `[instagram_user_id]` on the table `DiseaseAreasFromPosts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instagram_user_id]` on the table `StrugglesFromPosts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instagram_user_id]` on the table `SymptomsFromPosts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instagram_user_id]` on the table `ThemesFromPosts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DiseaseAreasFromPosts" DROP CONSTRAINT "DiseaseAreasFromPosts_instagram_user_id_fkey";

-- DropForeignKey
ALTER TABLE "StrugglesFromPosts" DROP CONSTRAINT "StrugglesFromPosts_instagram_user_id_fkey";

-- DropForeignKey
ALTER TABLE "SymptomsFromPosts" DROP CONSTRAINT "SymptomsFromPosts_instagram_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ThemesFromPosts" DROP CONSTRAINT "ThemesFromPosts_instagram_user_id_fkey";

-- AlterTable
ALTER TABLE "influencers" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "DiseaseAreasFromPosts_instagram_user_id_key" ON "DiseaseAreasFromPosts"("instagram_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "StrugglesFromPosts_instagram_user_id_key" ON "StrugglesFromPosts"("instagram_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "SymptomsFromPosts_instagram_user_id_key" ON "SymptomsFromPosts"("instagram_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ThemesFromPosts_instagram_user_id_key" ON "ThemesFromPosts"("instagram_user_id");

-- AddForeignKey
ALTER TABLE "ThemesFromPosts" ADD CONSTRAINT "ThemesFromPosts_instagram_user_id_fkey" FOREIGN KEY ("instagram_user_id") REFERENCES "InstagramUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseaseAreasFromPosts" ADD CONSTRAINT "DiseaseAreasFromPosts_instagram_user_id_fkey" FOREIGN KEY ("instagram_user_id") REFERENCES "InstagramUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomsFromPosts" ADD CONSTRAINT "SymptomsFromPosts_instagram_user_id_fkey" FOREIGN KEY ("instagram_user_id") REFERENCES "InstagramUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrugglesFromPosts" ADD CONSTRAINT "StrugglesFromPosts_instagram_user_id_fkey" FOREIGN KEY ("instagram_user_id") REFERENCES "InstagramUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
