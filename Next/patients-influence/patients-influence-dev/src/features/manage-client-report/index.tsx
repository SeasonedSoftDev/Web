import React from 'react';
import { FinishedReportMain } from 'features/manage-report/styles';
import { Button, Pagination } from 'components/ui';
import { CardWithText, CheckboxTable } from 'components/custom';
import { useRouter } from 'next/router';
import { Stack } from 'components/system';

const ManageReportPage = ({ ...props }) => {
  const router = useRouter();

  return (
    <FinishedReportMain {...props}>
      <CardWithText
        title="Report Name"
        description="Influencers"
        actions={[
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            onClick={() => router.push('/reports')}
          >
            Back
          </Button>,
        ]}
      >
        <Stack>
          <CheckboxTable
            head={[
              {
                reference: 'username',
                label: 'Username',
                visible: true,
              },
              {
                reference: 'followers',
                label: 'Followers',
                visible: true,
              },
              {
                reference: 'reach',
                label: 'Reach',
                visible: true,
              },
              {
                reference: 'likes',
                label: 'Likes',
                visible: true,
              },
              {
                reference: 'comments',
                label: 'Comments',
                visible: false,
              },
              {
                reference: 'engagement',
                label: 'Engagement',
                visible: false,
              },
              {
                reference: 'clicks',
                label: 'Clicks',
                visible: true,
              },
              {
                reference: 'overlap',
                label: 'Overlap',
                visible: false,
              },
              {
                reference: 'cpt',
                label: 'CPT',
                visible: false,
              },
              {
                reference: 'cpc',
                label: 'CPC',
                visible: true,
              },
            ]}
            items={[]}
            renderItem={() => {}}
          />
          <Pagination count={32} />
        </Stack>
      </CardWithText>
    </FinishedReportMain>
  );
};

export default ManageReportPage;
