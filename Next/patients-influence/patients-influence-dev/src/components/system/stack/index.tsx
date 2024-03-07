import React from 'react';
import { StackMain } from 'components/system/stack/styles';
import { TStackProps } from 'components/system/stack/types';

const Stack = ({ direction = 'vertical', ...props }: TStackProps) => (
  <StackMain direction={direction} {...props} />
);

export default Stack;
