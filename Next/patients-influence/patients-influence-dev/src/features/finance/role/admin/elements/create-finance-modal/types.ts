import React from 'react';

export type TCreateFinanceModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  reloadC?: () => Promise<void>;
  reloadP?: () => Promise<void>;
  reloadC1?: () => Promise<void>;
  reloadR?: () => Promise<void>;
};
