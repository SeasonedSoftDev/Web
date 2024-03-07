export const DChartOptions = {
  resizeDelay: 0,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  layout: {
    padding: {
      left: -10,
      bottom: -10,
    },
  },
  elements: {
    line: {
      tension: 0.25,
      borderWidth: 1,
    },
    point: {
      radius: 0,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
      border: {
        display: false,
      },
    },
  },
};
