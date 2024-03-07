import React from 'react';
import { Chart } from 'react-chartjs-2';
import { MatrixChartMain } from 'components/csr/matrix-chart/styles';
import {
  HChartDataGenerate,
  HChartOptionsGenerate,
} from 'components/csr/matrix-chart/helpers';
import { TMatrixChartProps } from 'components/csr/matrix-chart/types';

import { Chart as ChartJS, registerables } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

ChartJS.register(MatrixController, MatrixElement, ...registerables);

const MatrixChart = ({
  data,
  maxValue = 60,
  horizontalLabels,
  verticalLabels,
  ...props
}: TMatrixChartProps) => {
  const generatedData = HChartDataGenerate({
    data,
    maxValue,
  });

  const generatedOptions: any = HChartOptionsGenerate({
    data,
    horizontalLabels,
    verticalLabels,
  });

  return (
    <MatrixChartMain {...props}>
      <Chart type="matrix" data={generatedData} options={generatedOptions} />
    </MatrixChartMain>
  );
};

export default MatrixChart;
