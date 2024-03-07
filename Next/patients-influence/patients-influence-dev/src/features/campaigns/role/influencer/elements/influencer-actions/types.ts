import React from 'react';
import { IProductOrderCampaing } from '../../types';

export type THomeActionsMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  data: IProductOrderCampaing;
  reload: () => Promise<void>;
};
