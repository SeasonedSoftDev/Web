import React, { ReactNode } from 'react';

export type TLabelProps = React.HTMLAttributes<HTMLInputElement> & {
  helper?: string | ReactNode;
  required?: boolean;
};
