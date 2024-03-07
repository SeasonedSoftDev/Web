-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_surveyQuestionId_fkey" FOREIGN KEY ("surveyQuestionId") REFERENCES "survey_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
