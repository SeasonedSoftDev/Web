import React from 'react';
import {
  ProgressDisplayMain,
  ProgressDisplayLabel,
} from 'components/custom/progress-display/styles';
import { TProgressDisplayProps } from 'components/custom/progress-display/types';
import { Tooltip } from '@mui/material';

const ProgressDisplay = ({
  label,
  percent,
  color = 'primary',
  tooltip = false,
  ...props
}: TProgressDisplayProps) => (
  <Tooltip title={label}>
    <ProgressDisplayMain color={color} percent={percent} {...props}>
      <ProgressDisplayLabel>{!tooltip ? label : ''}</ProgressDisplayLabel>
    </ProgressDisplayMain>
  </Tooltip>
);

export default ProgressDisplay;
