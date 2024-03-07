import React, { useEffect, useState } from 'react';
import { CurrencyFeedback, Modal, Tabs } from 'components/custom';
import {
  TAddCampaignsModalProps,
  TCampaignPhoto,
} from 'features/campaigns/role/client/elements/add-campaign-modal/types';
import {
  AddCampaignsModalMain,
  ImageDeleteButton,
  ImageActions,
  ImageUploadButton,
  ImageUploadContainer,
  ImageUploadMainContainer,
  ImageList,
} from 'features/campaigns/role/client/elements/add-campaign-modal/styles';
import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { InputLabel } from 'components/ui/input/styles';
import {
  CampaignAPI,
  ClientAPI,
  DiseaseAreaAPI,
  FileManagerApi,
  LocationAPI,
} from 'api';
import EnumsApi from 'api/enums';
import { useModal, useSnackbar } from 'hooks';
import ChatIO from 'api/chat';
import { pick } from '@costorgroup/file-manager';
import UploadedFileModal from '../uploaded-file-modal';

const AddCampaignModal = ({
  onClose,
  refresh,
  ...props
}: TAddCampaignsModalProps) => {
  const [state, setState] = useState<any>({
    campaignName: '',
    product: [],
    influencers: null,
    startDate: null,
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

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const [tab, setTab] = useState(0);

  const [loading, setLoading] = useState(false);

  // const addNewProduct = async (arr: any) => {
  //   await ClientAPI.addClientProduct(arr);
  // };

  const handleNewProductTag = (v: any) => {
    setState({
      ...state,
      product: [...state.product, { value: v.label, label: v.label }],
    });
  };

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

  const getProducts = async (s: string = '') => {
    const { result } = await ClientAPI.clientProducts(s);

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
        dateStart: state.startDate ? state.startDate : undefined,
        dateEnd: state.endDate ? state.endDate : undefined,
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
        report: state.report ? state.report.value : undefined,
        exampleImageUrls:
          photos.length > 0 ? photos.map((x) => x.url) : undefined,
      };

      await CampaignAPI.addCampaign(body).then((data) => {
        // ChatIO.createChatRoom(
        //   {
        //     isGroupRoom: true,
        //     productOrderId: data.platformProductOrder.id,
        //     productOrderChatRoomMember: 1,
        //   },
        //   () => {}
        // );

        refresh();
        onClose();
        push('Campaign successfully added.', { variant: 'success' });
      });
    } catch (e) {
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

  const disabled = !state.campaignName && !state.client;

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
              required
              placeholder="Please Enter"
              value={state.campaignName}
              onValue={(campaignName) => setState({ ...state, campaignName })}
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
              label="Start Date"
              type="date"
              placeholder="From"
              value={state.startDate}
              max={state.endDate}
              onValue={(startDate) => setState({ ...state, startDate })}
            />
            <Input
              label="End Date"
              type="date"
              placeholder="To"
              min={state.startDate}
              value={state.endDate}
              onValue={(endDate) => setState({ ...state, endDate })}
            />
            {/* <Input
              type="select"
              label="Report"
              placeholder="Please Select"
              value={state.report}
              onValue={(input) => setState({ ...state, report: input })}
              options={report}
            /> */}
            <Input
              label="Budget"
              value={state.budget}
              onValue={(budget) => setState({ ...state, budget })}
              type="number"
              placeholder="Please Enter"
              startAdornment="CHF"
            />
            <CurrencyFeedback value={state.budget} />
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
          <AddCampaignsModalMain>
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
              onSearch={debounce(getLanguages, 250)}
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
              onSearch={debounce(getStakeholders, 250)}
            />
            <Input
              type="multiselect"
              label="Gender"
              placeholder="Please Select"
              value={state.gender}
              onValue={(input) => setState({ ...state, gender: input })}
              options={gender}
              onSearch={debounce(getGenders, 250)}
            />
            <Input
              type="min-max"
              label="Age"
              placeholder="Please Select"
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
              onSearch={debounce(getEthnicities, 250)}
            />
            <Input
              type="multiselect"
              label="Struggle"
              placeholder="Please Select"
              value={state.struggles}
              onValue={(input) => setState({ ...state, struggles: input })}
              options={struggles}
              onSearch={debounce(getStruggles, 250)}
            />
            <Input
              type="multiselect"
              label="Interest"
              placeholder="Please Select"
              value={state.interests}
              onValue={(input) => setState({ ...state, interests: input })}
              options={interests}
              onSearch={debounce(getInterests, 250)}
            />
            <Input
              type="multiselect"
              label="Symptom"
              placeholder="Please Select"
              value={state.symptoms}
              onValue={(input) => setState({ ...state, symptoms: input })}
              options={symptoms}
              onSearch={debounce(getSympthoms, 250)}
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
              min={0}
              label="Influencers"
              placeholder="Please Select"
              value={state.influencerCount}
              onValue={(input) =>
                setState({ ...state, influencerCount: input > 0 ? input : 0 })
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
          <AddCampaignsModalMain>
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
                              <ImageDeleteButton
                                onClick={() => handleDeletePhoto(id)}
                              >
                                X
                              </ImageDeleteButton>
                            </ImageActions>
                            {modal &&
                              presignedUrl &&
                              activePhotoIdx === idx && (
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
