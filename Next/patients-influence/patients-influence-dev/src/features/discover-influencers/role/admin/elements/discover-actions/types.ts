import { TTableRowData } from 'components/custom/table/types';
import React from 'react';

export type TDiscoverActionsMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  data: any;
  reload: () => Promise<void>;
};
