import React from 'react';

export type TExportSmlModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  checkedSMLO: number[];
  checkedSMLR: number[];
  checkedSMLD: number[];
};
