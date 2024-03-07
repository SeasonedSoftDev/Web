import React from 'react';
import { ButtonMain } from 'components/ui/button/styles';
import { TButtonProps } from 'components/ui/button/types';

const Button = ({
  size = 'medium',
  color = 'primary',
  ...props
}: TButtonProps) => <ButtonMain color={color} size={size} {...props} />;

export default Button;
