export type TResponseProps = {
  data: {
    id: number;
    credit: number;
    optional: boolean;
    question: string;
    type: 'short' | 'paragraph' | 'multichoice' | 'multiselect';
    answers: Array<{ id: string; value: string; isOther: boolean }>;
    usersThatResponded?: Array<{ id: number; fullName: string }>;
    hasOther?: boolean;
  };

  surveyId?: number;
};
