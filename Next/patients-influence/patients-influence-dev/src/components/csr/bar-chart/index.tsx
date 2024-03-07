import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { BarChartMain, Overlay } from 'components/csr/bar-chart/styles';
import {
  HChartDataGenerate,
  HChartOptionsGenerate,
} from 'components/csr/bar-chart/helpers';
import { TBarChartProps } from 'components/csr/bar-chart/types';

const BarChart = ({
  labels,
  data,
  horizontalLabel,
  verticalLabel,
  isChartDisabled = true,
  ...props
}: TBarChartProps) => {
  const generatedData = HChartDataGenerate({
    labels,
    data,
  });

  const generatedOptions: any = HChartOptionsGenerate({
    horizontalLabel,
    verticalLabel,
    labels,
  });
  generatedOptions.responsive = true;
  generatedOptions.maintainAspectRatio = false;
  return (
    <BarChartMain {...props}>
      {isChartDisabled && (
        <Overlay>
          <span>Data Gathering In Progress</span>
        </Overlay>
      )}
      <Bar height={50} data={generatedData} options={generatedOptions} />
    </BarChartMain>
  );
};

export default BarChart;
