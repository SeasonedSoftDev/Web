import React from 'react';
import { Line } from 'react-chartjs-2';
import { LineChartMain } from 'components/csr/line-chart/styles';
import { DChartOptions } from 'components/csr/line-chart/data';
import { HChartDataGenerate } from 'components/csr/line-chart/helpers';
import { TLineChartProps } from 'components/csr/line-chart/types';

const LineChart = ({ labels, data, negative, ...props }: TLineChartProps) => {
  const generatedData = HChartDataGenerate({
    labels,
    data,
    negative,
  });

  return (
    <LineChartMain {...props}>
      <Line height={50} data={generatedData} options={DChartOptions} />
    </LineChartMain>
  );
};

export default LineChart;
