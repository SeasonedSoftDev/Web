/*
  Warnings:

  - Made the column `socialPlatformUserId` on table `stakeholders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "stakeholders" ALTER COLUMN "socialPlatformUserId" SET NOT NULL;

-- CreateTable
CREATE TABLE "InstagramUser" (
    "id" SERIAL NOT NULL,
    "influencerId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "is_private" BOOLEAN NOT NULL,
    "profile_pic_url" TEXT NOT NULL,
    "profile_pic_url_hd" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL,
    "media_count" INTEGER NOT NULL,
    "follower_count" INTEGER NOT NULL,
    "following_count" INTEGER NOT NULL,
    "biography" TEXT NOT NULL,
    "external_url" TEXT NOT NULL,
    "account_type" INTEGER NOT NULL,
    "is_business" BOOLEAN NOT NULL,
    "public_email" TEXT NOT NULL,
    "contact_phone_number" TEXT NOT NULL,
    "public_phone_country_code" TEXT NOT NULL,
    "public_phone_number" TEXT NOT NULL,
    "business_contact_method" TEXT NOT NULL,
    "business_category_name" TEXT,
    "category_name" TEXT,
    "category" TEXT NOT NULL,
    "address_street" TEXT,
    "city_id" TEXT NOT NULL,
    "city_name" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "zip" TEXT,
    "interop_messaging_user_fbid" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "ethnicity" TEXT NOT NULL,
    "stakeholder" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL,

    CONSTRAINT "InstagramUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstagramLocation" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "instagram_user_id" INTEGER NOT NULL,

    CONSTRAINT "InstagramLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemesFromPosts" (
    "id" SERIAL NOT NULL,
    "other" DOUBLE PRECISION NOT NULL,
    "personal" DOUBLE PRECISION NOT NULL,
    "medical" DOUBLE PRECISION NOT NULL,
    "healthy_lifestyle" DOUBLE PRECISION NOT NULL,
    "instagram_user_id" INTEGER NOT NULL,

    CONSTRAINT "ThemesFromPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiseaseAreasFromPosts" (
    "id" SERIAL NOT NULL,
    "other" DOUBLE PRECISION NOT NULL,
    "spinal_muscular_atrophy_sma" DOUBLE PRECISION NOT NULL,
    "instagram_user_id" INTEGER NOT NULL,

    CONSTRAINT "DiseaseAreasFromPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SymptomsFromPosts" (
    "id" SERIAL NOT NULL,
    "other" DOUBLE PRECISION NOT NULL,
    "reduced_mobility" DOUBLE PRECISION NOT NULL,
    "pain" DOUBLE PRECISION NOT NULL,
    "muscle_weakness" DOUBLE PRECISION NOT NULL,
    "instagram_user_id" INTEGER NOT NULL,

    CONSTRAINT "SymptomsFromPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrugglesFromPosts" (
    "id" SERIAL NOT NULL,
    "no_complaints" DOUBLE PRECISION NOT NULL,
    "other_complaints" DOUBLE PRECISION NOT NULL,
    "healthcare_relationships_and_access" DOUBLE PRECISION NOT NULL,
    "side_effects_and_symptoms" DOUBLE PRECISION NOT NULL,
    "treatment_efficacy_and_usability" DOUBLE PRECISION NOT NULL,
    "financial_burden_and_insurance_literacy" DOUBLE PRECISION NOT NULL,
    "medical_knowledge_empowerment" DOUBLE PRECISION NOT NULL,
    "instagram_user_id" INTEGER NOT NULL,

    CONSTRAINT "StrugglesFromPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstagramUser_influencerId_key" ON "InstagramUser"("influencerId");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramLocation_instagram_user_id_key" ON "InstagramLocation"("instagram_user_id");

-- AddForeignKey
ALTER TABLE "InstagramUser" ADD CONSTRAINT "InstagramUser_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "influencers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstagramLocation" ADD CONSTRAINT "InstagramLocation_instagram_user_id_fkey" FOREIGN KEY ("instagram_user_id") REFERENCES "InstagramUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemesFromPosts" ADD CONSTRAINT "ThemesFromPosts_instagram_user_id_fkey" FOREIGN KEY ("instagram_user_id") REFERENCES "InstagramUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseaseAreasFromPosts" ADD CONSTRAINT "DiseaseAreasFromPosts_instagram_user_id_fkey" FOREIGN KEY ("instagram_user_id") REFERENCES "InstagramUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomsFromPosts" ADD CONSTRAINT "SymptomsFromPosts_instagram_user_id_fkey" FOREIGN KEY ("instagram_user_id") REFERENCES "InstagramUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrugglesFromPosts" ADD CONSTRAINT "StrugglesFromPosts_instagram_user_id_fkey" FOREIGN KEY ("instagram_user_id") REFERENCES "InstagramUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
