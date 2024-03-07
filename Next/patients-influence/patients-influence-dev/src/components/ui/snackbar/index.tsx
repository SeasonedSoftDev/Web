import React, { forwardRef } from 'react';
import { SnackbarMain, SnackbarElement } from 'components/ui/snackbar/styles';
import { TSnackbarProps } from 'components/ui/snackbar/types';

const Snackbar = forwardRef<HTMLDivElement, TSnackbarProps>(
  ({ message, variant = 'info', ...props }, ref) => (
    <SnackbarMain ref={ref} {...props}>
      <SnackbarElement severity={variant}>{message}</SnackbarElement>
    </SnackbarMain>
  )
);

export default Snackbar;
