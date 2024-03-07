import React, { useCallback, useEffect, useState } from 'react';
import { CurrencyFeedback, Modal, Tabs } from 'components/custom';
import { TCreateSurveysModalProps } from 'features/surveys/role/client/elements/create-surveys-modal/types';
import {
  CreateSurveysModalMain,
  ImageUploadContainer,
  ImageUploadMainContainer,
} from 'features/surveys/role/client/elements/create-surveys-modal/styles';
import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { InputLabel } from 'components/ui/input/styles';
import {
  DiseaseAreaAPI,
  EnumsApi,
  FileManagerApi,
  LocationAPI,
  ProductApi,
  SurveyAPI,
} from 'api';
import { pick } from '@costorgroup/file-manager';
import { useModal, useSnackbar } from 'hooks';
import { TCampaignPhoto } from 'features/campaigns/role/client/elements/add-campaign-modal/types';
import {
  ImageActions,
  ImageDeleteButton,
  ImageList,
  ImageUploadButton,
} from 'features/campaigns/role/client/elements/add-campaign-modal/styles';
import UploadedFileModal from 'features/campaigns/role/client/elements/uploaded-file-modal';
import ChatIO from 'api/chat';

const CreateSurveysModal = ({
  onClose,
  refresh,
  ...props
}: TCreateSurveysModalProps) => {
  const [state, setState] = useState<any>({
    surveyName: '',
    product: [],
    participants: null,
    startDate: null,
    endDate: null,
    budget: '',
    // currency: null,
    // tokens: null,
    surveyInfo: '',

    location: [],
    language: [],
    diseaseArea: [],
    gender: [],
    ageRange: {
      min: null,
      max: null,
    },
    stakeholders: [],
    ethnicity: [],
    struggles: [],
    interests: [],
    targetAudInfo: '',
    questionsCount: null,
    questionCredits: null,
    surveyType: null,
    link: '',
    materials: [],
    instructions: '',
    symptoms: [],
  });

  const [tab, setTab] = useState(0);

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>([]);
  const [location, setLocation] = useState<any>(null);
  const [diseaseAreas, setDiseaseAreas] = useState<any>(null);
  const [stakeholders, setStakholders] = useState<any>();
  const [gender, setGender] = useState<any>([]);
  const [ethnicity, setEthnicity] = useState<any>([]);
  const [struggles, setStruggles] = useState<any>([]);
  const [interests, setInterests] = useState<any>([]);
  const [surveyTypes, setSurveyTypes] = useState<any>(null);
  // const [tokens, setTokens] = useState<any>(null);
  const [symptoms, setSymptoms] = useState<any>();

  const handleNewProductTag = (v: any) => {
    setState({
      ...state,
      product: [...state.product, { value: v.label, label: v.label }],
    });
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

  const getProducts = async (s: string = '') => {
    const { result } = await ProductApi.getProducts(s);

    setProduct(
      result.map((data: any) => ({
        value: data.id,
        label: data.name,
      }))
    );
  };

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

  const getSurveyTypes = async () => {
    const result = await EnumsApi.getSurveyTypes();

    setSurveyTypes(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  // const getSurveyTokens = async () => {
  //   const result = await SurveyAPI.getTokens();

  //   setTokens(
  //     result.map((x: any) => ({
  //       value: x.value,
  //       label: `${x.value} Tokens`,
  //     }))
  //   );
  // };

  const getSympthoms = async () => {
    const response = await EnumsApi.getSymptoms();

    setSymptoms(
      response.result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  useEffect(() => {
    ChatIO.connect();

    getProducts();
    getDiseaseAreas();
    getLocations();
    getGenders();
    getEthnicities();
    getStruggles();
    getInterests();
    getSurveyTypes();
    // getSurveyTokens();
    getStakeholders();
    getSympthoms();

    return () => {
      ChatIO.disconnect();
    };
  }, []);

  // const disabled = !state.surveyName || !state.tokens;
  const disabled = !state.surveyName;

  const createSurvey = useCallback(async () => {
    try {
      const body = {
        name: state.surveyName,
        budget: state.budget ? parseInt(state.budget, 10) : undefined,
        diseaseAreaIds: state.diseaseArea
          ? state.diseaseArea.map((x: any) => x.value)
          : [],
        struggleIds: state.struggles
          ? state.struggles.map((x: any) => x.value)
          : undefined,
        locationIds: state.location
          ? state.location.map((x: any) => x.value)
          : [],
        ethnicityIds: state.ethnicity
          ? state.ethnicity.map((x: any) => x.value)
          : undefined,
        interestIds: state.interests
          ? state.interests.map((x: any) => x.value)
          : undefined,
        productIds: state.product
          ? state.product.map((x: any) => x.value)
          : undefined,
        dateStart: state.startDate ? state.startDate : undefined,
        dateEnd: state.endDate ? state.endDate : undefined,
        description: state.surveyInfo ? state.surveyInfo : undefined,
        participantsCount: state.participants
          ? parseInt(state.participants, 10)
          : undefined,
        questionsCount: state.questionsCount
          ? parseInt(state.questionsCount, 10)
          : undefined,
        ageMin: state.ageRange.min
          ? parseInt(state.ageRange.min, 10)
          : undefined,
        ageMax: state.ageRange.max
          ? parseInt(state.ageRange.max, 10)
          : undefined,
        genders: state.gender
          ? state.gender.map((x: any) => x.value)
          : undefined,
        participantsDescription: state.targetAudInfo
          ? state.targetAudInfo
          : undefined,
        surveyType: state.surveyType ? state.surveyType.value : undefined,
        exampleImageUrls:
          photos.length > 0 ? photos.map((x) => x.url) : undefined,
        instructions: state.instructions ? state.instructions : undefined,
        // tokens: state.tokens ? state.tokens.value : null,
        link: state.link ? state.link : undefined,
        languages: state.language
          ? state.language.map((x: any) => x.value)
          : [],
        stakeholderTypes: state.stakeholders.map((x: any) => x.value),
        symptomIds: state.symptoms.map((x: any) => x.value),
        // questionCredits: state.questionsCredit
        //   ? parseInt(state.questionCredits, 10)
        //   : undefined,
      };
      await SurveyAPI.createSurvey(body).then((data) => {
        ChatIO.createChatRoom(
          {
            isGroupRoom: true,
            productOrderId: data.platformProductOrder.id,
            productOrderChatRoomMember: 1,
          },
          () => {}
        );

        push('Survey successfully added.', { variant: 'success' });
        refresh();
        onClose();
      });
    } catch (e) {
      push('Survey add failed.', { variant: 'error' });
    }
  }, [state, photos]);

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

  return (
    <Modal
      size="medium"
      title="Create Survey"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          disabled={disabled}
          onClick={createSurvey}
        >
          Create
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack style={{ height: '450px', paddingRight: '10px' }}>
        <Tabs
          tabs={['Info', 'Target', 'Instructions']}
          value={tab}
          onValue={setTab}
        />
        {tab === 0 && (
          <CreateSurveysModalMain columns={2}>
            <Input
              type="text"
              label="Survey name"
              required
              placeholder="Please Enter"
              value={state.surveyName}
              onValue={(surveyName) => setState({ ...state, surveyName })}
            />
            {/* <Input
              type="select"
              label="Tokens"
              placeholder="Please Select"
              required
              value={state.tokens}
              onValue={(input) => setState({ ...state, tokens: input })}
              options={tokens}
            /> */}
            <Input
              type="multiselect"
              label="Product"
              placeholder="Please Select"
              value={state.product}
              onValue={(input) => setState({ ...state, product: input })}
              options={product}
              onSearch={debounce(getProducts, 250)}
              onNewTag={handleNewProductTag}
              loading={loading}
            />
            <Input
              type="number"
              label="Participants"
              placeholder="Please Enter"
              value={state.participants}
              onValue={(participants) => setState({ ...state, participants })}
            />
            <Input
              type="number"
              label="Questions"
              placeholder="Please Enter"
              value={state.questionsCount}
              onValue={(questionsCount) =>
                setState({ ...state, questionsCount })
              }
            />
            {/* <Input
              type="number"
              label="Question Credits"
              placeholder="Please Enter"
              value={state.questionCredits}
              onValue={(questionCredits) =>
                setState({ ...state, questionCredits })
              }
            /> */}
            <Input
              type="select"
              label="Survey Type"
              placeholder="Please Select"
              value={state.surveyType}
              onValue={(surveyType) => setState({ ...state, surveyType })}
              options={surveyTypes}
            />
            <Input
              type="date"
              label="Start Date"
              placeholder="Please Select"
              value={state.startDate}
              max={state.endDate}
              onValue={(startDate) => setState({ ...state, startDate })}
            />
            <Input
              type="date"
              label="End Date"
              placeholder="Please Select"
              value={state.endDate}
              min={state.startDate}
              onValue={(endDate) => setState({ ...state, endDate })}
            />

            <Stack>
              <Input
                type="number"
                value={state.budget}
                onValue={(budget) => setState({ ...state, budget })}
                placeholder="Please Enter"
                startAdornment="CHF"
                label="Budget"
              />
              <CurrencyFeedback value={state.budget} />
            </Stack>
            <GridCell columnSpan={2}>
              <Input
                multiline
                rows={5}
                type="text"
                label="Survey Info"
                placeholder="Please Enter"
                value={state.surveyInfo}
                onValue={(surveyInfo) => setState({ ...state, surveyInfo })}
              />
            </GridCell>
          </CreateSurveysModalMain>
        )}
        {tab === 1 && (
          <CreateSurveysModalMain columns={2}>
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
              onValue={(language) => setState({ ...state, language })}
              options={[
                {
                  value: 0,
                  label: 'English',
                },
                {
                  value: 1,
                  label: 'French',
                },
                {
                  value: 2,
                  label: 'German',
                },
                {
                  value: 3,
                  label: 'Spanish',
                },
                {
                  value: 4,
                  label: 'Italian',
                },
              ]}
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
            />
            <Input
              type="min-max"
              label="Age"
              placeholder="Please Select"
              value={state.ageRange}
              onValue={(ageRange) => setState({ ...state, ageRange })}
            />
            <Input
              type="multiselect"
              label="Ethnicity"
              placeholder="Please Select"
              value={state.ethnicity}
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
              onSearch={debounce(getSympthoms, 250)}
            />
            <Input
              type="multiselect"
              label="Interest"
              placeholder="Please Select"
              value={state.interests}
              onValue={(input) => setState({ ...state, interests: input })}
              options={interests}
            />
            <GridCell columnSpan={2}>
              <Input
                multiline
                rows={5}
                type="text"
                label="Target audience info"
                placeholder="Please Enter"
                value={state.targetAudInfo}
                onValue={(targetAudInfo) =>
                  setState({ ...state, targetAudInfo })
                }
              />
            </GridCell>
          </CreateSurveysModalMain>
        )}
        {tab === 2 && (
          <CreateSurveysModalMain columns={1}>
            <Input
              type="text"
              label="Link"
              placeholder="Please Enter"
              value={state.link}
              onValue={(link) => setState({ ...state, link })}
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
              multiline
              rows={5}
              type="text"
              label="Instructions"
              placeholder="Please Enter"
              value={state.instructions}
              onValue={(instructions) => setState({ ...state, instructions })}
            />
          </CreateSurveysModalMain>
        )}
      </Stack>
    </Modal>
  );
};

export default CreateSurveysModal;
