import React from 'react';
import { Pie } from 'react-chartjs-2';
import { PieChartMain } from 'components/csr/pie-chart/styles';
import { TPieChartProps } from 'components/csr/pie-chart/types';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import Theme from 'theme';

ChartJS.register(ArcElement, Tooltip, Legend);

const generateColors = (numColors: number) => {
  const colors = [];
  const baseColors = [
    Theme.palette.primary.main,
    Theme.palette.primary.dark,
    Theme.palette.secondary.main,
  ];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numColors; i++) {
    colors.push(
      `${baseColors[i % baseColors.length]}${
        i < baseColors.length ? 'e0' : '60'
      }`
    );
  }

  return colors;
};

const PieChart = ({ labels, data, ...props }: TPieChartProps) => {
  const numColors = labels.length;
  const backgroundColors = generateColors(numColors);
  const generatedData: ChartData<'pie'> = {
    labels,
    datasets: [
      {
        label: 'Count',
        data,
        backgroundColor: backgroundColors,
        borderColor: 'transparent',
        hoverOffset: 4,
      },
    ],
  };

  const PieChartOptions: ChartOptions<'pie'> = {
    resizeDelay: 0,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        align: 'end',
      },
      legend: {
        display: true,
        fullSize: true,
        position: 'right',
        align: 'center',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            lineHeight: 16,
            size: 14,
            family: `${Theme.typography.fontFamily}`,
          },
        },
      },
    },
  };

  return (
    <PieChartMain {...props}>
      <Pie data={generatedData} options={PieChartOptions} />
    </PieChartMain>
  );
};

export default PieChart;
