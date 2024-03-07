import React from 'react';

export type TOrderedActionsMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  data: any;
  refreshInfluencers: () => void;
};
