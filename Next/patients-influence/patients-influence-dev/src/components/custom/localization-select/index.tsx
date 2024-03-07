import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  SLocalizationSelectMain,
  SLocalizationSelectOption,
} from 'components/custom/localization-select/styles';
import { TLocalizationSelectProps } from 'components/custom/localization-select/types';
import { DLocalizationOptions } from 'components/custom/localization-select/data';
import { SelectChangeEvent } from '@mui/material';

const LocalizationSelect = ({
  color = 'secondary',
  ...props
}: TLocalizationSelectProps) => {
  const { push, locale, asPath } = useRouter();
  const [value, setValue] = useState(locale);

  const handleValue = (e: SelectChangeEvent<any>) => {
    const v = e.target.value;
    setValue(v);
    push(asPath, undefined, { locale: v });
  };

  return (
    <SLocalizationSelectMain
      value={value}
      onChange={handleValue}
      color={color}
      {...props}
    >
      {DLocalizationOptions.map((x) => (
        <SLocalizationSelectOption value={x.value} key={x.value}>
          {x.label}
        </SLocalizationSelectOption>
      ))}
    </SLocalizationSelectMain>
  );
};

export default LocalizationSelect;
