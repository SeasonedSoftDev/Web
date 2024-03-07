import { RadioProps } from '@mui/material';

export type TRadioProps = RadioProps & {
  label?: string;
  color?: TRadioColor;
  name?: string;
};

export type TRadioColor =
  | 'primary'
  | 'secondary'
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';
