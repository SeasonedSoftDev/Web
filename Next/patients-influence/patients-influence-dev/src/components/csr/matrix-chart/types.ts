import React from 'react';

export type TMatrixChartProps = React.HTMLAttributes<HTMLDivElement> & {
  data: Array<Array<number>>;
  horizontalLabels: Array<string>;
  verticalLabels: Array<string>;
  horizontalLabel?: string;
  verticalLabel?: string;
  maxValue?: number;
};
