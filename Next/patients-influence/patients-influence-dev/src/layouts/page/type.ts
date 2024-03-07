import React, { ReactNode } from 'react';

export type TPageLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};
