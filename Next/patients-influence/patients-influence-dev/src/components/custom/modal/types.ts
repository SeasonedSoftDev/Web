import React, { ReactNode } from 'react';

export type TModalSize = 'small' | 'medium' | 'large';

export type TModalProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> & {
  onClose?: () => void;
  title?: ReactNode;
  size?: TModalSize;
  actions?: Array<ReactNode>;
};
