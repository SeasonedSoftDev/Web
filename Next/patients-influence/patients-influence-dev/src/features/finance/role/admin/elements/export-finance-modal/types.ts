import React from 'react';

export type TExportFinanceModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  checkedPending: number[];
  checkedPayments: number[];
  checkedWithdraws: number[];
  checkedRevenues: number[];
};
