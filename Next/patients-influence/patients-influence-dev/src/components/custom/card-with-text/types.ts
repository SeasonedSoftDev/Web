import React, { ReactNode } from 'react';

export type TCardWithTextProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> & {
  title: ReactNode;
  description?: string | React.ReactNode;
  actions?: Array<React.ReactNode>;
};
