import React from 'react';
import { StatusMain } from 'components/custom/status/styles';
import { TStatusProps } from 'components/custom/status/types';

const Status = ({ color = 'primary', text, ...props }: TStatusProps) => (
  <StatusMain color={color} {...props}>
    {text}
  </StatusMain>
);

export default Status;
