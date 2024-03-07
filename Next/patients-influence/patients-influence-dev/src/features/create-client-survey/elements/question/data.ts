import {
  TSurveyQuestionData,
  TSurveyQuestionMultichoiceType,
  TSurveyQuestionMultiselectType,
  TSurveyQuestionParagraphType,
  TSurveyQuestionShortType,
} from 'features/create-client-survey/types';

export const DQuestionShortConstructor = (
  data: TSurveyQuestionData
): TSurveyQuestionShortType => ({
  id: data.id,
  optional: data.optional,
  type: 'short',
  question: data.question,
});
export const DQuestionParagraphConstructor = (
  data: TSurveyQuestionData
): TSurveyQuestionParagraphType => ({
  id: data.id,
  optional: data.optional,
  type: 'paragraph',
  question: data.question,
});
export const DQuestionMultichoiceConstructor = (
  data: TSurveyQuestionData
): TSurveyQuestionMultichoiceType => ({
  id: data.id,
  optional: data.optional,
  type: 'multichoice',
  answers: [],
  question: data.question,
});
export const DQuestionMultiselectConstructor = (
  data: TSurveyQuestionData
): TSurveyQuestionMultiselectType => ({
  id: data.id,
  optional: data.optional,
  type: 'multiselect',
  answers: [],
  question: data.question,
});
