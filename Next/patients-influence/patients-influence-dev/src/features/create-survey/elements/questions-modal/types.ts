import React from 'react';

export type TQuestionsModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  firstName: string;
  lastName: string;
  questions: any;
};
