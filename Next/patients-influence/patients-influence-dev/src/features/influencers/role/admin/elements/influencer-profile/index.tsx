import React, { useEffect, useState } from 'react';
import { Chat, Modal, ProgressDisplay, Tabs, Title } from 'components/custom';
import { TInfluencerProfileModalProps } from 'features/influencers/role/admin/elements/influencer-profile/types';
import {
  InfluencerProfileModalMain,
  InfluencerProfileChartContainer,
  InfluencerTitle,
  InfluencerGrid,
  HoverView,
  ClientProgressStack,
} from 'features/influencers/role/admin/elements/influencer-profile/style';
import { Button, Input, InputGroup } from 'components/ui';
import { Stack } from 'components/system';
import { BarChart, PieChart } from 'components/csr';
import Theme from 'theme';
import { InputLabel } from 'components/ui/input/styles';
import { CopyIcon, EditIcon } from 'components/svg';
import { useDebounce, useLocationSearch, useSnackbar } from 'hooks';
import { DiseaseAreaAPI, EnumsApi, InfluencerAPI } from 'api';
import { IUser } from 'api/users/types';
import { calculateAge } from 'features/discover-influencers/role/admin/elements/influencer-profile/helpers';
import { TSelectFieldType } from 'features/discover-influencers/role/admin/elements/influencer-profile/types';

