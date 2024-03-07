-- DropForeignKey
ALTER TABLE "survey_responses" DROP CONSTRAINT "survey_responses_userId_fkey";

-- AddForeignKey
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
