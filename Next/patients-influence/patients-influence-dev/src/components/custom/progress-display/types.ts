import React, { ReactNode } from 'react';
import { TColor } from '../status/types';

export type TProgressDisplayProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string | ReactNode;
  percent: number;
  color?: TColor;
  tooltip?: boolean;
};
