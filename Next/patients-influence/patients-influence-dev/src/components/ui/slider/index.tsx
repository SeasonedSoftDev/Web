import React, { useState } from 'react';

import { SliderMain } from 'components/ui/slider/styles';
import { TSliderProps } from 'components/ui/slider/types';

const Slider = ({ ...props }: TSliderProps) => {
  const [defaultValue, setValue] = useState(0);

  return (
    <SliderMain
      {...props}
      defaultValue={defaultValue}
      aria-label="default"
      color="primary"
      onChange={(value) => setValue(defaultValue)}
    />
  );
};

export default Slider;
