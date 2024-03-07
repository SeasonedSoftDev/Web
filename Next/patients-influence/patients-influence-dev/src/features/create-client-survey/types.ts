export type TSurveyQuestionType =
  | 'short'
  | 'paragraph'
  | 'multichoice'
  | 'multiselect';

export type TSurveyQuestionBaseType = {
  id: number;
  optional: boolean;
  question: string;
};

export type TSurveyQuestionShortType = TSurveyQuestionBaseType & {
  type: 'short';
};

export type TSurveyQuestionParagraphType = TSurveyQuestionBaseType & {
  type: 'paragraph';
};

export type TSurveyQuestionMultichoiceType = TSurveyQuestionBaseType & {
  type: 'multichoice';
  usersThatResponded?: IUsersThatResponded[];
  answers: Array<{
    id: string;
    value: string;
    isOther: boolean;
  }>;
};

export type TSurveyQuestionMultiselectType = TSurveyQuestionBaseType & {
  type: 'multiselect';
  usersThatResponded?: IUsersThatResponded[];
  answers: Array<{
    id: string;
    value: string;
    isOther: boolean;
  }>;
};

export interface IUsersThatResponded {
  id: number;
  fullName: string;
}

export type TSurveyQuestionData =
  | TSurveyQuestionShortType
  | TSurveyQuestionParagraphType
  | TSurveyQuestionMultichoiceType
  | TSurveyQuestionMultiselectType;

export type TSurveyQuestionUpdateData =
  | Partial<TSurveyQuestionShortType>
  | Partial<TSurveyQuestionParagraphType>
  | Partial<TSurveyQuestionMultichoiceType>
  | Partial<TSurveyQuestionMultiselectType>;
