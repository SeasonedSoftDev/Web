import React from 'react';

export type TWithdrawActionsMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  data: any;
  reload: () => void;
};
