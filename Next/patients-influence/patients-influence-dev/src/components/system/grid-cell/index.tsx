import React from 'react';
import { GridCellMain } from 'components/system/grid-cell/styles';
import { TGridCellProps } from 'components/system/grid-cell/types';

const GridCell = ({
  rowSpan = 1,
  columnSpan = 1,
  ...props
}: TGridCellProps) => (
  <GridCellMain rowSpan={rowSpan} columnSpan={columnSpan} {...props} />
);

export default GridCell;
