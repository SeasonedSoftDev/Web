import React from 'react';

export type TPromptRevenueModalProps = React.HTMLAttributes<HTMLDivElement> & {
  onClose: () => void;
  type?: 'receive';
  handleAction: () => Promise<void>;
  target?: 'revenue';
  plural?: boolean;
};
