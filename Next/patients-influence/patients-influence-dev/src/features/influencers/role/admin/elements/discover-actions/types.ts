import React from 'react';

export type TDiscoverActionsMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  dataId: number;
  reload: () => Promise<void>;
};
