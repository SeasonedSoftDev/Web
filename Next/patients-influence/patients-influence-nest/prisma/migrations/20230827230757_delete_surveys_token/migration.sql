-- DropForeignKey
ALTER TABLE "client_survey_token_balances" DROP CONSTRAINT "client_survey_token_balances_surveyId_fkey";

-- AddForeignKey
ALTER TABLE "client_survey_token_balances" ADD CONSTRAINT "client_survey_token_balances_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
