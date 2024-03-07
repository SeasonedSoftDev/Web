import React, { ReactNode } from 'react';
import { TSidebarSubItem } from 'components/custom/sidebar/types';

export type TSidebarItemNestedProps = React.HTMLAttributes<HTMLDivElement> & {
  icon: ReactNode;
  label: string;
  items: Array<TSidebarSubItem>;
  item: any;
  action: () => void;
};
