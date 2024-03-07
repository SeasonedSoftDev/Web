import React, { ReactNode } from 'react';

export type TCheckboxSize = 'small' | 'medium' | 'large';

export type TCheckboxColor =
  | 'primary'
  | 'secondary'
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export type TCheckboxProps = React.HTMLAttributes<HTMLInputElement> & {
  label?: string | ReactNode;
  size?: TCheckboxSize;
  color?: TCheckboxColor;
  value?: boolean;
  disabled?: boolean;
  onValue?: (v: boolean) => void;
  helper?: string | ReactNode;
  required?: boolean;
  name?: string;
};
