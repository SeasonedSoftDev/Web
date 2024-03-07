import React from 'react';

export type TSurveyModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  data: any;
};

export type TState = {
  companyName: string;
  surveyType: string;
  startDate: string;
  endDate: string;
  amount: string;
  status: string;
};
