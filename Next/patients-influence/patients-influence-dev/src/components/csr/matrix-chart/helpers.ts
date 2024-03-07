import { alpha } from '@mui/material';
import Theme from 'theme';

const HGenerateMatrix = (matrix: Array<Array<number>>) => {
  const ret = [];
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j < matrix[i].length; j += 1) {
      ret.push({ x: j + 1, y: i + 1, v: matrix[i][j] });
    }
  }
  return ret;
};

export const HChartDataGenerate = ({
  data,
  maxValue = 60,
}: {
  data: Array<Array<number>>;
  maxValue: number;
}) => {
  const generated = HGenerateMatrix(data);

  return {
    datasets: [
      {
        label: 'Value',
        data: generated,
        borderWidth: 1,
        borderColor: '#00000000',
        backgroundColor: (ctx: any) => {
          const value = ctx.dataset.data[ctx.dataIndex].v;
          const alphaValue = (10 + value) / maxValue;
          return alpha(Theme.palette.primary.main, alphaValue);
        },
        borderRadius: 4,
        width: ({ chart }: any) =>
          (chart.chartArea || {}).width / data[0].length - 4,
        height: ({ chart }: any) =>
          (chart.chartArea || {}).height / data.length - 4,
      },
    ],
  };
};

export const HChartOptionsGenerate = ({
  data,
  horizontalLabels,
  verticalLabels,
}: {
  data: Array<Array<number>>;
  horizontalLabels: Array<string>;
  verticalLabels: Array<string>;
}) => ({
  resizeDelay: 0,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  layout: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      min: 0.5,
      max: data[0].length + 0.5,
      offset: false,
      grid: {
        display: false,
      },
      ticks: {
        offset: true,
        stepSize: 0.5,
        autoSkip: false,
        callback: (_v: any, index: number) => {
          const x = index / 2 - 0.5;
          if (x % 1 !== 0) return null;
          return horizontalLabels[x];
        },
      },
    },
    y: {
      min: 0.5,
      max: data.length + 0.5,
      offset: false,
      labelOffset: -5,
      grid: {
        display: false,
      },
      ticks: {
        autoSkip: false,
        // maxRotation: 90,
        // minRotation: 90,
        stepSize: 0.5,
        callback: (_v: any, index: number) => {
          const x = index / 2 - 0.5;
          if (x % 1 !== 0) return null;
          return verticalLabels[x];
        },
      },
    },
  },
});
