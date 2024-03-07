import React from 'react';

export type TColor =
  | 'primary'
  | 'secondary'
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export type TStatusProps = React.HTMLAttributes<HTMLDivElement> & {
  color?: TColor;
  text: string;
};
