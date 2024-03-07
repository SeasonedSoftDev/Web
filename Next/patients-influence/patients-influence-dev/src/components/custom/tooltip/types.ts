import { TooltipProps } from '@mui/material';
import React, { ReactNode } from 'react';

export type TTooltipProps = TooltipProps & {
  title: ReactNode;
};
