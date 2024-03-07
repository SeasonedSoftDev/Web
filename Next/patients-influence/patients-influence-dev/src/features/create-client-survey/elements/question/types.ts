import { ISingleSurveyResponse } from 'api/survey/types';
import {
  TSurveyQuestionData,
  TSurveyQuestionType,
} from 'features/create-client-survey/types';

export type TQuestionProps = {
  surveyId: number;
  survey: ISingleSurveyResponse;
  question: TSurveyQuestionData;
  questionId: number;
  isDisabled: boolean;
  remove: (id: string) => void;
  copy: (id: string) => void;
  changeType: (value: TSurveyQuestionType) => void;
  updateQuestion: (question: Partial<TSurveyQuestionData>) => void;
};
