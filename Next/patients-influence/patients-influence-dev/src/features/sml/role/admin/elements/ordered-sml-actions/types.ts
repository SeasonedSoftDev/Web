import React from 'react';

export type TOrderedActionsMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  data: any;
  refresh: () => void;
};
