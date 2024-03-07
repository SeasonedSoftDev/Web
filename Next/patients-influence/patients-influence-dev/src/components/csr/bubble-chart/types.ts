import React from 'react';

export type TBubbleChartData = {
  values: Array<{
    x: string | number;
    y: number;
    r: number;
    userFullName: string;
    optionText: string;
  }>;
  color: string;
};

export type TBubbleChartProps = React.HTMLAttributes<HTMLDivElement> & {
  labels: Array<{ id: number; label: string }>;
  data: Array<TBubbleChartData>;
  horizontalLabel?: string;
  verticalLabel?: string;
  questionLabels?: Array<{ id: number; label: string }>;
  pickedVariable: { value: string; label: string };
};
