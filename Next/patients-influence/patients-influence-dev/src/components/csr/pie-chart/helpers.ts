import Theme from 'theme';

export const HChartDataGenerate = ({
  labels,
  data,
}: {
  labels: Array<string>;
  data: Array<number>;
}) => ({
  labels,
  datasets: [
    {
      label: 'Count',
      data,
      backgroundColor: [
        `${Theme.palette.primary.main}e0`,
        `${Theme.palette.primary.dark}a0`,
        `${Theme.palette.primary.dark}60`,
        `${Theme.palette.secondary.main}e0`,
      ],
      borderColor: 'transparent',
      hoverOffset: 4,
    },
  ],
});
