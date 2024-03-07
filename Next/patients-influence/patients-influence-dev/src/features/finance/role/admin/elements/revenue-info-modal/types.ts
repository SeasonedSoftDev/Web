import React from 'react';

export type TCreateFinanceModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
};
