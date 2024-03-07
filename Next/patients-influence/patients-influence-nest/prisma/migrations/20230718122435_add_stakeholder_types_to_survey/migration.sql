-- CreateTable
CREATE TABLE "survey_stakeholder_types" (
    "id" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "stakeholderType" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_stakeholder_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "survey_stakeholder_types_surveyId_stakeholderType_key" ON "survey_stakeholder_types"("surveyId", "stakeholderType");

-- AddForeignKey
ALTER TABLE "survey_stakeholder_types" ADD CONSTRAINT "survey_stakeholder_types_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
