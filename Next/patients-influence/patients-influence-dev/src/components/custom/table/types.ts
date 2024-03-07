import { IResult } from 'api/ambassador/types';
import React, { ReactNode } from 'react';

export type TTableHeadItem = {
  reference: string;
  label: string;
  visible: boolean;
};

export type TTableColumnData = {
  index: number;
  data: any;
};

export type TTableRowData = {
  index: number;
  data: any | IResult;
};

export type TTableRenderItemObject = {
  headItem: TTableHeadItem;
  cell: TTableColumnData;
  row: TTableRowData;
  table: Array<any>;
};

export type TTableProps = React.HTMLAttributes<HTMLDivElement> & {
  head: Array<TTableHeadItem>;
  items: Array<any>;
  renderItem: (x: TTableRenderItemObject) => any;
  emptyActions?: Array<ReactNode>;
};
