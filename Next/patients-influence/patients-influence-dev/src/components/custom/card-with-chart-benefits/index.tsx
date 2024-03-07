import React from 'react';
import {
  CardWithChartMain,
  CardWithChartText,
  CardWithChartIcon,
  CardWithChartTitle,
  CardWithChartValues,
  CardWithChartCount,
} from 'components/custom/card-with-chart-benefits/styles';
import { TCardWithChartProps } from 'components/custom/card-with-chart-benefits/types';
import { formatNumber } from 'utilities/extended-proto';
import { NumberIndicator } from './elements';

const CardWithChartBenefits = ({
  title,
  icon,
  count,
  relativeGrowth,
  ...props
}: TCardWithChartProps) => (
  <CardWithChartMain animation="zoom-in" {...props}>
    <CardWithChartText>
      <CardWithChartIcon>{icon}</CardWithChartIcon>
      <CardWithChartTitle>{title}</CardWithChartTitle>
    </CardWithChartText>
    <CardWithChartValues>
      <CardWithChartCount>{formatNumber(count)}</CardWithChartCount>
      <NumberIndicator
        number={
          relativeGrowth ? +(+relativeGrowth).toFixed(2) : +Number(0).toFixed(2)
        }
      />
    </CardWithChartValues>
  </CardWithChartMain>
);

export default CardWithChartBenefits;
