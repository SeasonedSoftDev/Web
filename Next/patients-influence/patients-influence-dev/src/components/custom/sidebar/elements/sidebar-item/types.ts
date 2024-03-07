import React, { ReactNode } from 'react';

export type TSidebarItemProps = React.HTMLAttributes<HTMLDivElement> & {
  icon: ReactNode;
  label: string;
  location: string;
};
