import React from 'react';

export type TPieChartProps = React.HTMLAttributes<HTMLDivElement> & {
  labels: Array<string>;
  data: Array<number>;
};
