import React from 'react';

export type THomeActionsMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  data: any;
  reload: () => Promise<void>;
};
