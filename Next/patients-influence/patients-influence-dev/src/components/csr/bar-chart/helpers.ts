import { TBarChartData } from 'components/csr/bar-chart/types';

export const HChartDataGenerate = ({
  labels,
  data,
}: {
  labels: Array<string>;
  data: Array<TBarChartData>;
}) => ({
  labels,
  datasets: data.map((x) => ({
    label: 'Count',
    data: x.values,
    fill: 'start',
    backgroundColor: x.color,
    // hoverBackgroundColor: `${Theme.palette.primary.main}c0`,
    borderRadius: 4,
    borderWidth: 1,
    barThickness: 20,
    barPercentage: 0.7,
    categoryPercentage: 0.7,
    borderSkipped: false,
    subLabel: x.subLabel,
  })),
});

export const HChartOptionsGenerate = ({
  horizontalLabel,
  verticalLabel,
  labels,
}: {
  horizontalLabel?: string;
  verticalLabel?: string;
  labels?: string[];
}) => ({
  resizeDelay: 0,
  responsive: true,
  indexAxis: 'x',
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        title: (context: any) =>
          `${context[0].label} ${
            context[0].dataset.subLabel
              ? `(${context[0].dataset.subLabel})`
              : ''
          }`,
      },
    },
  },
  layout: {
    padding: {
      left: verticalLabel ? 0 : -10,
      bottom: horizontalLabel ? 0 : 'auto',
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      title: {
        display: !!horizontalLabel,
        text: horizontalLabel,
      },
      ticks: {
        callback: (value: number) => {
          if (labels && labels[value] && labels[value].length > 10) {
            return `${labels[value].substring(0, 10)}...`; // Truncate and add ellipsis
          }
          return labels ? labels[value] : '';
        },
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
      title: {
        display: !!verticalLabel,
        text: verticalLabel,
      },
    },
  },
});
