import React, { ReactNode } from 'react';

export type THelpCollapseProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  icon: ReactNode;
  text: Array<string>;
};
