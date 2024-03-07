import React from 'react';

export type TGridCellProps = React.HTMLAttributes<HTMLDivElement> & {
  rowSpan?: number;
  columnSpan?: number;
};
