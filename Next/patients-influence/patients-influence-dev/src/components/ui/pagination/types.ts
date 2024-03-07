import { PaginationProps } from '@mui/material';

export type TPaginationAlign = 'left' | 'center' | 'right';

export type TPaginationProps = PaginationProps & {
  align?: TPaginationAlign;
};
