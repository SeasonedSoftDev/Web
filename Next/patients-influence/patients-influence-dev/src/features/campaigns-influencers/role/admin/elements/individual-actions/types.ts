import { IPlatformCampaignInfluencers } from 'api/platformProduct/types';
import React from 'react';

export type TDiscoverActionsMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  campaignId: number;
  data: IPlatformCampaignInfluencers;
  reload: () => Promise<void>;
};
