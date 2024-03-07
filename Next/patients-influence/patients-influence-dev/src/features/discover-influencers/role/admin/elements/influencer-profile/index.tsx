import React, { useEffect, useState } from 'react';
import { Modal } from 'components/custom';
import {
  TInfluencerProfileModalProps,
  TPostTypeResult,
  TSelectFieldType,
} from 'features/discover-influencers/role/admin/elements/influencer-profile/types';
import {
  InfluencerProfileModalMain,
  InfluencerTitle,
} from 'features/discover-influencers/role/admin/elements/influencer-profile/style';
import { Button, Input } from 'components/ui';
import { Stack } from 'components/system';
import { EditIcon } from 'components/svg';
import { InfluencerAPI, DiseaseAreaAPI, EnumsApi } from 'api';
import { useDebounce, useLocationSearch, useSnackbar } from 'hooks';
import { IUser } from 'api/users/types';
import { IInfluencer } from 'api/influencer/types';
import { calculateAge, formatCurrencyIdToObject } from './helpers';

const InfluencerProfile = ({
  onClose,
  influencerId,
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
  const [diseaseArea, setDiseaseArea] = useState<any>([]);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [genderOptions, setGenderOptions] = useState();
  const [stakeholders, setStakholders] = useState<TSelectFieldType[]>([]);
  const [postAmounts, setPostAmounts] = useState<TSelectFieldType[]>();
  const [state, setState] = useState<any>({
    email: '',
    username: '',
    socialPlatform: '',
    followers: null,
    location: null,
    gender: null,
    dateOfBirth: '',
    age: '',
    diseaseAreas: [],
    experience: null,
  });

  const { push } = useSnackbar();

  const getInfluencer = async () => {
    const data = await InfluencerAPI.getSingleInfluencer(influencerId);
    setInfluencer(data);
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

  const getGenderOptions = async () => {
    const result = await EnumsApi.getGenders();

    setGenderOptions(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const getPostTypes = async (userId: number) => {
    const postResults = await EnumsApi.getPostTypes(userId);

    return postResults;
  };

  const getSurveyTypes = async () => {
    const surveyResults = await EnumsApi.getSurveyTypes();

    return surveyResults;
  };

  const getDiseaseArea = async (s: string = '') => {
    setLoading(true);
    const { result } = await DiseaseAreaAPI.getAll(s);

    setDiseaseArea(
      result.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    );
    setLoading(false);
  };

  const debouncedLocation = useDebounce(getLocations, 250);

  const updateInfluencer = async (body: any, id: any) => {
    if (!disabled) {
      const { email, location, gender, dateOfBirth, experience, diseaseAreas } =
        body;

      const formData = {
        email: email || '',
        locationId: location ? location.value : undefined,
        gender: gender ? gender.value : undefined,
        dateOfBirth: dateOfBirth || undefined,
        type: experience ? experience.value : undefined,
        diseaseAreas: diseaseAreas.map(
          (disease: TSelectFieldType) => disease.value
        ),
        socialPlatforms: [],
      };

      try {
        await InfluencerAPI.updateInfluencer(formData, id);
        push('Successfully updated Influencer', { variant: 'success' });
        onClose();
      } catch {
        push('Something went wrong.', { variant: 'error' });
      }
    }
  };

  const handleDisabled = () => {
    setDisabled(!disabled);
  };

  useEffect(() => {
    getInfluencer();
    getLocations();
    getDiseaseArea();
    getStakeholders();
    getGenderOptions();
  }, []);

  const formatPostAmounts = (
    influencerData: IInfluencer,
    postTypes: TPostTypeResult[],
    surveyTypes: TPostTypeResult[]
  ) => {
    const { influencerCampaignAmounts, influencerSurveyAmounts } =
      influencerData;

    const frankShortName = formatCurrencyIdToObject(2)?.short;

    const postAmountsResults: TSelectFieldType[] = [];
    influencerCampaignAmounts.map((campaign) =>
      postAmountsResults.push({
        label: `${postTypes[campaign.postType].name}: ${frankShortName} ${
          campaign.desiredAmount
        }`,
        value: campaign.id,
      })
    );

    influencerSurveyAmounts.map((survey) =>
      postAmountsResults.push({
        label: `${
          surveyTypes[survey.surveyType].name === 'Questionnaire'
            ? 'Question Credit'
            : surveyTypes[survey.surveyType].name
        }: ${frankShortName} ${survey.desiredAmount}
        `,
        value: survey.id,
      })
    );

    setPostAmounts(postAmountsResults);
  };

  useEffect(() => {
    if (influencer && genderOptions) {
      const postTypes = getPostTypes(influencer.id);
      const surveyTypes = getSurveyTypes();

      Promise.allSettled([postTypes, surveyTypes]).then((typesResults) => {
        const postTypesResult = typesResults[0] as PromiseSettledResult<
          TPostTypeResult[]
        >;
        const surveyTypesResult = typesResults[1] as PromiseSettledResult<
          TPostTypeResult[]
        >;

        if (
          postTypesResult.status === 'fulfilled' &&
          surveyTypesResult.status === 'fulfilled'
        ) {
          setState((prevState: any) => {
            let location;
            let age;
            let dateOfBirth;

            let socialPlatforms: {
              socialPlatformId: number;
              authorizationCode: string;
            }[] = [];

            if (influencer.influencer.stakeholders) {
              socialPlatforms = influencer.influencer.stakeholders.map(
                (stakeholder) => ({
                  socialPlatformId: stakeholder.socialPlatformId,
                  authorizationCode: stakeholder.socialPlatformUserId,
                })
              );
            }

            const socialPlatformObj = influencer.influencer.stakeholders.find(
              (obj) => obj.socialPlatformId === 1
            );

            const username = socialPlatformObj
              ? socialPlatformObj.socialPlatformUsername
              : '';
            const socialPlatform = socialPlatformObj
              ? availableSocialPlatforms[
                  socialPlatformObj!.socialPlatformId - 1
                ].label
              : '';

            const followersCount = socialPlatformObj
              ? socialPlatformObj?.followersCount
              : null;

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

            const gender =
              influencer.influencer.gender === 0 || influencer.influencer.gender
                ? genderOptions[influencer.influencer.gender]
                : null;

            const diseaseAreas = influencer.influencer.influencerDiseaseAreas
              ? influencer.influencer.influencerDiseaseAreas.map((area) => {
                  const label = area.diseaseArea.name;
                  const value = area.diseaseArea.id;
                  return {
                    label,
                    value,
                  };
                })
              : [];

            formatPostAmounts(
              influencer.influencer,
              postTypesResult.value,
              surveyTypesResult.value
            );

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
              diseaseAreas,
              socialPlatforms,
              username,
              socialPlatform,
              followers: followersCount,
            };
          });
        }
      });
    }
  }, [influencer, genderOptions]);

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
            disabled ? onClose() : updateInfluencer(state, influencerId)
          }
        >
          {disabled ? 'Close' : 'Save'}
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <InfluencerProfileModalMain columns={2}>
          <Input
            type="text"
            label="Email"
            placeholder="Please Enter"
            disabled={disabled}
            value={state.email}
            onValue={(email) => setState({ ...state, email })}
          />
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
            options={diseaseArea}
            isFilterActive
          />
          <Input
            type="select"
            label="Location"
            placeholder="Please Enter"
            disabled={disabled}
            value={state.location}
            onSearch={debouncedLocation}
            isFilterActive
            onValue={(location) => setState({ ...state, location })}
            loading={locationLoading}
            options={locations}
          />
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
            type="select"
            label="Gender"
            placeholder="Please Select"
            disabled={disabled}
            value={state.gender}
            onValue={(gender) => setState({ ...state, gender })}
            options={genderOptions}
          />
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
          {/* <Input
            type="select"
            label="Social Media"
            placeholder="Please Enter"
            disabled={disabled}
            value={
              state.socialPlatforms.length
                ? state.socialPlatforms[0].socialPlatformId
                : undefined
            }
            onValue={(socialMedia) => {
              setState({
                ...state,
                socialPlatforms: [
                  {
                    socialPlatformId: socialMedia,
                    authorizationCode: '',
                  },
                ],
              });
            }}
            options={[
              {
                value: 0,
                label: 'Instagram',
              },
              {
                value: 1,
                label: 'Twitter',
              },
              {
                value: 2,
                label: 'Facebook',
              },
            ]}
          /> */}
          <Input
            type="text"
            label="Platform"
            placeholder="Please Enter"
            value={state.socialPlatform}
            disabled
            onValue={(socialPlatform) => setState({ ...state, socialPlatform })}
          />
          <Input
            type="text"
            label="Username"
            placeholder="Please Enter"
            disabled
            value={state.username}
            onValue={(username) => setState({ ...state, username })}
          />
          <Input
            type="number"
            label="Followers"
            placeholder="Please Enter"
            disabled
            value={state.followers}
            onValue={(followers) => setState({ ...state, followers })}
          />
          <Input
            type="select"
            label="Amount"
            placeholder="Please Enter"
            value=""
            onValue={(postAmount) =>
              setState({ ...state, postAmounts: postAmount })
            }
            options={postAmounts}
          />
        </InfluencerProfileModalMain>
      </Stack>
    </Modal>
  );
};

export default InfluencerProfile;
