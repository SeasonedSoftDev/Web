import React from 'react';

import { OngoingCampaignsMain } from 'features/ongoing-campaign/styles';
import { CardWithText, CheckboxTable } from 'components/custom';
import { DCampaignsHead } from 'features/ongoing-campaign/data';
import { Button } from 'components/ui';

const OngoingCampaigns = () => (
  <OngoingCampaignsMain>
    <CardWithText
      title="Campaign Name"
      description="Influencers"
      actions={[
        <Button color="secondary" variant="contained" onClick={() => {}}>
          Back
        </Button>,
        <Button color="primary" variant="contained" onClick={() => {}}>
          Export
        </Button>,
        <Button color="primary" variant="contained" onClick={() => {}}>
          Invite
        </Button>,
      ]}
    >
      <CheckboxTable head={DCampaignsHead} items={[]} renderItem={() => {}} />
    </CardWithText>
  </OngoingCampaignsMain>
);

export default OngoingCampaigns;
