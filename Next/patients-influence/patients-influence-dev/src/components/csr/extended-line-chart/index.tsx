import React from 'react';
import { Line } from 'react-chartjs-2';
import { ExtendedLineChartMain } from 'components/csr/extended-line-chart/styles';
import {
  HChartDataGenerate,
  HChartOptionsGenerate,
} from 'components/csr/extended-line-chart/helpers';
import { TExtendedLineChartProps } from 'components/csr/extended-line-chart/types';

const ExtendedLineChart = ({
  labels,
  data,
  horizontalLabel,
  verticalLabel,
  ...props
}: TExtendedLineChartProps) => {
  const generatedData = HChartDataGenerate({
    labels,
    data,
  });

  const generatedOptions: any = HChartOptionsGenerate({
    horizontalLabel,
    verticalLabel,
  });

  return (
    <ExtendedLineChartMain {...props}>
      <Line data={generatedData} options={generatedOptions} />
    </ExtendedLineChartMain>
  );
};

export default ExtendedLineChart;
