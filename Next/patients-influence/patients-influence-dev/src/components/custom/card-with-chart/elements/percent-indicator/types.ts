import React from 'react';

export type TPercentIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
  percent: number;
  title: string;
};
