import React, { useState } from 'react';
import { Chat, Modal, ProgressDisplay, Tabs, Title } from 'components/custom';
import { TInfluencerProfileModalProps } from 'features/create-survey/elements/influencer-profile/types';
import {
  InfluencerProfileModalMain,
  InfluencerProfileChartContainer,
  InfluencerTitle,
  InfluencerGrid,
  HoverView,
} from 'features/create-survey/elements/influencer-profile/style';
import { Button, Input, InputGroup } from 'components/ui';
import { Stack } from 'components/system';
import { BarChart, PieChart } from 'components/csr';
import Theme from 'theme';
import { InputLabel } from 'components/ui/input/styles';
import { CopyIcon, EditIcon } from 'components/svg';
import { useSnackbar } from 'hooks';

const InfluencerProfile = ({
  onClose,
  ...props
}: TInfluencerProfileModalProps) => {
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    experienceAs: '',
    email: '',
    platform: '',
    username: '',
    diseaseArea: '',
    location: '',
    age: '',
    gender: '',
    invitedBy: '',
    invited: '',

    ethnicity: '',
    brands: '',
    products: '',
    interests: '',
    struggles: '',
    followers: '',
    averageLikes: '',
    averageComments: '',
    engagement: '',
    stakeholderRatio: '',

    project: null,
    dateFrom: null,
    dateTo: null,

    projectsP: null,
    submission: [],

    comments: [],
    labels: [],
    meetings: [],
    reminders: [],
    tasks: [],
    verifiedSince: null,
  });

  const [disabled, setDisabled] = useState(true);

  const [tab, setTab] = useState(0);

  const handleDisabled = () => {
    setDisabled(!disabled);
  };
  const { push } = useSnackbar();
  const [link, setLink] = useState('dsadsadsada');
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      push(`Successfully copied!`, {
        variant: 'success',
      });
    } catch {
      push('Something failed!', {
        variant: 'error',
      });
    }
  };

  // const handleFile = async () => {};

  return (
    <Modal
      size="medium"
      title={
        <InfluencerTitle>
          First Name Last Name
          {state.firstName} {state.lastName}
          <EditIcon style={{ cursor: 'pointer' }} onClick={handleDisabled} />
        </InfluencerTitle>
      }
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Close
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack
        style={{ height: '500px', overflowY: 'scroll', paddingRight: '10px' }}
      >
        <Tabs
          tabs={[
            'Info',
            'Influencer',
            'Audience',
            'Performance',
            'Projects',
            'Management',
          ]}
          value={tab}
          onValue={setTab}
        />
        {tab === 0 && (
          <InfluencerProfileModalMain columns={1}>
            <Stack direction="horizontal">
              <Input
                type="text"
                label="Experience As"
                placeholder="Please Enter"
                value={state.experienceAs}
                disabled={disabled}
                onValue={(experienceAs) => setState({ ...state, experienceAs })}
              />
              <Input
                type="text"
                label="Email"
                placeholder="Please Enter"
                value={state.email}
                disabled={disabled}
                onValue={(email) => setState({ ...state, email })}
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                type="text"
                label="Platform"
                placeholder="Please Enter"
                value={state.platform}
                disabled={disabled}
                onValue={(platform) => setState({ ...state, platform })}
              />
              <Input
                type="text"
                label="Username"
                placeholder="Please Enter"
                value={state.username}
                disabled={disabled}
                onValue={(username) => setState({ ...state, username })}
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                type="text"
                label="Disease Area"
                placeholder="Please Enter"
                value={state.diseaseArea}
                disabled={disabled}
                onValue={(diseaseArea) => setState({ ...state, diseaseArea })}
                isFilterActive
              />
              <Input
                type="text"
                label="Location"
                placeholder="Please Enter"
                value={state.location}
                disabled={disabled}
                onValue={(location) => setState({ ...state, location })}
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                type="text"
                label="Age"
                placeholder="Please Enter"
                value={state.age}
                disabled={disabled}
                onValue={(age) => setState({ ...state, age })}
              />
              <Input
                type="text"
                label="Gender"
                placeholder="Please Enter"
                value={state.gender}
                disabled={disabled}
                onValue={(gender) => setState({ ...state, gender })}
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                type="text"
                label="Invited By"
                placeholder="Please Enter"
                value={state.invitedBy}
                disabled={disabled}
                onValue={(invitedBy) => setState({ ...state, invitedBy })}
              />
              <Input
                type="text"
                label="Invited"
                placeholder="Please Enter"
                value={state.invited}
                disabled={disabled}
                onValue={(invited) => setState({ ...state, invited })}
              />
            </Stack>
          </InfluencerProfileModalMain>
        )}
        {tab === 1 && (
          <InfluencerProfileModalMain columns={1}>
            <Stack direction="horizontal">
              <Input
                type="text"
                label="Ethnicity"
                placeholder="Please Enter"
                value={state.ethnicity}
                disabled={disabled}
                onValue={(ethnicity) => setState({ ...state, ethnicity })}
              />
              <Input
                type="text"
                label="Brands"
                placeholder="Please Enter"
                value={state.brands}
                disabled={disabled}
                onValue={(brands) => setState({ ...state, brands })}
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                type="text"
                label="Products"
                placeholder="Please Enter"
                value={state.products}
                disabled={disabled}
                onValue={(products) => setState({ ...state, products })}
              />
              <Input
                type="text"
                label="Interests"
                placeholder="Please Enter"
                value={state.interests}
                disabled={disabled}
                onValue={(interests) => setState({ ...state, interests })}
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                type="text"
                label="Struggles"
                placeholder="Please Enter"
                value={state.struggles}
                disabled={disabled}
                onValue={(struggles) => setState({ ...state, struggles })}
              />
              <Input
                type="text"
                label="Followers"
                placeholder="Please Enter"
                value={state.followers}
                disabled={disabled}
                onValue={(followers) => setState({ ...state, followers })}
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                type="text"
                label="Average Likes"
                placeholder="Please Enter"
                value={state.averageLikes}
                disabled={disabled}
                onValue={(averageLikes) => setState({ ...state, averageLikes })}
              />
              <Input
                type="text"
                label="Average Comments"
                placeholder="Please Enter"
                value={state.averageComments}
                disabled={disabled}
                onValue={(averageComments) =>
                  setState({ ...state, averageComments })
                }
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                type="text"
                label="Engagement"
                placeholder="Please Enter"
                value={state.engagement}
                disabled={disabled}
                onValue={(engagement) => setState({ ...state, engagement })}
              />
              <Input
                type="text"
                label="Stakeholder Ratio"
                placeholder="Please Enter"
                value={state.stakeholderRatio}
                disabled={disabled}
                onValue={(stakeholderRatio) =>
                  setState({ ...state, stakeholderRatio })
                }
              />
            </Stack>
          </InfluencerProfileModalMain>
        )}

        {tab === 2 && (
          <InfluencerProfileModalMain columns={1}>
            <Stack style={{ paddingRight: '10px' }}>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Age & Gender</InputLabel>
                  <div style={{ width: '100%', height: 400 }}>
                    <BarChart
                      labels={[
                        '0-5',
                        '6-10',
                        '11-15',
                        '16-20',
                        '21-25',
                        '26-30',
                        '31-35',
                        '36-40',
                        '41-45',
                        '46-50',
                      ]}
                      data={[
                        {
                          color: `${Theme.palette.primary.main}`,
                          values: [2, 6, 2, 13, 22, 5, 18, 5, 2, 7],
                        },
                        {
                          color: `${Theme.palette.secondary.main}`,
                          values: [5, 10, 15, 20, 25, 18, 13, 8, 3, 1],
                        },
                      ]}
                      verticalLabel="% of followers"
                      horizontalLabel="Age range"
                    />
                  </div>
                </Stack>
                <Stack>
                  <InputLabel>Audience</InputLabel>
                  <PieChart
                    labels={['Patients', 'Doctors', 'Nurses', 'Muggles']}
                    data={[21, 52, 23, 14]}
                  />
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Location</InputLabel>
                  <div style={{ width: '100%', height: 400 }}>
                    <BarChart
                      labels={['US', 'DE', 'CH', 'UK', 'IT', 'DE', 'CRO']}
                      data={[
                        {
                          color: `${Theme.palette.primary.main}`,
                          values: [28, 22, 18, 14, 12, 10, 8, 6, 4, 2],
                        },
                      ]}
                      verticalLabel="% of followers"
                    />
                  </div>
                </Stack>
                <Stack>
                  <InputLabel>City</InputLabel>
                  <div style={{ width: '100%', height: 400 }}>
                    <BarChart
                      labels={['US', 'DE', 'CH', 'UK', 'IT', 'DE', 'CRO']}
                      data={[
                        {
                          color: `${Theme.palette.primary.main}`,
                          values: [28, 22, 18, 14, 12, 10, 8, 6, 4, 2],
                        },
                      ]}
                      verticalLabel="% of followers"
                    />
                  </div>
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Language</InputLabel>
                  <PieChart
                    labels={['Patients', 'Doctors', 'Nurses', 'Muggles']}
                    data={[21, 52, 23, 14]}
                  />
                </Stack>
                <Stack>
                  <InputLabel>Ethnicity</InputLabel>
                  <PieChart
                    labels={['Patients', 'Doctors', 'Nurses', 'Muggles']}
                    data={[21, 52, 23, 14]}
                  />
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Interests</InputLabel>
                  <div style={{ width: '100%', height: 400 }}>
                    <BarChart
                      labels={['H', 'F', 'T', 'B', 'C', 'A', 'T']}
                      data={[
                        {
                          color: `${Theme.palette.primary.main}`,
                          values: [28, 22, 18, 14, 12, 10, 8, 6, 4, 2],
                        },
                      ]}
                      verticalLabel="% of followers"
                    />
                  </div>
                </Stack>
                <Stack>
                  <InputLabel>Struggles</InputLabel>
                  <div style={{ width: '100%', height: 400 }}>
                    <BarChart
                      labels={['H', 'F', 'M', 'T', 'C', 'D', 'Z']}
                      data={[
                        {
                          color: `${Theme.palette.primary.main}`,
                          values: [28, 22, 18, 14, 12, 10, 8, 6, 4, 2],
                        },
                      ]}
                      verticalLabel="% of followers"
                    />
                  </div>
                </Stack>
              </Stack>
            </Stack>
          </InfluencerProfileModalMain>
        )}
        {tab === 3 && (
          <InfluencerProfileModalMain columns={1}>
            <Stack style={{ paddingRight: '10px' }}>
              <InfluencerGrid>
                <Input
                  type="select"
                  label="Project"
                  placeholder="Please Select"
                  value={state.project}
                  disabled={disabled}
                  onValue={(project) => setState({ ...state, project })}
                />
                <InputGroup
                  label="Start & Finish"
                  inputRatio="1fr 1fr"
                  elements={[
                    {
                      value: state.dateFrom,
                      onValue: (dateFrom) => setState({ ...state, dateFrom }),
                      type: 'date',
                      placeholder: 'Start date',
                    },
                    {
                      value: state.dateTo,
                      onValue: (dateTo) => setState({ ...state, dateTo }),
                      type: 'date',
                      placeholder: 'End date',
                    },
                  ]}
                />
              </InfluencerGrid>
              <Stack>
                <Stack direction="horizontal">
                  <Stack>
                    <Title title="Total Project" style={{ color: 'unset' }} />
                    <InfluencerProfileChartContainer>
                      <ProgressDisplay
                        percent={100}
                        color="primary"
                        label={
                          <HoverView>
                            <span> Total: 22 </span>
                            <div />
                            <span>Campaigns: 20</span>
                            <div />
                            <span>Surveys: 2</span>
                          </HoverView>
                        }
                        tooltip
                      />
                      <ProgressDisplay
                        percent={70}
                        color="secondary"
                        label={
                          <HoverView>
                            <span> Total: 22 </span>
                            <div />
                            <span>Campaigns: 20</span>
                            <div />
                            <span>Surveys: 2</span>
                          </HoverView>
                        }
                        tooltip
                      />
                    </InfluencerProfileChartContainer>
                  </Stack>
                  <Stack>
                    <Title
                      title="Projects in Last 30 Days"
                      style={{ color: 'unset' }}
                    />
                    <InfluencerProfileChartContainer>
                      <ProgressDisplay
                        percent={100}
                        color="primary"
                        label="Highest"
                        tooltip
                      />
                      <ProgressDisplay
                        percent={70}
                        color="secondary"
                        label="Average"
                        tooltip
                      />
                    </InfluencerProfileChartContainer>
                  </Stack>
                </Stack>
                <Stack direction="horizontal">
                  <Stack>
                    <Title title="Total Earnings" style={{ color: 'unset' }} />
                    <InfluencerProfileChartContainer>
                      <ProgressDisplay
                        percent={100}
                        color="primary"
                        label="Highest"
                        tooltip
                      />
                      <ProgressDisplay
                        percent={70}
                        color="secondary"
                        label="Average"
                        tooltip
                      />
                    </InfluencerProfileChartContainer>
                  </Stack>
                  <Stack>
                    <Title
                      title="Earnings in Last 30 Days"
                      style={{ color: 'unset' }}
                    />
                    <InfluencerProfileChartContainer>
                      <ProgressDisplay
                        percent={100}
                        color="primary"
                        label="Highest"
                        tooltip
                      />
                      <ProgressDisplay
                        percent={70}
                        color="secondary"
                        label="Average"
                        tooltip
                      />
                    </InfluencerProfileChartContainer>
                  </Stack>
                </Stack>
                <Stack direction="horizontal">
                  <Stack>
                    <Title
                      title="Desired Amount per Instagram Post"
                      style={{ color: 'unset' }}
                    />
                    <InfluencerProfileChartContainer>
                      <ProgressDisplay
                        percent={100}
                        color="primary"
                        label="Highest"
                        tooltip
                      />
                      <ProgressDisplay
                        percent={70}
                        color="secondary"
                        label="Average"
                        tooltip
                      />
                    </InfluencerProfileChartContainer>
                  </Stack>
                  <Stack>
                    <Title title="Cost per Target" style={{ color: 'unset' }} />
                    <InfluencerProfileChartContainer>
                      <ProgressDisplay
                        percent={100}
                        color="primary"
                        label="Highest"
                        tooltip
                      />
                      <ProgressDisplay
                        percent={70}
                        color="secondary"
                        label="Average"
                        tooltip
                      />
                    </InfluencerProfileChartContainer>
                  </Stack>
                </Stack>
                <Stack direction="horizontal">
                  <Stack>
                    <Title title="Reach" style={{ color: 'unset' }} />
                    <InfluencerProfileChartContainer>
                      <ProgressDisplay
                        percent={100}
                        color="primary"
                        label="Highest"
                        tooltip
                      />
                      <ProgressDisplay
                        percent={70}
                        color="secondary"
                        label="Average"
                        tooltip
                      />
                    </InfluencerProfileChartContainer>
                  </Stack>
                  <Stack>
                    <Title title="Cost per Click" style={{ color: 'unset' }} />
                    <InfluencerProfileChartContainer>
                      <ProgressDisplay
                        percent={100}
                        color="primary"
                        label="Highest"
                        tooltip
                      />
                      <ProgressDisplay
                        percent={70}
                        color="secondary"
                        label="Average"
                        tooltip
                      />
                    </InfluencerProfileChartContainer>
                  </Stack>
                </Stack>
                <Stack direction="horizontal">
                  <Stack>
                    <Title title="Engagement" style={{ color: 'unset' }} />
                    <InfluencerProfileChartContainer>
                      <ProgressDisplay
                        percent={100}
                        color="primary"
                        label="Highest"
                        tooltip
                      />
                      <ProgressDisplay
                        percent={70}
                        color="secondary"
                        label="Average"
                        tooltip
                      />
                    </InfluencerProfileChartContainer>
                  </Stack>
                  <Stack>
                    <Title title="Likes" style={{ color: 'unset' }} />
                    <InfluencerProfileChartContainer>
                      <ProgressDisplay
                        percent={100}
                        color="primary"
                        label="Highest"
                        tooltip
                      />
                      <ProgressDisplay
                        percent={70}
                        color="secondary"
                        label="Average"
                        tooltip
                      />
                    </InfluencerProfileChartContainer>
                  </Stack>
                </Stack>
                <Stack direction="horizontal">
                  <Stack>
                    <Title title="Comments" style={{ color: 'unset' }} />
                    <InfluencerProfileChartContainer>
                      <ProgressDisplay
                        percent={100}
                        color="primary"
                        label="Highest"
                        tooltip
                      />
                      <ProgressDisplay
                        percent={70}
                        color="secondary"
                        label="Average"
                        tooltip
                      />
                    </InfluencerProfileChartContainer>
                  </Stack>
                  <Stack>
                    <Title title="Website Clicks" style={{ color: 'unset' }} />
                    <InfluencerProfileChartContainer>
                      <ProgressDisplay
                        percent={80}
                        color="primary"
                        label="Highest"
                        tooltip
                      />
                      <ProgressDisplay
                        percent={70}
                        color="secondary"
                        label="Average"
                        tooltip
                      />
                    </InfluencerProfileChartContainer>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </InfluencerProfileModalMain>
        )}
        {tab === 4 && (
          <InfluencerProfileModalMain columns={1}>
            <Stack direction="horizontal">
              <Input
                type="select"
                label="Project"
                placeholder="Please Select"
                value={state.projectsP}
                onValue={(projectsP) => setState({ ...state, projectsP })}
              />
              <Input
                type="text"
                label="Submission"
                placeholder="Please Select"
                value={link}
                disabled
                endAdornment={<CopyIcon />}
                onClick={handleCopyToClipboard}
                onValue={(submission) => setState({ ...state, submission })}
              />
            </Stack>
            {/* <Chat /> */}
          </InfluencerProfileModalMain>
        )}

        {tab === 5 && (
          <InfluencerProfileModalMain columns={1}>
            <Stack direction="horizontal">
              <Input
                type="multiselect"
                label="Comments"
                placeholder="Please Enter"
                value={state.comments}
                disabled={disabled}
                onValue={(comments) => setState({ ...state, comments })}
              />
              <Input
                type="multiselect"
                label="Labels"
                placeholder="Please Enter"
                value={state.labels}
                disabled={disabled}
                onValue={(labels) => setState({ ...state, labels })}
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                type="multiselect"
                label="Meetings"
                placeholder="Please Enter"
                value={state.meetings}
                disabled={disabled}
                onValue={(meetings) => setState({ ...state, meetings })}
              />
              <Input
                type="multiselect"
                label="Reminders"
                placeholder="Please Enter"
                value={state.reminders}
                disabled={disabled}
                onValue={(reminders) => setState({ ...state, reminders })}
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                type="multiselect"
                label="Tasks"
                placeholder="Please Enter"
                value={state.tasks}
                disabled={disabled}
                onValue={(tasks) => setState({ ...state, tasks })}
              />
              <Input
                type="date"
                label="Verified Since"
                placeholder="Please Enter"
                value={state.verifiedSince}
                disabled={disabled}
                onValue={(verifiedSince) =>
                  setState({ ...state, verifiedSince })
                }
              />
            </Stack>
          </InfluencerProfileModalMain>
        )}
      </Stack>
    </Modal>
  );
};

export default InfluencerProfile;
