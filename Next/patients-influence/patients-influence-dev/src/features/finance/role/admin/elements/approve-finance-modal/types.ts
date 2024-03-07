import React from 'react';

export type TApproveFinanceModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  type?: 'approve' | 'decline' | 'remove';
  handleAction: () => Promise<void>;
  target?: 'payment' | 'withdrawal';
  plural?: boolean;
};
