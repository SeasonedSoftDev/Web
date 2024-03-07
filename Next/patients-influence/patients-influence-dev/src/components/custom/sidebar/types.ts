import React, { ReactNode } from 'react';

export type TSidebarSubItem = {
  id: number | string;
  label: string;
  location: string;
};

export type TSidebarItem =
  | {
      id: number | string;
      type: 'route';
      label: string;
      icon: ReactNode;
      location: string;
      influencerStatus?: number[];
      roles: Array<string>;
    }
  | {
      id: number | string;
      type: 'nested';
      label: string;
      icon: ReactNode;
      roles: Array<string>;
      items: Array<TSidebarSubItem>;
    };

export type TSidebarProps = React.HTMLAttributes<HTMLDivElement>;
