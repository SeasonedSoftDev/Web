import React, { ReactNode } from 'react';

export type TSwitchColor =
  | 'primary'
  | 'secondary'
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export type TSwitchProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: boolean;
  onValue?: (v: boolean) => void;
  label?: string;
  color?: TSwitchColor;
  required?: boolean;
  helper?: string | ReactNode;
};
