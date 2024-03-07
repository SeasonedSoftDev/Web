import React from 'react';

import { ProgressMain } from 'components/ui/progress/styles';

import { TProgressProps } from 'components/ui/progress/types';

const Progress = ({ color = 'primary', percent, ...props }: TProgressProps) => (
  <ProgressMain color={color} percent={percent} {...props} />
);

export default Progress;
