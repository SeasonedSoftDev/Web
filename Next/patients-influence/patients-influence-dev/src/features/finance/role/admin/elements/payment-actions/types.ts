import React from 'react';

export type TPaymentActionsMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  data: any;
  reload: () => void;
};
