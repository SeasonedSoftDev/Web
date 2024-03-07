-- DropForeignKey
ALTER TABLE "survey_products" DROP CONSTRAINT "survey_products_productId_fkey";

-- DropForeignKey
ALTER TABLE "survey_products" DROP CONSTRAINT "survey_products_surveyId_fkey";

-- DropForeignKey
ALTER TABLE "survey_responses" DROP CONSTRAINT "survey_responses_surveyId_fkey";

-- DropForeignKey
ALTER TABLE "survey_responses" DROP CONSTRAINT "survey_responses_surveyOptionId_fkey";

-- DropForeignKey
ALTER TABLE "survey_responses" DROP CONSTRAINT "survey_responses_surveyQuestionId_fkey";

-- AddForeignKey
ALTER TABLE "survey_products" ADD CONSTRAINT "survey_products_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_products" ADD CONSTRAINT "survey_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_surveyOptionId_fkey" FOREIGN KEY ("surveyOptionId") REFERENCES "survey_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_surveyQuestionId_fkey" FOREIGN KEY ("surveyQuestionId") REFERENCES "survey_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
