import React from 'react';
import {
  CardWithChartMain,
  CardWithChartText,
  CardWithChartIcon,
  CardWithChartTitle,
  CardWithChartValues,
  CardWithChartCount,
  CardWithChartGraph,
} from 'components/custom/card-with-chart/styles';
import { TCardWithChartProps } from 'components/custom/card-with-chart/types';
import { PercentIndicator } from 'components/custom/card-with-chart/elements';
import { LineChart } from 'components/csr';
import { BusinessmanIcon } from 'components/svg';
import { formatNumber } from 'utilities/extended-proto';

const CardWithChart = ({
  title,
  icon,
  smallIcon = <BusinessmanIcon />,
  count,
  percent,
  chartData,
  ...props
}: TCardWithChartProps) => (
  <CardWithChartMain animation="zoom-in" {...props}>
    <CardWithChartText>
      <CardWithChartIcon>{icon}</CardWithChartIcon>
      <CardWithChartTitle>{title}</CardWithChartTitle>
    </CardWithChartText>
    <CardWithChartValues>
      <CardWithChartCount>
        {smallIcon}
        {formatNumber(count)}
      </CardWithChartCount>
      <PercentIndicator percent={percent || 0} title={title} />
    </CardWithChartValues>
    <CardWithChartGraph>
      <LineChart
        data={chartData.values}
        labels={chartData.labels}
        negative={percent < 0}
      />
    </CardWithChartGraph>
  </CardWithChartMain>
);

export default CardWithChart;
