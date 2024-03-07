import React, { useState } from 'react';
import { FinishedReportMain } from 'features/manage-report/styles';
import { Button, Pagination } from 'components/ui';
import { CardWithText, CheckboxTable, Menu, Tabs } from 'components/custom';
import { useRouter } from 'next/router';
import { Stack } from 'components/system';
import { useMenu } from 'hooks';
import { DeleteIcon, InviteIcon } from 'components/svg';

const ManageReportPage = ({ id, ...props }: { id: string }) => {
  const router = useRouter();

  const [menu, open, setOpen] = useMenu(false);

  const [tabs, setTabs] = useState(0);

  const handleMenu = () => {
    setOpen(!open);
  };

  return (
    <FinishedReportMain {...props}>
      <CardWithText
        title="Campaign Name"
        description="Influencers"
        actions={[
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            onClick={() => router.push('/campaigns')}
          >
            Back
          </Button>,
        ]}
      >
        <Stack>
          <Tabs
            tabs={['Added', 'Invited', 'Matching', 'To Be Submitted']}
            value={tabs}
            onValue={setTabs}
          />
          {tabs === 0 && (
            <Stack>
              <CheckboxTable
                head={[
                  {
                    reference: 'username',
                    label: 'Username',
                    visible: true,
                  },
                  {
                    reference: 'diseaseArea',
                    label: 'Disease Area',
                    visible: true,
                  },
                  {
                    reference: 'location',
                    label: 'Location',
                    visible: true,
                  },
                  {
                    reference: 'age',
                    label: 'Age',
                    visible: true,
                  },
                  {
                    reference: 'gender',
                    label: 'Gender',
                    visible: true,
                  },
                  {
                    reference: 'ethnicity',
                    label: 'Ethnicity',
                    visible: false,
                  },
                  {
                    reference: 'brands',
                    label: 'Brands',
                    visible: false,
                  },
                  {
                    reference: 'products',
                    label: 'Products',
                    visible: false,
                  },
                  {
                    reference: 'interests',
                    label: 'Interests',
                    visible: false,
                  },
                  {
                    reference: 'struggles',
                    label: 'Struggles',
                    visible: false,
                  },
                  {
                    reference: 'language',
                    label: 'Language',
                    visible: false,
                  },
                  {
                    reference: 'followers',
                    label: 'Followers',
                    visible: true,
                  },
                  {
                    reference: 'averageLikes',
                    label: 'Average Likes',
                    visible: false,
                  },
                  {
                    reference: 'averageComments',
                    label: 'Average Comments',
                    visible: false,
                  },
                  {
                    reference: 'engagement',
                    label: 'Engagement',
                    visible: false,
                  },
                  {
                    reference: 'campaignStatus',
                    label: 'Campaign - Status',
                    visible: true,
                  },
                ]}
                items={[]}
                renderItem={() => {}}
              />
              <Pagination count={32} />
            </Stack>
          )}
          {tabs === 1 && (
            <Stack>
              <CheckboxTable
                head={[
                  {
                    reference: 'username',
                    label: 'Username',
                    visible: true,
                  },
                  {
                    reference: 'diseaseArea',
                    label: 'Disease Area',
                    visible: true,
                  },
                  {
                    reference: 'location',
                    label: 'Location',
                    visible: true,
                  },
                  {
                    reference: 'age',
                    label: 'Age',
                    visible: true,
                  },
                  {
                    reference: 'gender',
                    label: 'Gender',
                    visible: true,
                  },
                  {
                    reference: 'ethnicity',
                    label: 'Ethnicity',
                    visible: false,
                  },
                  {
                    reference: 'brands',
                    label: 'Brands',
                    visible: false,
                  },
                  {
                    reference: 'products',
                    label: 'Products',
                    visible: false,
                  },
                  {
                    reference: 'interests',
                    label: 'Interests',
                    visible: false,
                  },
                  {
                    reference: 'struggles',
                    label: 'Struggles',
                    visible: false,
                  },
                  {
                    reference: 'language',
                    label: 'Language',
                    visible: false,
                  },
                  {
                    reference: 'followers',
                    label: 'Followers',
                    visible: true,
                  },
                  {
                    reference: 'averageLikes',
                    label: 'Average Likes',
                    visible: false,
                  },
                  {
                    reference: 'averageComments',
                    label: 'Average Comments',
                    visible: false,
                  },
                  {
                    reference: 'engagement',
                    label: 'Engagement',
                    visible: false,
                  },
                  {
                    reference: 'campaignStatus',
                    label: 'Campaign - Status',
                    visible: true,
                  },
                ]}
                items={[]}
                renderItem={() => {}}
              />
              <Pagination count={32} />
            </Stack>
          )}
          {tabs === 2 && (
            <Stack>
              <CheckboxTable
                head={[
                  {
                    reference: 'username',
                    label: 'Username',
                    visible: true,
                  },
                  {
                    reference: 'firstName',
                    label: 'First Name',
                    visible: true,
                  },
                  {
                    reference: 'diseaseArea',
                    label: 'Disease Area',
                    visible: true,
                  },
                  {
                    reference: 'location',
                    label: 'Location',
                    visible: false,
                  },
                  {
                    reference: 'age',
                    label: 'Age',
                    visible: true,
                  },
                  {
                    reference: 'gender',
                    label: 'Gender',
                    visible: false,
                  },
                  {
                    reference: 'ethnicity',
                    label: 'Ethnicity',
                    visible: false,
                  },
                  {
                    reference: 'brands',
                    label: 'Brands',
                    visible: false,
                  },
                  {
                    reference: 'products',
                    label: 'Products',
                    visible: false,
                  },
                  {
                    reference: 'interests',
                    label: 'Interests',
                    visible: false,
                  },
                  {
                    reference: 'struggles',
                    label: 'Struggles',
                    visible: false,
                  },
                  {
                    reference: 'language',
                    label: 'Language',
                    visible: false,
                  },
                  {
                    reference: 'followers',
                    label: 'Followers',
                    visible: true,
                  },
                  {
                    reference: 'averageLikes',
                    label: 'Average Likes',
                    visible: false,
                  },
                  {
                    reference: 'averageComments',
                    label: 'Average Comments',
                    visible: false,
                  },
                  {
                    reference: 'engagement',
                    label: 'Engagement',
                    visible: false,
                  },
                  {
                    reference: 'campaignStatus',
                    label: 'Campaign - Status',
                    visible: true,
                  },
                ]}
                items={[]}
                renderItem={() => {}}
              />
              <Pagination count={32} />
            </Stack>
          )}
          {tabs === 3 && (
            <Stack>
              <CheckboxTable
                head={[
                  {
                    reference: 'username',
                    label: 'Username',
                    visible: true,
                  },
                  {
                    reference: 'firstName',
                    label: 'First Name',
                    visible: true,
                  },
                  {
                    reference: 'diseaseArea',
                    label: 'Disease Area',
                    visible: true,
                  },
                  {
                    reference: 'location',
                    label: 'Location',
                    visible: false,
                  },
                  {
                    reference: 'age',
                    label: 'Age',
                    visible: true,
                  },
                  {
                    reference: 'gender',
                    label: 'Gender',
                    visible: false,
                  },
                  {
                    reference: 'ethnicity',
                    label: 'Ethnicity',
                    visible: false,
                  },
                  {
                    reference: 'brands',
                    label: 'Brands',
                    visible: false,
                  },
                  {
                    reference: 'products',
                    label: 'Products',
                    visible: false,
                  },
                  {
                    reference: 'interests',
                    label: 'Interests',
                    visible: false,
                  },
                  {
                    reference: 'struggles',
                    label: 'Struggles',
                    visible: false,
                  },
                  {
                    reference: 'language',
                    label: 'Language',
                    visible: false,
                  },
                  {
                    reference: 'followers',
                    label: 'Followers',
                    visible: true,
                  },
                  {
                    reference: 'averageLikes',
                    label: 'Average Likes',
                    visible: false,
                  },
                  {
                    reference: 'averageComments',
                    label: 'Average Comments',
                    visible: false,
                  },
                  {
                    reference: 'engagement',
                    label: 'Engagement',
                    visible: false,
                  },
                  {
                    reference: 'campaignStatus',
                    label: 'Campaign - Status',
                    visible: true,
                  },
                  {
                    reference: 'statusChange',
                    label: 'Status Change',
                    visible: true,
                  },
                  {
                    reference: 'submissionLink',
                    label: 'Submission Link',
                    visible: true,
                  },
                ]}
                items={[]}
                renderItem={() => {}}
              />
              <Pagination count={32} />
            </Stack>
          )}
          <Button color="primary" variant="contained" onClick={handleMenu}>
            Actions
          </Button>
        </Stack>
        {open && (
          <Menu
            items={[
              {
                icon: <InviteIcon />,
                label: 'Invite',
                action: () => {},
              },
              {
                icon: <DeleteIcon />,
                label: 'Remove',
                action: () => {},
              },
            ]}
            ref={menu}
          />
        )}
      </CardWithText>
    </FinishedReportMain>
  );
};

export default ManageReportPage;
