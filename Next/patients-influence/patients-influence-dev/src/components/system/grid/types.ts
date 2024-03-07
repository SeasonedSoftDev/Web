import React from 'react';

export type TGridProps = React.HTMLAttributes<HTMLDivElement> & {
  rows?: number;
  columns?: number;
};
