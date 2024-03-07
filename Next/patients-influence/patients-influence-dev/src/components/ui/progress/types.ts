import React from 'react';

export type TProgressColor =
  | 'primary'
  | 'secondary'
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export type TProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  color?: TProgressColor;
  percent: number;
};
