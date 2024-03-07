-- DropForeignKey
ALTER TABLE "notification_payloads" DROP CONSTRAINT "notification_payloads_surveyId_fkey";

-- DropForeignKey
ALTER TABLE "survey_example_images" DROP CONSTRAINT "survey_example_images_surveyId_fkey";

-- AddForeignKey
ALTER TABLE "survey_example_images" ADD CONSTRAINT "survey_example_images_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_payloads" ADD CONSTRAINT "notification_payloads_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
