import { Avatar } from 'components/ui';
import React from 'react';

import {
  CampaignsCardMain,
  CampaignsCardInfo,
  CampaignsCardCompany,
  CampaignsCardApp,
} from 'components/custom/campaigns-card/styles';

import { TCampaignsCardProps } from 'components/custom/campaigns-card/types';

const CampaignsCard = ({
  company,
  app,
  image,
  ...props
}: TCampaignsCardProps) => (
  <CampaignsCardMain {...props}>
    {/* <Avatar image={image} /> */}
    <CampaignsCardInfo>
      <CampaignsCardCompany>{company}</CampaignsCardCompany>
      <CampaignsCardApp>{app}</CampaignsCardApp>
    </CampaignsCardInfo>
  </CampaignsCardMain>
);

export default CampaignsCard;
