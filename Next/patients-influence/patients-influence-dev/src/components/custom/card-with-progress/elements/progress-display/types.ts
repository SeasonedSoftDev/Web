import React, { ReactNode } from 'react';

export type TProgressDisplayProps = React.HTMLAttributes<HTMLDivElement> & {
  icon: ReactNode | string | number;
  percent: number;
  title: string;
};
