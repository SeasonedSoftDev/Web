import React from 'react';

export type TExportSurveysModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  checkedOSurveys: number[];
  checkedIPSurveys: number[];
  checkedFSurveys: number[];
};
