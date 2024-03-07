import React from 'react';

import { InpreparationCampaignMain } from 'features/inpreparation-campaign/styles';
import { CardWithText, CheckboxTable, Menu } from 'components/custom';
import { DCampaignsHead } from 'features/inpreparation-campaign/data';
import { Button } from 'components/ui';
import { Stack } from 'components/system';
import { useMenu } from 'hooks';
import {
  ContactIcon,
  DeleteIcon,
  EditIcon,
  InfoIcon,
  InviteIcon,
  ScheduleIcon,
} from 'components/svg';

const InpreparationCampaign = () => {
  const [menuA, openA, setAOpen] = useMenu(false);
  const [menuI, openI, setIOpen] = useMenu(false);

  const handleAMenu = () => {
    setAOpen(!openA);
  };

  const handleIMenu = () => {
    setIOpen(!openI);
  };

  return (
    <InpreparationCampaignMain>
      <Stack>
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
          ]}
        >
          <CheckboxTable
            head={DCampaignsHead}
            items={[]}
            renderItem={() => {}}
          />
        </CardWithText>
        <Stack direction="horizontal">
          <Button color="primary" variant="contained" onClick={handleAMenu}>
            Manage Admin Actions
          </Button>
          <Button color="primary" variant="contained" onClick={handleIMenu}>
            Manage Influencer Actions
          </Button>
        </Stack>
        {openA && (
          <Menu
            items={[
              {
                icon: <InviteIcon />,
                label: 'Invite',
                action: () => {},
              },
              {
                icon: <InfoIcon />,
                label: 'Info',
                action: () => {},
              },
              {
                icon: <ContactIcon />,
                label: 'Contact',
                action: () => {},
              },
              {
                icon: <EditIcon />,
                label: 'Note',
                action: () => {},
              },
              {
                icon: <ScheduleIcon />,
                label: 'Schedule',
                action: () => {},
              },
              {
                icon: <DeleteIcon />,
                label: 'Remove',
                action: () => {},
              },
            ]}
            ref={menuA}
          />
        )}
        {openI && (
          <Menu
            items={[
              {
                icon: <InviteIcon />,
                label: 'Invite',
                action: () => {},
              },
              {
                icon: <InfoIcon />,
                label: 'Info',
                action: () => {},
              },
              {
                icon: <EditIcon />,
                label: 'Note',
                action: () => {},
              },
              {
                icon: <DeleteIcon />,
                label: 'Remove',
                action: () => {},
              },
            ]}
            ref={menuI}
          />
        )}
      </Stack>
    </InpreparationCampaignMain>
  );
};

export default InpreparationCampaign;
