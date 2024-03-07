import React, { useCallback, useEffect, useState } from 'react';
import { Chat, CurrencyFeedback, Modal, Tabs } from 'components/custom';
import { TAddCampaignsModalProps } from 'features/campaigns/role/client/elements/created-campaign-modal/types';
import { AddCampaignsModalMain } from 'features/campaigns/role/client/elements/created-campaign-modal/styles';
import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { InputLabel } from 'components/ui/input/styles';
import {
  CampaignAPI,
  DiseaseAreaAPI,
  EnumsApi,
  FileManagerApi,
  LocationAPI,
  ProductApi,
} from 'api';
import { TState } from 'features/campaigns/role/admin/elements/created-campaign-modal/types';
import { CampaignsTitle } from 'features/campaigns/role/admin/elements/created-campaign-modal/styles';
import { TCampaign } from 'api/campaign/types';
import { formatCurrencyIdToObject } from 'features/discover-influencers/role/admin/elements/influencer-profile/helpers';
import { useModal } from 'hooks';
import { useAppContext } from 'context';
import Chip from 'components/ui/chip';
import ChatIO from 'api/chat';
import {
  ImageActions,
  ImageList,
  ImageUploadButton,
  ImageUploadContainer,
  ImageUploadMainContainer,
} from '../add-campaign-modal/styles';
import UploadedFileModal from '../uploaded-file-modal';
import { TCampaignPhoto } from '../add-campaign-modal/types';

