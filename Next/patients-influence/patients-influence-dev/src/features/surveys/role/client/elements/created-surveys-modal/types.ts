import React from 'react';

export type TCreateSurveysModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  id: any;
};
