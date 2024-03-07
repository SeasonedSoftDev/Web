import React from 'react';

export type TDeleteSurveyModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  id: any;
  reload: () => void;
};
