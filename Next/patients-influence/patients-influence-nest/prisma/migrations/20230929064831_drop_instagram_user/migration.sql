/*
  Warnings:

  - You are about to drop the `DiseaseAreasFromPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InstagramLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InstagramUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StrugglesFromPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SymptomsFromPosts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ThemesFromPosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DiseaseAreasFromPosts" DROP CONSTRAINT "DiseaseAreasFromPosts_instagram_user_id_fkey";

-- DropForeignKey
ALTER TABLE "InstagramLocation" DROP CONSTRAINT "InstagramLocation_instagram_user_id_fkey";

-- DropForeignKey
ALTER TABLE "InstagramUser" DROP CONSTRAINT "InstagramUser_influencerId_fkey";

-- DropForeignKey
ALTER TABLE "StrugglesFromPosts" DROP CONSTRAINT "StrugglesFromPosts_instagram_user_id_fkey";

-- DropForeignKey
ALTER TABLE "SymptomsFromPosts" DROP CONSTRAINT "SymptomsFromPosts_instagram_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ThemesFromPosts" DROP CONSTRAINT "ThemesFromPosts_instagram_user_id_fkey";

-- DropTable
DROP TABLE "DiseaseAreasFromPosts";

-- DropTable
DROP TABLE "InstagramLocation";

-- DropTable
DROP TABLE "InstagramUser";

-- DropTable
DROP TABLE "StrugglesFromPosts";

-- DropTable
DROP TABLE "SymptomsFromPosts";

-- DropTable
DROP TABLE "ThemesFromPosts";
