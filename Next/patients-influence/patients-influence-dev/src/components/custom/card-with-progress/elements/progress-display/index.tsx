import React from 'react';
import {
  ProgressDisplayMain,
  ProgressDisplayIcon,
  ProgressDisplayPercent,
  ProgressDisplayPercentNumber,
} from 'components/custom/card-with-progress/elements/progress-display/styles';
import { TProgressDisplayProps } from 'components/custom/card-with-progress/elements/progress-display/types';
import { Tooltip } from '@mui/material';

const ProgressDisplay = ({
  title,
  icon,
  percent,
  ...props
}: TProgressDisplayProps) => (
  <ProgressDisplayMain {...props}>
    <Tooltip title={title}>
      <ProgressDisplayIcon>{icon}</ProgressDisplayIcon>
    </Tooltip>
    <ProgressDisplayPercent percent={percent} />
    <ProgressDisplayPercentNumber>{`${percent}%`}</ProgressDisplayPercentNumber>
  </ProgressDisplayMain>
);

export default ProgressDisplay;
