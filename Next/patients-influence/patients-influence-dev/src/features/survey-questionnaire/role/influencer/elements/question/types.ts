import { TSurveyQuestionData } from 'features/create-client-survey/types';
import {
  IQuestionAnswers,
  ISelectedCheckboxGroups,
  ISelectedRadioGroups,
} from '../..';

export type TQuestionProps = {
  question: TSurveyQuestionData;
  questionIdx: number;
  isDisabled: boolean;
  handleCheckboxChange: (questionId: number, selectedOptionId: number) => void;
  handleRadioChange: (questionId: number, selectedOptionId: number) => void;
  handleTextFieldsChange: (questionId: number, inputValue: string) => void;
  selectedRadioGroups: ISelectedRadioGroups;
  selectedCheckBoxGroups: ISelectedCheckboxGroups;
  questionAnswerResults: IQuestionAnswers[];
};
