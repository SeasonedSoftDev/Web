import React, { ReactNode } from 'react';

export type TChartData = {
  values: Array<number>;
  labels: Array<string>;
};

export type TCardWithoutChartProps = React.HTMLAttributes<HTMLDivElement> & {
  icon: ReactNode;
  smallIcon?: ReactNode;
  title: string;
  count: number;
  percent: number;
  chartData: TChartData;
};
