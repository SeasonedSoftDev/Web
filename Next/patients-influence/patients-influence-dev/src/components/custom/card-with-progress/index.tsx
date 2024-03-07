import React from 'react';
import {
  CardWithProgressMain,
  CardWithProgressText,
  CardWithProgressIcon,
  CardWithProgressTitle,
  CardWithProgressValues,
} from 'components/custom/card-with-progress/styles';
import { TCardWithProgressProps } from 'components/custom/card-with-progress/types';
import { ProgressDisplay } from 'components/custom/card-with-progress/elements';

const CardWithProgress = ({
  title,
  icon,
  progressData,
  ...props
}: TCardWithProgressProps) => (
  <CardWithProgressMain animation="zoom-in" {...props}>
    <CardWithProgressText>
      <CardWithProgressIcon>{icon}</CardWithProgressIcon>
      <CardWithProgressTitle>{title}</CardWithProgressTitle>
    </CardWithProgressText>
    <CardWithProgressValues>
      {progressData.map((x, index) => (
        <ProgressDisplay
          // eslint-disable-next-line react/no-array-index-key
          key={`${index}${title}`}
          title={x.title}
          icon={x.icon}
          percent={x.percent}
        />
      ))}
    </CardWithProgressValues>
  </CardWithProgressMain>
);

export default CardWithProgress;
