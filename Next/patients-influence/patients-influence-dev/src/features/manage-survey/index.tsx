import React from 'react';

import { ManageSurveyMain } from 'features/manage-survey/styles';
import { Button, Pagination } from 'components/ui';
import { CardWithText, CheckboxTable } from 'components/custom';
import { useRouter } from 'next/router';
import { Stack } from 'components/system';

const ManageReportPage = ({ ...props }) => {
  const router = useRouter();

  return (
    <ManageSurveyMain {...props}>
      <CardWithText
        title="Report Name"
        description="Influencers"
        actions={[
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            onClick={() => router.push('/services/surveys')}
          >
            Back
          </Button>,
        ]}
      >
        <Stack>
          <CheckboxTable
            head={[
              {
                reference: 'firstName',
                label: 'First Name',
                visible: true,
              },
              {
                reference: 'lastName',
                label: 'Last Name',
                visible: false,
              },
              {
                reference: 'experienceAs',
                label: 'Experience As',
                visible: false,
              },
              {
                reference: 'email',
                label: 'Email',
                visible: false,
              },
              {
                reference: 'socialMedia',
                label: 'Social Media',
                visible: false,
              },
              {
                reference: 'username',
                label: 'Username',
                visible: false,
              },
              {
                reference: 'diseaseArea',
                label: 'Disease Area',
                visible: false,
              },
              {
                reference: 'location',
                label: 'Location',
                visible: false,
              },
              {
                reference: 'age',
                label: 'Age',
                visible: false,
              },
              {
                reference: 'gender',
                label: 'Gender',
                visible: false,
              },
              {
                reference: 'invitedBy',
                label: 'Invited By',
                visible: false,
              },
              {
                reference: 'invited',
                label: 'Invited',
                visible: false,
              },
              {
                reference: 'username',
                label: 'Username',
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
                visible: false,
              },
              {
                reference: 'engagement',
                label: 'Engagement',
                visible: false,
              },
              {
                reference: 'label',
                label: 'Label',
                visible: false,
              },
              {
                reference: 'registeredAt',
                label: 'Registered At',
                visible: false,
              },
              {
                reference: 'reachMultiplier',
                label: 'Reach Multiplier',
                visible: false,
              },
              {
                reference: 'costPerComment',
                label: 'Cost per Comment',
                visible: false,
              },
              {
                reference: 'costPerLike',
                label: 'Cost per Like',
                visible: false,
              },
              {
                reference: 'costPerEngagement',
                label: 'Cost per Engagement',
                visible: false,
              },
              {
                reference: 'costPerEngagedTarget',
                label: 'Cost Per Engaged Target',
                visible: false,
              },
              {
                reference: 'totalEarnings',
                label: 'Total Earnings',
                visible: false,
              },
              {
                reference: 'earningsLast30Days',
                label: 'Earnings Last 30 Days',
                visible: false,
              },
              {
                reference: 'totalProjects',
                label: 'Total Projects',
                visible: false,
              },
              {
                reference: 'projectsLast30Days',
                label: 'Projects Last 30 Days',
                visible: false,
              },
              {
                reference: 'totalCampaigns',
                label: 'Total Campaigns',
                visible: false,
              },
              {
                reference: 'campaignsLast30Days',
                label: 'Campaigns Last 30 Days',
                visible: false,
              },
              {
                reference: 'totalSurveys',
                label: 'Total Surveys',
                visible: false,
              },
              {
                reference: 'surveysLast30Days',
                label: 'Surveys Last 30 Days',
                visible: false,
              },
              {
                reference: 'questionCreditAmount',
                label: 'Question Credit Amount',
                visible: false,
              },
              {
                reference: 'surveyStatus',
                label: 'Survey - Status',
                visible: true,
              },
              {
                reference: 'statusChange',
                label: 'Status Changed',
                visible: true,
              },
              {
                reference: 'price',
                label: 'Price',
                visible: true,
              },
            ]}
            items={[]}
            renderItem={() => {}}
          />
          <Pagination count={32} />
        </Stack>
      </CardWithText>
    </ManageSurveyMain>
  );
};

export default ManageReportPage;
