import dynamic from 'next/dynamic';

export const LineChart = dynamic(() => import('components/csr/line-chart'), {
  ssr: false,
});

export const LineChartBenefits = dynamic(
  () => import('components/csr/line-chart-benefits'),
  {
    ssr: false,
  }
);

export const BarChart = dynamic(() => import('components/csr/bar-chart'), {
  ssr: false,
});

export const MatrixChart = dynamic(
  () => import('components/csr/matrix-chart'),
  {
    ssr: false,
  }
);

export const ExtendedLineChart = dynamic(
  () => import('components/csr/extended-line-chart'),
  {
    ssr: false,
  }
);

export const PieChart = dynamic(() => import('components/csr/pie-chart'), {
  ssr: false,
});

export const BubbleChart = dynamic(
  () => import('components/csr/bubble-chart'),
  {
    ssr: false,
  }
);
