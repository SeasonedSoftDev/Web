// eslint-disable-next-line import/no-unresolved
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
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
  data: any;
};

export type TTableRenderItemObject = {
  headItem: TTableHeadItem;
  cell: TTableColumnData;
  row: TTableRowData;
  table: Array<any>;
};

export type MenuAction = {
  icon: ReactJSXElement;
  label: string;
  action: () => void;
};

export type TTableProps = React.HTMLAttributes<HTMLDivElement> & {
  head: Array<TTableHeadItem>;
  items: Array<any>;
  renderItem: (x: TTableRenderItemObject) => any;
  checkedRows?: number[];
  onSingleSelect?: (rowId: number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  tableColModal: boolean;
  closeTableColModal?: any;
  renderElements?: ReactNode;
  optionalRole?: 'CLIENT' | 'INFLUENCER';
};
