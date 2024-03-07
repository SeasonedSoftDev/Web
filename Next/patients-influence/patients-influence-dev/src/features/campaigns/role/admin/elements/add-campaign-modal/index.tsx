import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Tabs } from 'components/custom';
import { TAddCampaignModalProps } from 'features/campaigns/role/admin/elements/add-campaign-modal/types';
import { Button, Input, InputGroup } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { InputLabel } from 'components/ui/input/styles';
import {
  CampaignAPI,
  ClientAPI,
  DiseaseAreaAPI,
  EnumsApi,
  FileManagerApi,
  LocationAPI,
  ProductApi,
} from 'api';
import {
  AddCampaignsModalMain,
  ImageActions,
  ImageDeleteButton,
  ImageList,
  ImageUploadButton,
  ImageUploadContainer,
  ImageUploadMainContainer,
} from 'features/campaigns/role/client/elements/add-campaign-modal/styles';
import { useModal, useSnackbar } from 'hooks';
import { pick } from '@costorgroup/file-manager';
import UploadedFileModal from 'features/campaigns/role/client/elements/uploaded-file-modal';
import UsersAPI from 'api/users';
import { TCampaignPhoto } from 'features/campaigns/role/client/elements/add-campaign-modal/types';
import ChatIO from 'api/chat';

