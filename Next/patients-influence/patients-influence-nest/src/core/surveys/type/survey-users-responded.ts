import { SurveyQuestion } from '@prisma/client';

export interface IExtendedSurveyQuestion extends SurveyQuestion {
  usersThatResponded?: number[];
}
