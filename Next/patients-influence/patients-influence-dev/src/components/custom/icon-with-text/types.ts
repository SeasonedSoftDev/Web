import React, { ReactNode } from 'react';

export type TIconWithText = React.HTMLAttributes<HTMLDivElement> & {
  icon: ReactNode;
  title: string;
  text: Array<string>;
  link?: string;
};