const AddCampaignModal = ({
  onClose,
  refresh,
  ...props
}: TAddCampaignModalProps) => {
  const [state, setState] = useState<any>({
    campaignName: '',
    product: [],
    client: null,
    ambassador: null,
    influencers: null,
    startDate: new Date(),
    endDate: null,
    // report: null,
    // currency: null,
    budget: '',
    campaignInfo: '',

    location: [],
    language: [],
    diseaseArea: [],
    symptoms: [],
    stakeholders: [],
    gender: [],
    age: {
      min: '',
      max: '',
    },
    ethnicity: [],
    struggles: [],
    interests: [],
    influencerSize: [],
    influencerCount: null,
    targetAudienceInfo: '',

    platform: null,
    postType: null,
    image: null,
    website: '',
    instructions: '',
  });

  const [tab, setTab] = useState(0);

  const [loading, setLoading] = useState(false);

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleNewProductTag = (v: any) => {
    setState({
      ...state,
      product: [...state.product, { value: v.label, label: v.label }],
    });
  };

  const [product, setProduct] = useState<any>([]);
  const [clients, setClients] = useState<any>();
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
  const [ambassador, setAmbassador] = useState<any>();

  const getProducts = async (s: string = '') => {
    const { result } = await ProductApi.getProducts(s);

    setProduct(
      result.map((data: any) => ({
        value: data.id,
        label: data.name,
      }))
    );
  };

  const getClients = async (s: string = '') => {
    const { result } = await ClientAPI.getClients(s);

    setClients(
      result.map((data: any) => ({
        value: data.id,
        label: `${data.firstName} ${data.lastName}`,
      }))
    );
  };

  const getClient = useCallback(async () => {
    if (state.client && state.client.value) {
      const { client } = await ClientAPI.getSingleClient(state.client.value);

      if (client && client.ambassador) {
        const response = await UsersAPI.getUser(client.ambassador.userId);

        setAmbassador({
          value: response.id,
          label: `${response.firstName} ${response.lastName}`,
        });
      } else {
        setAmbassador(null);
      }
    } else {
      setAmbassador(null);
    }
  }, [state.client?.value]);

  useEffect(() => {
    getClient();
  }, [state.client]);

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

  const [photos, setPhotos] = useState<TCampaignPhoto[]>([]);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [modal, modalOpen, modalClose] = useModal(false);
  const { push } = useSnackbar();

  const handlePhotos = async () => {
    const file: any = await pick({
      accept: 'image/jpg, image/jpeg, image/png, application/pdf',
    });

    try {
      await FileManagerApi.fileUpload(file).then(async (data) => {
        const presignedUrl = await FileManagerApi.fileDownload(data.key);

        if (
          presignedUrl &&
          presignedUrl.data &&
          file &&
          file.name &&
          file.type &&
          data &&
          data.id
        ) {
          setPhotos((prev: TCampaignPhoto[]) => [
            ...prev,
            {
              presignedUrl: presignedUrl.data,
              name: file.name,
              type: file.type,
              id: data.id,
              url: data.url,
            },
          ]);
          push('File successfully uploaded.', { variant: 'success' });
        }
      });
    } catch (error: any) {
      push('File upload failed.', { variant: 'error' });
    }
  };

  useEffect(() => {
    ChatIO.connect();

    getProducts();
    getClients();
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

    return () => {
      ChatIO.disconnect();
    };
  }, []);

  const createCampaign = async () => {
    try {
      const body = {
        name: state.campaignName,
        budget: state.budget ? parseInt(state.budget, 10) : undefined,
        diseaseAreaIds: state.diseaseArea
          ? state.diseaseArea.map((x: any) => x.value)
          : [],
        struggleIds: state.struggles
          ? state.struggles.map((x: any) => x.value)
          : [],
        stakeholderTypes: state.stakeholders
          ? state.stakeholders.map((x: any) => x.value)
          : [],
        locationIds: state.location
          ? state.location.map((x: any) => x.value)
          : [],
        languages: state.language
          ? state.language.map((x: any) => x.value)
          : [],
        ethnicityIds: state.ethnicity
          ? state.ethnicity.map((x: any) => x.value)
          : [],
        interestIds: state.interests
          ? state.interests.map((x: any) => x.value)
          : [],
        productIds: state.product ? state.product.map((x: any) => x.value) : [],
        dateStart: state.dateStart ? state.dateStart : undefined,
        dateEnd: state.dateEnd ? state.dateEnd : undefined,
        description: state.campaignInfo ? state.campaignInfo : undefined,
        influencersCount: state.influencerCount
          ? state.influencerCount
          : undefined,
        influencersSizeIds: state.influencerSize
          ? state.influencerSize.map((x: any) => x.value)
          : [],
        ageMin: state.age.min ? parseInt(state.age.min, 10) : undefined,
        ageMax: state.age.max ? parseInt(state.age.max, 10) : undefined,
        genders: state.gender ? state.gender.map((x: any) => x.value) : [],
        symptomIds: state.symptoms
          ? state.symptoms.map((x: any) => x.value)
          : [],
        targetAudienceDescription: state.targetAudienceInfo
          ? state.targetAudienceInfo
          : undefined,
        socialPlatformId: state.platform ? state.platform.value : undefined,
        postType: state.postType ? state.postType.value : undefined,
        clientCompanyWebsite: state.website ? state.website : undefined,
        instructions: state.instructions ? state.instructions : undefined,
        // report: state.report ? state.report.value : undefined,
        exampleImageUrls:
          photos.length > 0 ? photos.map((x) => x.url) : undefined,
        clientId: state.client ? state.client.value : null,
        // currencyId: state.currency ? state.currency.value : 1,
      };

      await CampaignAPI.addCampaign(body).then((data) => {
        refresh();
        push('Campaign successfully added.', { variant: 'success' });
        onClose();
      });
    } catch {
      push('Campaign add failed.', { variant: 'error' });
    }
  };

  const handleDeletePhoto = (id: number) => {
    try {
      FileManagerApi.fileDelete(id).then(() => {
        setPhotos((prev: TCampaignPhoto[]) =>
          prev.filter((item: TCampaignPhoto) => item.id !== id)
        );
        push('File successfully uploaded.', { variant: 'success' });
      });
    } catch (error: any) {
      push('File delete failed.', { variant: 'error' });
    }
  };

  const disabled = !state.campaignName || !state.client;

  return (
    <Modal
      size="medium"
      title="Create Campaign"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          disabled={disabled}
          onClick={() => {
            createCampaign();
            onClose();
          }}
        >
          Create
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack
        // style={{ height: '500px', overflowY: 'scroll', paddingRight: '10px' }}
        style={{ height: '500px', paddingRight: '10px' }}
      >
        <Tabs
          tabs={['Info', 'Target', 'Instructions']}
          value={tab}
          onValue={setTab}
        />
        {tab === 0 && (
          <AddCampaignsModalMain>
            <Input
              type="text"
              label="Campaign Name"
              placeholder="Please Enter"
              value={state.campaignName}
              onValue={(campaignName) => setState({ ...state, campaignName })}
              required
            />
            <Input
              type="multiselect"
              label="Products"
              placeholder="Please Select"
              value={state.product}
              onValue={(input) => setState({ ...state, product: input })}
              options={product}
              onSearch={debounce(getProducts, 250)}
              onNewTag={handleNewProductTag}
              loading={loading}
              noOptionsText="Press Enter to Add Yours"
            />
            <Input
              type="select"
              label="Client"
              placeholder="Please Select"
              value={state.client}
              onValue={(client) => setState({ ...state, client })}
              options={clients}
              required
              onSearch={debounce(getClients, 250)}
            />
            <Input
              type="text"
              label="Ambassador"
              placeholder="Please Select"
              value={ambassador?.label ?? 'None'}
              onValue={(input) => setState({ ...state, ambassador: input })}
              disabled
            />

            <Input
              type="date"
              label="Start Date"
              placeholder="Please Enter"
              value={state.dateStart}
              min={state.startDate}
              onValue={(dateStart) => setState({ ...state, dateStart })}
            />
            <Input
              type="date"
              label="Finish Date"
              placeholder="Please Enter"
              value={state.dateEnd}
              min={state.dateStart}
              onValue={(dateEnd) => setState({ ...state, dateEnd })}
            />
            <InputGroup
              label="Amount"
              inputRatio="100%"
              elements={[
                // {
                //   value: state.currency,
                //   onValue: (input) => setState({ ...state, currency: input }),
                //   type: 'select',
                //   placeholder: 'CHF',
                //   options: [
                //     {
                //       value: 1,
                //       label: 'EUR',
                //     },
                //     {
                //       value: 2,
                //       label: 'USD',
                //     },
                //     {
                //       value: 3,
                //       label: 'CHF',
                //     },
                //   ],
                // },
                {
                  value: state.budget,
                  onValue: (budget) => setState({ ...state, budget }),
                  startAdornment: 'CHF',
                  type: 'number',
                  placeholder: 'Please Enter',
                },
              ]}
            />
            {/* <Input
              type="select"
              label="Report"
              placeholder="Please Select"
              value={state.report}
              onValue={(input) => setState({ ...state, report: input })}
              // options={report}
            /> */}
            <GridCell columnSpan={2}>
              <Input
                multiline
                rows={5}
                type="text"
                label="Campaign Info"
                placeholder="Please Enter"
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
              placeholder="Please Select"
              value={state.location}
              onValue={(input) => setState({ ...state, location: input })}
              onSearch={debounce(getLocations, 250)}
              loading={loading}
              options={location}
            />
            <Input
              type="multiselect"
              label="Language"
              placeholder="Please Select"
              value={state.language}
              onValue={(input) => setState({ ...state, language: input })}
              options={languages}
            />
            <Input
              type="multiselect"
              label="Disease Area"
              placeholder="Please Select"
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
              placeholder="Please Select"
              value={state.stakeholders}
              onValue={(input) => setState({ ...state, stakeholders: input })}
              options={stakeholders}
            />
            <Input
              type="multiselect"
              label="Gender"
              placeholder="Please Select"
              value={state.gender}
              onValue={(input) => setState({ ...state, gender: input })}
              options={gender}
            />
            <Input
              type="min-max"
              label="Age"
              placeholder="Please Enter"
              value={state.age}
              onValue={(input) => setState({ ...state, age: input })}
            />
            <Input
              type="multiselect"
              label="Ethnicity"
              placeholder="Please Select"
              value={state.ethnicity.sort(
                (a: any, b: any) => b.value - a.value
              )}
              onValue={(input) => setState({ ...state, ethnicity: input })}
              options={ethnicity}
            />
            <Input
              type="multiselect"
              label="Struggle"
              placeholder="Please Select"
              value={state.struggles}
              onValue={(input) => setState({ ...state, struggles: input })}
              options={struggles}
            />
            <Input
              type="multiselect"
              label="Symptom"
              placeholder="Please Select"
              value={state.symptoms}
              onValue={(input) => setState({ ...state, symptoms: input })}
              options={symptoms}
            />
            <Input
              type="multiselect"
              label="Interest"
              placeholder="Please Select"
              value={state.interests}
              onValue={(input) => setState({ ...state, interests: input })}
              options={interests}
            />
            <Input
              type="multiselect"
              label="Influencer Size"
              placeholder="Please Select"
              value={state.influencerSize}
              onValue={(input) => setState({ ...state, influencerSize: input })}
              options={influencerSize}
            />
            <Input
              type="number"
              label="Influencers"
              placeholder="Please Select"
              value={state.influencerCount}
              onValue={(influencerCount) =>
                setState({ ...state, influencerCount })
              }
            />
            <GridCell columnSpan={2}>
              <Input
                multiline
                rows={4}
                type="text"
                label="Target Audience Info"
                placeholder="Please Enter"
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
              placeholder="Please Select"
              value={state.platform}
              onValue={(input) => setState({ ...state, platform: input })}
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
              placeholder="Please Select"
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
                    onClick={handlePhotos}
                    style={{ width: 'fit-content' }}
                  >
                    Upload
                  </Button>
                  {photos && photos.length
                    ? photos.map((item: TCampaignPhoto, idx: number) => {
                        const { presignedUrl, name, type, id } = item;
                        return (
                          // eslint-disable-next-line react/no-array-index-key
                          <ImageList key={idx}>
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
                              <ImageDeleteButton
                                onClick={() => handleDeletePhoto(id)}
                              >
                                X
                              </ImageDeleteButton>
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
              placeholder="Please Enter"
              value={state.website}
              onValue={(website) => setState({ ...state, website })}
            />
            <GridCell columnSpan={2}>
              <Input
                multiline
                rows={5}
                type="text"
                label="Instructions"
                placeholder="Please Enter"
                value={state.instructions}
                onValue={(instructions) => setState({ ...state, instructions })}
              />
            </GridCell>
          </AddCampaignsModalMain>
        )}
      </Stack>
    </Modal>
  );
};

export default AddCampaignModal;
