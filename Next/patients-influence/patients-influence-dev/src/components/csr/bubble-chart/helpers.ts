import { Tick } from 'chart.js';
import { TBubbleChartData } from 'components/csr/bubble-chart/types';

export const HChartDataGenerate = ({
  labels,
  data,
}: {
  labels: Array<{ id: number; label: string }>;
  data: Array<TBubbleChartData>;
}) => ({
  labels: labels.map((item) => item.id),
  datasets: data.map((x) => ({
    label: 'Value',
    data: x.values.map((val) => ({ ...val })),
    step: 1,
    fill: 'start',
    backgroundColor: `${x.color}9c`,
    borderRadius: 4,
    borderSkipped: false,
  })),
});

export const HChartOptionsGenerate = ({
  horizontalLabel,
  verticalLabel,
  data,
  labels,
  pickedVariable,
}: {
  horizontalLabel?: string;
  verticalLabel?: string;
  data: Array<TBubbleChartData>;
  labels: Array<{ id: number; label: string }>;
  pickedVariable: { label: string; value: string };
}) => ({
  resizeDelay: 0,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        title: (context: any) => context[0].raw.optionText,
        label: (context: any) => {
          let focusedData = context.raw.y;
          if (pickedVariable.value === 'ethnicity') {
            switch (context.raw.y) {
              case 1:
                focusedData = 'Asian';
                break;
              case 2:
                focusedData = 'White';
                break;
              case 3:
                focusedData = 'Middle eastern';
                break;
              case 4:
                focusedData = 'Indian';
                break;
              case 5:
                focusedData = 'Latino';
                break;
              case 6:
                focusedData = 'Black';
                break;
              default:
                focusedData = 'Other';
            }
          }

          if (pickedVariable.value === 'gender') {
            switch (context.raw.y) {
              case 0:
                focusedData = 'Male';
                break;
              case 1:
                focusedData = 'Female';
                break;
              default:
                focusedData = 'Other';
            }
          }
          return `${context.raw.userFullName} (${focusedData})`;
        },
      },
    },
  },
  layout: {
    padding: {
      left: 10,
      bottom: 10,
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
      beginAtZero: false,
      offset: true,
      ticks: {
        stepSize: 1,

        callback: (value: any, index: number, ticks: Tick[]) => {
          const labelMappings = labels.reduce((acc: any, label) => {
            acc[label.id] = label.label;
            return acc;
          }, {});

          const isValueInsideData = data[0].values.find(
            (something) => something.x === value
          );

          if (labelMappings[value] && isValueInsideData) {
            return labelMappings[value];
          }

          return '';

          // Find the matching label based on the tick value
          // eslint-disable-next-line no-restricted-syntax
          // for (const dataset of data) {
          //   const labelMatch = labels.find(
          //     (label) => label.id === dataset.values[0]?.x
          //   );
          //   if (labelMatch) {
          //     return labelMatch.label;
          //   }
          // }
          // return ''; // Fallback to an empty string if no match is found
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
      beginAtZero: true,
      offset: true,
    },
  },
});
