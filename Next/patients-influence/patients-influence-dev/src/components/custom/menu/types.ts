import React, { ReactNode } from 'react';

export type TMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  items: Array<{
    icon?: ReactNode | string;
    label: string;
    action: () => void;
  }>;
};

export type TMenuRef = HTMLDivElement;