const CreatedCampaignModal = ({
  onClose,
  id,
  ...props
}: TAddCampaignsModalProps) => {
  const [state, setState] = useState<TState>({
    campaignName: '',
    product: [],
    influencers: undefined,
    dateStart: null,
    dateEnd: null,
    // report: undefined,
    // currency: {},
    budget: undefined,
    campaignInfo: '',

    location: [],
    language: [],
    diseaseArea: [],
    symptoms: [],
    stakeholders: [],
    gender: [],
    age: {
      min: undefined,
      max: undefined,
    },
    ethnicity: [],
    struggles: [],
    interests: [],
    influencerSize: [],
    targetAudienceInfo: '',

    platform: null,
    postType: null,
    image: null,
    website: '',
    instructions: '',

    participantA: null,
    submission: null,

    participantC: null,
    // reportC: null,

    chatRoomId: null,
  });

  const { user } = useAppContext();

  const handleNewProductTag = (v: any) => {
    if (state.product) {
      setState({ ...state, product: [...state.product, v] });
    }
  };

  const [tab, setTab] = useState(0);

  const [campaign, setCampaign] = useState<TCampaign>({});

  const getCampaign = async () => {
    const result = await CampaignAPI.getSingleCampaign(id);

    setCampaign(result);
  };

  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState<any>([]);
  // const [report, setReport] = useState<any>();
  const [location, setLocation] = useState<any>();
  const [languages, setLanguages] = useState<any>();
  const [diseaseAreas, setDiseaseAreas] = useState<any>();
  const [stakeholders, setStakholders] = useState<any>();
  const [gender, setGender] = useState<any>();
  const [ethnicity, setEthnicity] = useState<any>();
  const [struggles, setStruggles] = useState<any>();
  const [interests, setInterests] = useState<any>();
  const [influencerSize, setInfluencerSize] = useState<any>();
  const [symptoms, setSymptoms] = useState<any>();
  const [chatRooms, setChatRooms] = useState<any>();

  const getProducts = async () => {
    const { result } = await ProductApi.getProducts('');

    setProduct(
      result.map((data: any) => ({
        value: data.id,
        label: data.name,
      }))
    );
  };

  // const getReportTypes = async () => {
  //   const result = await EnumsApi.getReportTypes();

  //   setReport(
  //     result.map((x: any) => ({
  //       value: x.value,
  //       label: x.name,
  //     }))
  //   );
  // };

  const getDiseaseAreas = async (s: string = '') => {
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

  const getLocations = async (s: string = '') => {
    setLoading(true);
    const { result } = await LocationAPI.getAll(s);
    setLocation(
      result.map((data: any) => ({
        value: data.id,
        label: data.country ? `${data.name}, ${data.country.name}` : data.name,
      }))
    );
    setLoading(false);
  };

  const getGenders = async () => {
    const result = await EnumsApi.getGenders();

    setGender(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const getStakeholders = async () => {
    const result = await EnumsApi.getStakeholderTypes();

    setStakholders(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const getEthnicities = async () => {
    const result = await EnumsApi.getEthnicities();

    setEthnicity(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getStruggles = async () => {
    const result = await EnumsApi.getStruggles();

    setStruggles(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };
  const getInterests = async () => {
    const result = await EnumsApi.getInterests();

    setInterests(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getInfluencerSizes = async () => {
    const { result } = await EnumsApi.getInfluencerSize();

    setInfluencerSize(
      result.map((x: any) => ({
        value: x.id,
        label: `${x.name}: ${x.from} - ${x.to}`,
      }))
    );
  };

  const getLanguages = async () => {
    const result = await EnumsApi.getLanguages();

    setLanguages(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const getSympthoms = async () => {
    const response = await EnumsApi.getSymptoms();

    setSymptoms(
      response.result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getListOfChatRooms = useCallback(() => {
    const array = [];

    if (
      campaign &&
      campaign.platformProductOrder &&
      campaign.platformProductOrder.platformProductOrderChatRooms
    ) {
      for (
        let i = 0;
        i < campaign.platformProductOrder.platformProductOrderChatRooms.length;
        i += 1
      ) {
        if (
          campaign.platformProductOrder.platformProductOrderChatRooms[i]
            .productOrderChatRoomMembers.length === 2
        ) {
          const filteredUsers =
            campaign.platformProductOrder.platformProductOrderChatRooms[
              i
            ].productOrderChatRoomMembers.filter((x) => x.userId !== user.id);

          const mergedChatRooms = filteredUsers.map((x) => ({
            value: x.productOrderChatRoomId,
            label: `${x.user.firstName} ${x.user.lastName}`,
            client: true,
            userId: '',
          }));

          array.push(...mergedChatRooms);
        }
        if (
          campaign.platformProductOrder.platformProductOrderChatRooms[i]
            .productOrderChatRoomMembers.length === 3
        ) {
          const filteredUsers =
            campaign.platformProductOrder.platformProductOrderChatRooms[
              i
            ].productOrderChatRoomMembers.filter((x: any) => x.user.influencer);

          const mergedChatRooms = filteredUsers.map((x) => ({
            value: x.productOrderChatRoomId,
            label: `${x.user.firstName}`,
            client: false,
            userId: x.userId,
          }));

          array.push(...mergedChatRooms);
        }
      }
    }

    setChatRooms(array);
  }, [campaign?.platformProductOrder?.platformProductOrderChatRooms]);

  useEffect(() => {
    getCampaign();
  }, [id]);

  useEffect(() => {
    getProducts();
    getDiseaseAreas();
    getLocations();
    // getReportTypes();
    getGenders();
    getStakeholders();
    getEthnicities();
    getStruggles();
    getInterests();
    getInfluencerSizes();
    getLanguages();
    getSympthoms();
  }, [id]);

  const [photos, setPhotos] = useState<TCampaignPhoto[]>([]);

  useEffect(() => {
    const newState = { ...state };

    if (newState) {
      if (campaign && Object.keys(campaign).length > 0 && campaign.name) {
        newState.campaignName = campaign.name;

        // if (campaign.campaignType) {
        //   newState.campaignType = {
        //     value: campaign.campaignType,
        //     label: 'Questionaire',
        //   };
        // }
        // if (campaign.report) {
        //   newState.report = {
        //     value: campaign.report.value,
        //     label: campaign.report.name,
        //   };
        // }

        if (campaign.stakeholderTypes) {
          newState.stakeholders = campaign.stakeholderTypes.map((x: any) => ({
            value: x.value,
            label: x.name,
          }));
        }

        if (campaign.influencersCount) {
          newState.influencers = campaign.influencersCount;
        }

        if (campaign.targetAudienceDescription) {
          newState.targetAudienceInfo = campaign.targetAudienceDescription;
        }

        // if (campaign.participantsDescription) {
        //   newState.targetAudInfo = campaign.participantsDescription;
        // }

        if (campaign.ageMin && newState.age) {
          newState.age.min = campaign.ageMin;
        }

        if (campaign.ageMax && newState.age) {
          newState.age.max = campaign.ageMax;
        }

        if (campaign.description) {
          newState.campaignInfo = campaign.description;
        }

        if (campaign.dateStart) {
          newState.dateStart = campaign.dateStart;
        }

        if (campaign.dateEnd) {
          newState.dateEnd = campaign.dateEnd;
        }

        if (campaign.products) {
          newState.product = campaign.products.map((x: any) => ({
            value: x.product.id,
            label: x.product.name,
          }));
        }
        if (campaign.platformProductOrder) {
          // if (
          //   campaign.platformProductOrder.currency &&
          //   campaign.platformProductOrder.currency.id
          // ) {
          //   const currency = formatCurrencyIdToObject(
          //     campaign.platformProductOrder.currency.id - 1
          //   );

          //   if (currency) {
          //     newState.currency = {
          //       value: currency.id + 1,
          //       label: currency.short,
          //     };
          //   }
          // }

          if (campaign.platformProductOrder.platformProductOrderLocations) {
            newState.location =
              campaign.platformProductOrder.platformProductOrderLocations.map(
                (x: any) => ({
                  value: x.location.id,
                  label: x.location.country
                    ? `${x.location.name}, ${x.location.country.name}`
                    : x.location.name,
                })
              );
          }

          if (campaign.platformProductOrder.platformProductOrderDiseaseAreas) {
            newState.diseaseArea =
              campaign.platformProductOrder.platformProductOrderDiseaseAreas.map(
                (x: any) => ({
                  value: x.diseaseArea.id,
                  label: x.diseaseArea.name,
                })
              );
          }

          if (campaign.platformProductOrder.platformProductOrderEthnicities) {
            newState.ethnicity =
              campaign.platformProductOrder.platformProductOrderEthnicities.map(
                (x: any) => ({ value: x.ethnicity.id, label: x.ethnicity.name })
              );
          }

          if (campaign.platformProductOrder.platformProductOrderStruggles) {
            newState.struggles =
              campaign.platformProductOrder.platformProductOrderStruggles.map(
                (x: any) => ({ value: x.struggle.id, label: x.struggle.name })
              );
          }

          if (campaign.platformProductOrder.platformProductOrderInterests) {
            newState.interests =
              campaign.platformProductOrder.platformProductOrderInterests.map(
                (x: any) => ({ value: x.interest.id, label: x.interest.name })
              );
          }

          if (campaign.platformProductOrder.platformProductOrderLanguages) {
            newState.language =
              campaign.platformProductOrder.platformProductOrderLanguages.map(
                (x: any) => ({ value: x.value, label: x.name })
              );
          }

          if (campaign.platformProductOrder.platformProductOrderSymptoms) {
            newState.symptoms =
              campaign.platformProductOrder.platformProductOrderSymptoms.map(
                (x: any) => ({ value: x.symptom.id, label: x.symptom.name })
              );
          }

          if (campaign.platformProductOrder.budget) {
            newState.budget = `${campaign.platformProductOrder.budget}`;
          }

          if (campaign.platformProductOrder.platformProductOrderGenders) {
            newState.gender =
              campaign.platformProductOrder.platformProductOrderGenders.map(
                (x: any) => ({
                  value: x.value,
                  label: x.name,
                })
              );
          }

          if (
            campaign.platformProductOrder.client &&
            campaign.platformProductOrder.client.user &&
            campaign.platformProductOrder.client.user.lastName &&
            campaign.platformProductOrder.client.user.firstName &&
            campaign.platformProductOrder.client.user.id
          ) {
            newState.client = {
              value: campaign.platformProductOrder.client.user.id,
              label: `${campaign.platformProductOrder.client.user.firstName} ${campaign.platformProductOrder.client.user.lastName}`,
            };
          }
        }

        if (campaign.campaignInfluencersSizes) {
          newState.influencerSize = campaign.campaignInfluencersSizes.map(
            (x: any) => ({
              value: x.influencerSize.id,
              label: `${x.influencerSize.name}: ${x.influencerSize.from} | ${x.influencerSize.to}`,
            })
          );
        }

        if (campaign.instructions) {
          newState.instructions = campaign.instructions;
        }

        if (campaign.clientCompanyWebsite) {
          newState.website = campaign.clientCompanyWebsite;
        }

        // if (campaign.campaignType !== null) {
        //   newState.campaignType = {
        //     value: 0,
        //     label: 'Questionaire',
        //   };
        // }

        if (campaign.socialPlatformId) {
          newState.platform = {
            value: campaign.socialPlatformId,
            label: 'Instagram',
          };
        }

        if (campaign.postType) {
          newState.postType = {
            value: campaign.postType.value,
            label: campaign.postType.name,
          };
        }

        if (campaign.description) {
          newState.campaignInfo = campaign.description;
        }

        if (campaign.influencersCount) {
          newState.influencerCount = campaign.influencersCount;
        }

        if (
          campaign.platformProductOrder &&
          campaign.platformProductOrder.platformProductOrderChatRooms
        ) {
          getListOfChatRooms();
        }

        if (campaign.exampleImages) {
          const array = campaign.exampleImages.map(async (x: any) => {
            const key = x.imageUrl.split('/').slice(3).join('/');
            const file = await FileManagerApi.fileDownload(key);
            const parts = x.imageUrl.split('.');
            const fileExtension = parts.pop();

            return {
              presignedUrl: file.data,
              name: x.imageUrl.split('/').slice(4).join('/'),
              type: fileExtension === 'pdf' ? 'application/pdf' : 'image/png',
              id: x.id,
              url: x.imageUrl,
            };
          });

          Promise.all(array).then((data) => setPhotos([...data]));
        }
        setState(newState);
      }
    }
  }, [id, campaign]);

  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [modal, modalOpen, modalClose] = useModal(false);

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // const handleReport = useCallback(() => {
  //   if (state.report?.value === 1) {
  //     switch (campaign?.campaignReport?.status) {
  //       case 4:
  //         return 'Ordered';
  //       case 5:
  //         return 'Ready';
  //       case 6:
  //         return 'Delivered';
  //       default:
  //         return '';
  //     }
  //   }

  //   return 'To Be Ordered';
  // }, [state.report?.value]);

  const handleSubmission = useCallback(() => {
    let submissionLink = '';

    if (
      campaign &&
      campaign.platformProductOrder &&
      campaign.platformProductOrder.platformProductOrderInfluencers
    ) {
      for (
        let i = 0;
        i <
        campaign.platformProductOrder.platformProductOrderInfluencers.length;
        i += 1
      ) {
        if (
          campaign.platformProductOrder.platformProductOrderInfluencers[i]
            .influencer.user.id === state.chatRoomId?.userId
        ) {
          submissionLink =
            campaign?.platformProductOrder.platformProductOrderInfluencers[i]
              .influencer.campaignInfluencerPerformances[0].submissionLink;
        }
      }
    }

    return submissionLink;
  }, [
    campaign.platformProductOrder?.platformProductOrderInfluencers,
    state.chatRoomId?.userId,
  ]);

  return (
    <Modal
      size="medium"
      title={
        <CampaignsTitle>
          {campaign && campaign?.name ? campaign.name : ''}
        </CampaignsTitle>
      }
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          disabled={!state.campaignName}
          onClick={() => {
            onClose();
          }}
        >
          Close
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack
        // style={{ height: '500px', overflowY: 'scroll', paddingRight: '10px' }}
        style={{ height: '500px', paddingRight: '10px' }}
      >
        {/* 'Admin Chat', 'Chat' */}
        <Tabs
          tabs={
            campaign &&
            campaign.platformProductOrder &&
            campaign.platformProductOrder.status !== 2
              ? ['Info', 'Target', 'Instructions', 'Chat']
              : ['Info', 'Target', 'Instructions']
          }
          value={tab}
          onValue={setTab}
        />
        {tab === 0 && (
          <AddCampaignsModalMain columns={2}>
            <Input
              type="text"
              label="Campaign Name"
              disabled
              value={state.campaignName}
              onValue={(campaignName) => setState({ ...state, campaignName })}
              required
            />
            <Input
              type="multiselect"
              label="Products"
              placeholder="Products"
              disabled
              value={state.product}
              onValue={(input) => setState({ ...state, product: input })}
              options={product}
              onSearch={debounce(getProducts, 250)}
              onNewTag={handleNewProductTag}
              loading={loading}
            />
            <Input
              label="Start Date"
              type="date"
              placeholder="From"
              disabled
              value={state.dateStart}
              min={state.dateStart ? state.dateStart : undefined}
              onValue={(input) => setState({ ...state, dateStart: input })}
            />
            <Input
              label="End Date"
              type="date"
              disabled
              placeholder="To"
              value={state.dateEnd}
              min={state.dateStart ? state.dateStart : undefined}
              onValue={(input) => setState({ ...state, dateEnd: input })}
            />
            {/* <Input
              type="select"
              label="Report"
              disabled
              value={state.report}
              onValue={() => {}}
              options={report}
            /> */}
            <Stack>
              <Input
                label="Budget"
                disabled
                value={state.budget}
                onValue={(budget) => setState({ ...state, budget })}
                type="number"
                placeholder="Please Enter"
                startAdornment="CHF"
              />
              <CurrencyFeedback value={state.budget} />
            </Stack>
            <GridCell columnSpan={2}>
              <Input
                multiline
                disabled
                rows={5}
                type="text"
                label="Campaign Info"
                value={state.campaignInfo}
                onValue={(campaignInfo) => setState({ ...state, campaignInfo })}
              />
            </GridCell>
          </AddCampaignsModalMain>
        )}
        {tab === 1 && (
          <AddCampaignsModalMain columns={2}>
            <Input
              type="multiselect"
              label="Location"
              placeholder="Location"
              disabled
              value={state.location}
              onValue={(input) => setState({ ...state, location: input })}
              onSearch={debounce(getLocations, 250)}
              loading={loading}
              options={location}
            />
            <Input
              type="multiselect"
              label="Language"
              placeholder="Language"
              disabled
              value={state.language}
              onValue={(language) => setState({ ...state, language })}
              options={languages}
            />
            <Input
              type="multiselect"
              label="Disease Area"
              placeholder="Disease Area"
              disabled
              value={state.diseaseArea}
              onValue={(diseaseArea) => setState({ ...state, diseaseArea })}
              onSearch={debounce(getDiseaseAreas, 250)}
              loading={loading}
              options={diseaseAreas}
              isFilterActive
            />
            <Input
              type="multiselect"
              label="Stakeholder"
              placeholder="Stakeholder"
              disabled
              value={state.stakeholders}
              onValue={(input) => setState({ ...state, stakeholders: input })}
              options={stakeholders}
            />
            <Input
              type="multiselect"
              label="Gender"
              placeholder="Gender"
              disabled
              value={state.gender}
              onValue={(input) => setState({ ...state, gender: input })}
              options={gender}
            />
            <Input
              type="min-max"
              label="Age"
              placeholder="Age"
              disabled
              value={state.age}
              onValue={(age) => setState({ ...state, age })}
            />
            <Input
              type="multiselect"
              label="Ethnicity"
              placeholder="Ethnicity"
              disabled
              value={state.ethnicity}
              onValue={(input) => setState({ ...state, ethnicity: input })}
              options={ethnicity}
            />
            <Input
              type="multiselect"
              label="Struggle"
              placeholder="Struggle"
              disabled
              value={state.struggles}
              onValue={(input) => setState({ ...state, struggles: input })}
              options={struggles}
            />
            <Input
              type="multiselect"
              label="Interest"
              placeholder="Interest"
              disabled
              value={state.interests}
              onValue={(input) => setState({ ...state, interests: input })}
              options={interests}
            />
            <Input
              type="multiselect"
              label="Symptom"
              placeholder="Symptom"
              disabled
              value={state.symptoms}
              onValue={(input) => setState({ ...state, symptoms: input })}
              options={symptoms}
            />
            <Input
              type="multiselect"
              label="Influencer Size"
              placeholder="Influencer Size"
              disabled
              value={state.influencerSize}
              onValue={(input) => setState({ ...state, influencerSize: input })}
              options={influencerSize}
            />
            <Input
              type="number"
              min={0}
              label="Influencers"
              placeholder="Influencers"
              // placeholder="Please Select"
              disabled
              value={state.influencerCount}
              onValue={(input) =>
                setState({ ...state, influencerCount: input > 0 ? input : 0 })
              }
            />
            <GridCell columnSpan={2}>
              <Input
                multiline
                rows={5}
                type="text"
                disabled
                style={{ marginBottom: '20px' }}
                label="Target Audience Info"
                placeholder="Target Audience Info"
                value={state.targetAudienceInfo}
                onValue={(targetAudienceInfo) =>
                  setState({ ...state, targetAudienceInfo })
                }
              />
            </GridCell>
          </AddCampaignsModalMain>
        )}
        {tab === 2 && (
          <AddCampaignsModalMain columns={2}>
            <Input
              type="select"
              label="Platform"
              placeholder="Platform"
              disabled
              value={state.platform ? state.platform : null}
              onValue={(platform) => setState({ ...state, platform })}
              options={[
                {
                  value: 1,
                  label: 'Instagram',
                },
              ]}
            />
            <Input
              type="select"
              label="Post Type"
              placeholder="Post Type"
              disabled
              value={state.postType}
              onValue={(postType) => setState({ ...state, postType })}
              options={[
                {
                  value: 0,
                  label: 'Post',
                },
                {
                  value: 1,
                  label: 'Reel',
                },
                {
                  value: 2,
                  label: 'Story',
                },
              ]}
            />
            <GridCell columnSpan={1}>
              <ImageUploadMainContainer>
                <ImageUploadContainer>
                  <InputLabel>Image</InputLabel>
                  <Button
                    color="default"
                    variant="contained"
                    disabled
                    style={{ width: 'fit-content' }}
                  >
                    Upload
                  </Button>
                  {photos && photos.length
                    ? photos.map((item: TCampaignPhoto, idx: number) => {
                        // eslint-disable-next-line no-shadow
                        const { presignedUrl, name, type, id } = item;
                        return (
                          <ImageList key={id}>
                            <ImageActions>
                              <ImageUploadButton
                                onClick={() => {
                                  modalOpen();
                                  setActivePhotoIdx(idx);
                                }}
                                key={id}
                              >
                                {name}
                              </ImageUploadButton>
                            </ImageActions>
                            {modal &&
                              activePhotoIdx === idx &&
                              presignedUrl && (
                                <UploadedFileModal
                                  onClose={modalClose}
                                  name={name}
                                  url={presignedUrl}
                                  type={type}
                                />
                              )}
                          </ImageList>
                        );
                      })
                    : null}
                </ImageUploadContainer>
              </ImageUploadMainContainer>
            </GridCell>
            <Input
              type="text"
              label="Website"
              disabled
              value={state.website}
              onValue={(website) => setState({ ...state, website })}
            />
            <GridCell columnSpan={2}>
              <Input
                multiline
                rows={5}
                type="text"
                disabled
                label="Instructions"
                value={state.instructions}
                onValue={(instructions) => setState({ ...state, instructions })}
              />
            </GridCell>
          </AddCampaignsModalMain>
        )}
        {tab === 3 && (
          <AddCampaignsModalMain columns={2}>
            <Input
              type="select"
              label="Participant"
              placeholder="Please Select"
              value={state.chatRoomId}
              onValue={(chatRoomId) => setState({ ...state, chatRoomId })}
              options={chatRooms}
            />
            {/* {state && state.chatRoomId && state.chatRoomId.client ? (
              <Input
                type="text"
                label="Report"
                disabled
                value={state.report?.value ? 'Yes' : 'Missing'}
                onValue={() => {}}
                endAdornment={
                  <Chip type="lightblue" size="xsmall" label={handleReport()} />
                }
              />
            ) : undefined} */}

            {state && state.chatRoomId && !state.chatRoomId.client
              ? state.chatRoomId && (
                  <Input
                    type="text"
                    label="Submission"
                    disabled
                    value={handleSubmission()}
                    onValue={() => {}}
                    // endAdornment={
                    //   <
                    // }
                  />
                )
              : undefined}
            <GridCell columnSpan={2}>
              {state.chatRoomId ? (
                <Chat chatRoomId={state.chatRoomId} isPingActive />
              ) : (
                <span />
              )}
            </GridCell>
          </AddCampaignsModalMain>
        )}
        {/* {tab === 4 && (
          <AddCampaignsModalMain columns={2}>
            <Input
              type="select"
              label="Participant"
              placeholder="Please Select"
              value={state.participantC}
              onValue={(participantC) => setState({ ...state, participantC })}
              disabled
            />
            <Input
              type="text"
              label="Report"
              placeholder="Report Name"
              disabled
              value={state.reportC}
              onValue={(reportC) => setState({ ...state, reportC })}
            />
            <GridCell columnSpan={2}>
              <Chat />
            </GridCell>
          </AddCampaignsModalMain>
        )} */}
      </Stack>
    </Modal>
  );
};

export default CreatedCampaignModal;
