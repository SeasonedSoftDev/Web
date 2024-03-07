import { TabProps } from '@mui/material';

export type TTabsProps = TabProps & {
  tabs: Array<string>;
  value: number;
  onValue: (v: number) => void;
};
