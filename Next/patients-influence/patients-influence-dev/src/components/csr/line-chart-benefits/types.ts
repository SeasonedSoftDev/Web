import React from 'react';

export type TLineChartProps = React.HTMLAttributes<HTMLDivElement> & {
  labels: Array<string>;
  data: Array<number>;
  negative: boolean;
};
