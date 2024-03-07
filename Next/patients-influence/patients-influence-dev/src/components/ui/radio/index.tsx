import React from 'react';

import {
  RadioMain,
  RadioButtonEl,
  RadioLabel,
} from 'components/ui/radio/styles';
import { TRadioProps } from 'components/ui/radio/types';

const RadioButton = ({
  color = 'secondary',
  label,
  name,
  ...props
}: TRadioProps) => (
  <RadioMain>
    <RadioButtonEl color={color} size="medium" name={name} {...props} />
    <RadioLabel>{label}</RadioLabel>
  </RadioMain>
);

export default RadioButton;
