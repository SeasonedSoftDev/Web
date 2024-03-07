import React from 'react';

import { PaginationMain } from 'components/ui/pagination/styles';

import { TPaginationProps } from 'components/ui/pagination/types';

const Pagination = ({ align, ...props }: TPaginationProps) => (
  <PaginationMain
    align={window.innerWidth > 600 ? 'right' : 'center'}
    variant="text"
    shape="rounded"
    {...props}
    siblingCount={window.innerWidth < 600 ? 0 : 1}
    boundaryCount={1}
  />
);

export default Pagination;
