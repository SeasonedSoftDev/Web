import React from 'react';

export type TExportReportsModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  checkedReportsO: number[];
  checkedReportsR: number[];
  checkedReportsD: number[];
};