const InfluencerProfile = ({
  onClose,
  reload,
  userId,
  ...props
}: TInfluencerProfileModalProps) => {
  const {
    locations,
    getLocations,
    loading: locationLoading,
  } = useLocationSearch();

  const availableSocialPlatforms = [
    {
      value: 1,
      label: 'Instagram',
    },
    {
      value: 2,
      label: 'Twitter',
    },
    {
      value: 3,
      label: 'Facebook',
    },
  ];

  const [influencer, setInfluencer] = useState<IUser>();
  const [genderOptions, setGenderOptions] = useState();
  const [loading, setLoading] = useState(false);
  const [diseaseAreas, setDiseaseAreas] = useState<any>([]);
  const [stakeholders, setStakholders] = useState<TSelectFieldType[]>([]);
  const [affiliateFriends, setAffiliateFriends] = useState<TSelectFieldType[]>(
    []
  );
  const [postAmounts, setPostAmounts] = useState<TSelectFieldType[]>();

  const [state, setState] = useState<any>({
    firstName: '',
    lastName: '',
    experience: null,
    email: '',
    socialPlatform: '',
    username: '',
    diseaseAreas: [],
    location: null,
    age: '',
    gender: '',
    invitedBy: '',
    invited: null,

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

  const getUserData = async () => {
    const results = await InfluencerAPI.getSingleInfluencer(userId);
    setInfluencer(results);
  };

  const getGenderOptions = async () => {
    const result = await EnumsApi.getGenders();

    setGenderOptions(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const getDiseaseArea = async (s: string = '') => {
    setLoading(true);
    const { result } = await DiseaseAreaAPI.getAll(s);

    setDiseaseAreas(
      result.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    );
    setLoading(false);
  };

  const getStakeholders = async () => {
    const result = await EnumsApi.getStakeholderTypes(true);

    setStakholders(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const debouncedLocation = useDebounce(getLocations, 250);

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleNewTag = (v: any) => {
    setState({ ...state, diseaseAreas: [...state.diseaseAreas, v] });
  };

  const updateInfluencer = async (body: any, id: any) => {
    if (!disabled) {
      const {
        email,
        location,
        gender,
        dateOfBirth,
        experience,
        diseaseAreas: diseaseAreasList,
      } = body;

      const formData = {
        email: email || '',
        locationId: location ? location.value : undefined,
        gender: gender ? gender.value : undefined,
        dateOfBirth: dateOfBirth || undefined,
        type: experience ? experience.value : undefined,
        diseaseAreas: diseaseAreasList.map(
          (disease: TSelectFieldType) => disease.value
        ),
        socialPlatforms: [],
      };

      try {
        await InfluencerAPI.updateInfluencer(formData, id).then(() => {
          reload();
        });
        push('Successfully updated Influencer', { variant: 'success' });
        onClose();
      } catch {
        push('Something went wrong.', { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    getUserData();
    getLocations();
    getDiseaseArea();
    getStakeholders();
    getGenderOptions();
  }, []);

  useEffect(() => {
    if (influencer && genderOptions) {
      setState((prevState: any) => {
        let location;
        let age;
        let dateOfBirth;
        let username;
        let socialPlatform;
        let invitedBy;
        let verifiedSince;

        // let socialPlatforms: {
        //   socialPlatformId: number;
        //   authorizationCode: string;
        // }[] = [];

        if (influencer.influencer.stakeholders.length) {
          // Placeholder for when instagram starts working
          // socialPlatforms = influencer.influencer.stakeholders.map(
          //   (stakeholder) => ({
          //     socialPlatformId: stakeholder.socialPlatformId,
          //     authorizationCode: stakeholder.socialPlatformUserId,
          //   })
          // );

          const socialPlatformObj = influencer.influencer.stakeholders.find(
            (obj) => obj.socialPlatformId === 1
          );

          // username = socialPlatformObj
          //   ? socialPlatformObj.socialPlatformUsername
          //   : '';
          socialPlatform = socialPlatformObj
            ? availableSocialPlatforms[socialPlatformObj!.socialPlatformId - 1]
                .label
            : '';
        }

        if (influencer.influencer.instagramUsername) {
          username = influencer.influencer.instagramUsername;
          socialPlatform = 'Instagram';
        }

        if (influencer.location) {
          const label =
            influencer.location.countryId && influencer.location.country
              ? `${influencer.location.name}, ${influencer.location.country.name}`
              : influencer.location.name;

          location = {
            label,
            value: influencer.location.id,
          };
        }

        if (influencer.influencer.dateOfBirth) {
          dateOfBirth = new Date(influencer.influencer.dateOfBirth);
          age = calculateAge(dateOfBirth);
        }

        if (influencer.influencer.verifiedSince) {
          verifiedSince = new Date(influencer.influencer.verifiedSince);
        }

        if (influencer.influencer.invitendByUserId) {
          invitedBy = `${influencer.influencer.invitedByUser.firstName} ${influencer.influencer.invitedByUser.lastName}`;
        }

        const gender =
          influencer.influencer.gender === 0 || influencer.influencer.gender
            ? genderOptions[influencer.influencer.gender]
            : null;

        const diseaseAreasFormatted = influencer.influencer
          .influencerDiseaseAreas
          ? influencer.influencer.influencerDiseaseAreas.map((area) => {
              const label = area.diseaseArea.name;
              const value = area.diseaseArea.id;
              return {
                label,
                value,
              };
            })
          : [];

        const affiliatedFriends = influencer.invitedInfluencers.map(
          (influencerElement: { user: any }) => {
            const { id, firstName, lastName } = influencerElement.user;

            const label = `${firstName} ${lastName}`;

            return { value: id, label };
          }
        );

        setAffiliateFriends(affiliatedFriends);

        const experience =
          influencer.influencer.type === 0 || influencer.influencer.type
            ? stakeholders.find(
                (item: TSelectFieldType) =>
                  item.value === influencer.influencer.type
              )
            : null;

        return {
          ...prevState,
          firstName: influencer.firstName,
          lastName: influencer.lastName,
          email: influencer.email,
          location: location || null,
          dateOfBirth,
          gender,
          age,
          experience,
          username,
          invitedBy,
          verifiedSince,
          diseaseAreas: diseaseAreasFormatted,
          socialPlatform,
        };
      });
    }
  }, [influencer, genderOptions]);

  return (
    <Modal
      size="medium"
      title={
        <InfluencerTitle>
          {state.firstName} {state.lastName}
          <EditIcon
            style={
              disabled
                ? { cursor: 'pointer', color: '#7E839F' }
                : { cursor: 'pointer', color: '#448DC9' }
            }
            onClick={handleDisabled}
          />
        </InfluencerTitle>
      }
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() =>
            disabled ? onClose() : updateInfluencer(state, userId)
          }
        >
          {disabled ? 'Close' : 'Save'}
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack style={{ height: '500px', paddingRight: '10px' }}>
        <Tabs
          tabs={[
            'Info',
            'Influencer',
            // 'Audience',
            // 'Performance',
            'Projects',
            // 'Management',
          ]}
          value={tab}
          onValue={setTab}
        />
        {tab === 0 && (
          <InfluencerProfileModalMain columns={2}>
            {/* <Stack direction="horizontal"> */}
            <Input
              type="select"
              label="Experience"
              placeholder="Please Select"
              disabled={disabled}
              value={state.experience}
              onValue={(input) => setState({ ...state, experience: input })}
              options={stakeholders}
            />
            <Input
              type="text"
              label="Email"
              placeholder="Please Enter"
              value={state.email}
              disabled={disabled}
              onValue={(email) => setState({ ...state, email })}
            />
            {/* </Stack> */}
            {/* <Stack direction="horizontal"> */}
            <Input
              type="text"
              label="Platform"
              placeholder="Please Enter"
              value={state.socialPlatform}
              disabled
              onValue={(socialPlatform) =>
                setState({ ...state, socialPlatform })
              }
            />
            <Input
              type="text"
              label="Username"
              placeholder="Please Enter"
              value={state.username}
              disabled
              onValue={(username) => setState({ ...state, username })}
            />
            {/* </Stack> */}
            {/* <Stack direction="horizontal"> */}
            <Input
              type="multiselect"
              label="Disease Area"
              placeholder="Please Enter"
              disabled={disabled}
              value={state.diseaseAreas}
              onSearch={debounce(getDiseaseArea, 250)}
              onValue={(input) => {
                setState({ ...state, diseaseAreas: input });
              }}
              onNewTag={handleNewTag}
              loading={loading}
              options={diseaseAreas}
              isFilterActive
            />
            <Input
              type="select"
              label="Location"
              placeholder="Please Enter"
              disabled={disabled}
              value={state.location}
              onSearch={debouncedLocation}
              onValue={(location) => setState({ ...state, location })}
              loading={locationLoading}
              options={locations}
            />
            {/* </Stack> */}
            {/* <Stack direction="horizontal"> */}
            {disabled ? (
              <Input
                type="text"
                label="Age"
                placeholder="Please Select"
                disabled={disabled}
                value={state.age}
                onValue={(age) => setState({ ...state, age })}
              />
            ) : (
              <Input
                type="date"
                customDateFormat="DD.MM.YYYY"
                label="Date Of Birth"
                placeholder="Please Select"
                disabled={disabled}
                value={state.dateOfBirth || ''}
                onValue={(dateOfBirth) => setState({ ...state, dateOfBirth })}
              />
            )}
            <Input
              type="select"
              label="Gender"
              placeholder="Please Select"
              disabled={disabled}
              value={state.gender}
              onValue={(gender) => setState({ ...state, gender })}
              options={genderOptions}
            />
            {/* </Stack> */}
            {/* <Stack direction="horizontal"> */}
            <Input
              type="text"
              label="Invited By"
              placeholder="Please Enter"
              value={state.invitedBy}
              disabled
              onValue={(invitedBy) => setState({ ...state, invitedBy })}
            />
            <Input
              type="select"
              label="Invited"
              placeholder={
                affiliateFriends.length
                  ? 'See Invited people'
                  : 'No Invited People'
              }
              value={state.invited}
              onValue={(invited) => setState({ ...state, invited })}
              options={affiliateFriends}
            />
            {/* </Stack> */}
            <Input
              type="date"
              label="Verified Since"
              placeholder="Please Enter"
              value={state.verifiedSince}
              disabled
              onValue={(verifiedSince) => setState({ ...state, verifiedSince })}
            />
          </InfluencerProfileModalMain>
        )}
        {tab === 1 && (
          <InfluencerProfileModalMain columns={2}>
            {/* <Stack direction="horizontal"> */}
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
            {/* </Stack> */}
            {/* <Stack direction="horizontal"> */}
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
            {/* </Stack> */}
            {/* <Stack direction="horizontal"> */}
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
            {/* </Stack> */}
            {/* <Stack direction="horizontal"> */}
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
            {/* </Stack> */}
            {/* <Stack direction="horizontal"> */}
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
            {/* </Stack> */}
          </InfluencerProfileModalMain>
        )}

        {/* {tab === 2 && (
          <InfluencerProfileModalMain columns={2}>
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
        )} */}
        {/* {tab === 3 && (
          <InfluencerProfileModalMain
            columns={2}
            // style={{ display: 'flex', flexDirection: 'column' }}
          >
            
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
            
            <ClientProgressStack>
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
            </ClientProgressStack>
            <ClientProgressStack>
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
            </ClientProgressStack>
            
            <ClientProgressStack>
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
            </ClientProgressStack>
            <ClientProgressStack>
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
            </ClientProgressStack>
           
            <ClientProgressStack>
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
            </ClientProgressStack>
            <ClientProgressStack>
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
            </ClientProgressStack>
            
            <ClientProgressStack>
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
            </ClientProgressStack>
            <ClientProgressStack>
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
            </ClientProgressStack>
            
            <ClientProgressStack>
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
            </ClientProgressStack>
            <ClientProgressStack>
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
            </ClientProgressStack>
            
            <ClientProgressStack>
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
            </ClientProgressStack>
            <ClientProgressStack>
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
            </ClientProgressStack>
          
          </InfluencerProfileModalMain>
        )} */}
        {tab === 2 && (
          <InfluencerProfileModalMain columns={2}>
            {/* <Stack direction="horizontal"> */}
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
            {/* </Stack> */}
            {/* <Chat /> */}
          </InfluencerProfileModalMain>
        )}

        {/* {tab === 5 && (
          <InfluencerProfileModalMain columns={2}>
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
              onValue={(verifiedSince) => setState({ ...state, verifiedSince })}
            />
          </InfluencerProfileModalMain>
        )} */}
      </Stack>
    </Modal>
  );
};

export default InfluencerProfile;
