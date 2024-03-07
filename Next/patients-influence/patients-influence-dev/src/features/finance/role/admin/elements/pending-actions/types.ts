import React from 'react';

export type TPendingActionsMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  data: any;
  reload: () => void;
};
