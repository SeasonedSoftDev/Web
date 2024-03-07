export type TResponseProps = {
  surveyId?: number;
  data: {
    id: number;
    optional: boolean;
    question: string;
    type: 'short' | 'paragraph' | 'multichoice' | 'multiselect';
    answers?: Array<{ id: string; value: string; isOther: boolean }>;
    usersThatResponded?: Array<{ id: number; fullName: string }>;
    hasOther?: boolean;
  };
};
