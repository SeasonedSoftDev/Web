import React from 'react';
import { Bubble } from 'react-chartjs-2';
import { BubbleChartMain } from 'components/csr/bubble-chart/styles';
import {
  HChartDataGenerate,
  HChartOptionsGenerate,
} from 'components/csr/bubble-chart/helpers';
import { TBubbleChartProps } from 'components/csr/bubble-chart/types';

const BubbleChart = ({
  labels,
  data,
  horizontalLabel,
  verticalLabel,
  questionLabels,
  pickedVariable,
  ...props
}: TBubbleChartProps) => {
  const generatedData = HChartDataGenerate({
    labels,
    data,
  });
  const generatedOptions: any = HChartOptionsGenerate({
    horizontalLabel,
    verticalLabel,
    data,
    labels,
    pickedVariable,
  });
  return (
    <BubbleChartMain {...props}>
      <Bubble height={50} data={generatedData} options={generatedOptions} />
    </BubbleChartMain>
  );
};

export default BubbleChart;
