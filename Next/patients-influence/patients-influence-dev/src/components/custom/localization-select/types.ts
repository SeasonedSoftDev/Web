import { SelectProps } from '@mui/material';

export type TLocalizationColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export type TLocalizationOption = {
  value: string;
  label: string;
};

export type TLocalizationSelectProps = SelectProps & {
  color?: TLocalizationColor;
};
