import React from 'react';
import { ChipWrapper } from './styles';
import { StyledChipProps } from './types';

const Chip = ({ label, type, size, ...props }: StyledChipProps) => (
  <ChipWrapper type={type} size={size}>
    {label}
  </ChipWrapper>
);

export default Chip;
