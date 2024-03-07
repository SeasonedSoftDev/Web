import React from 'react';
import {
  CardWithoutChartMain,
  CardWithoutChartText,
  CardWithoutChartIconProps,
  CardWithoutChartTitle,
  CardWithoutChartValues,
  CardWithoutChartCount,
} from 'components/custom/card-without-chart/styles';
import { TCardWithoutChartProps } from 'components/custom/card-without-chart/types';
import { Indicator } from 'components/custom/card-without-chart/elements';
import { formatNumber } from 'utilities/extended-proto';

const CardWithoutChart = ({
  title,
  icon,
  count,
  percent,
  ...props
}: TCardWithoutChartProps) => (
  <CardWithoutChartMain
    animation="zoom-in"
    {...props}
    style={{ width: '150px' }}
  >
    <CardWithoutChartText>
      <CardWithoutChartIconProps>{icon}</CardWithoutChartIconProps>
      <CardWithoutChartTitle>{title}</CardWithoutChartTitle>
    </CardWithoutChartText>
    <CardWithoutChartValues>
      <CardWithoutChartCount>{formatNumber(count)}</CardWithoutChartCount>
      <Indicator percent={percent} />
    </CardWithoutChartValues>
  </CardWithoutChartMain>
);

export default CardWithoutChart;
