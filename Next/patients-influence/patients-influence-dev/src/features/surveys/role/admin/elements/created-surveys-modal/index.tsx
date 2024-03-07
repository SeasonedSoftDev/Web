import React, { useCallback, useEffect, useState } from 'react';
import { Chat, CurrencyFeedback, Modal, Tabs } from 'components/custom';
import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { InputLabel } from 'components/ui/input/styles';
import {
  ClientAPI,
  DiseaseAreaAPI,
  EnumsApi,
  FileManagerApi,
  LocationAPI,
  ProductApi,
  SurveyAPI,
} from 'api';
import { CampaignsTitle } from 'features/campaigns/role/admin/elements/created-campaign-modal/styles';
import { EditIcon } from 'components/svg';
import { pick } from '@costorgroup/file-manager';
import UsersAPI from 'api/users';
import { useModal, useSnackbar } from 'hooks';
import {
  AddCampaignsModalMain,
  ImageActions,
  ImageDeleteButton,
  ImageList,
  ImageUploadButton,
  ImageUploadContainer,
  ImageUploadMainContainer,
} from 'features/campaigns/role/client/elements/add-campaign-modal/styles';
import { TCampaignPhoto } from 'features/campaigns/role/client/elements/add-campaign-modal/types';
import UploadedFileModal from 'features/campaigns/role/client/elements/uploaded-file-modal';
import ChatIO from 'api/chat';
import { useAppContext } from 'context';
import { TCreateSurveysModalProps } from './types';
import { CreateSurveysModalMain } from './styles';

const CreatedSurveysModal = ({
  onClose,
  id,
  reload,
  ...props
}: TCreateSurveysModalProps) => {
  const [survey, setSurvey] = useState<any>();

  const [state, setState] = useState<any>({
    surveyName: '',
    product: [],
    participants: null,
    startDate: null,
    endDate: null,
    budget: '',
    currency: null,
    // tokens: null,
    surveyInfo: '',
    client: null,

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

    chatRoomId: null,
  });

  const [tab, setTab] = useState(0);

  const { push } = useSnackbar();
  const [photos, setPhotos] = useState<TCampaignPhoto[]>([]);
  const [modal, modalOpen, modalClose] = useModal(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [chatRooms, setChatRooms] = useState<any>();

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

  const { user } = useAppContext();

  const getListOfChatRooms = useCallback(() => {
    const array = [];

    if (
      survey &&
      survey.platformProductOrder &&
      survey.platformProductOrder.platformProductOrderChatRooms
    ) {
      for (
        let i = 0;
        i < survey.platformProductOrder.platformProductOrderChatRooms.length;
        i += 1
      ) {
        const filteredUsers =
          survey.platformProductOrder.platformProductOrderChatRooms[
            i
          ].productOrderChatRoomMembers.filter(
            (x: any) => x.userId !== user.id
          );

        const mergedChatRooms = filteredUsers.map((x: any) => ({
          value: x.productOrderChatRoomId,
          label: x.user.influencer
            ? `${x.user.firstName}`
            : `${x.user.firstName} ${x.user.lastName}`,
          influencer: !!x.user.influencer,
        }));

        array.push(...mergedChatRooms);
      }
    }

    setChatRooms(array);
  }, [survey?.platformProductOrder?.platformProductOrderChatRooms]);

  const getSurvey = async () => {
    const result = await SurveyAPI.getSurvey(id);

    setSurvey(result);
  };

  useEffect(() => {
    getSurvey();
  }, [id]);

  useEffect(() => {
    const newState = { ...state };

    if (survey && Object.keys(survey)?.length > 0) {
      newState.surveyName = survey.name;

      if (survey.instructions) {
        newState.instructions = survey.instructionsDescription;
      }

      if (survey.surveyType) {
        newState.surveyType = {
          value: survey.surveyType,
          label: 'Questionaire',
        };
      }

      if (survey.participantCount) {
        newState.participants = survey.participantCount;
      }

      // if (survey.questionCredits) {
      //   newState.questionCredits = survey.questionCredits;
      // }

      if (survey.questionCount) {
        newState.questionsCount = survey.questionCount;
      }

      // if (survey.clientSurveyTokenBalances) {
      //   newState.tokens = survey.clientSurveyTokenBalances[0]
      //     ? {
      //         value: survey.clientSurveyTokenBalances[0].tokenBalance,
      //         label: `${survey.clientSurveyTokenBalances[0].tokenBalance} Tokens`,
      //       }
      //     : null;
      // }

      if (survey.link) {
        newState.link = survey.link;
      }

      if (survey.participantsDescription) {
        newState.targetAudInfo = survey.participantsDescription;
      }

      if (survey.ageMin) {
        newState.ageRange.min = survey.ageMin;
      }

      if (survey.ageMax) {
        newState.ageRange.max = survey.ageMax;
      }

      if (survey.surveyDescription) {
        newState.surveyInfo = survey.surveyDescription;
      }

      if (survey.dateStart) {
        newState.startDate = survey.dateStart;
      }

      if (survey.dateEnd) {
        newState.endDate = survey.dateEnd;
      }

      if (survey.products) {
        newState.product = survey.products.map((x: any) => ({
          value: x.product.id,
          label: x.product.name,
        }));
      }

      if (survey.platformProductOrder.platformProductOrderLocations) {
        newState.location =
          survey.platformProductOrder.platformProductOrderLocations.map(
            (x: any) => ({
              value: x.location.id,
              label: x.location.country
                ? `${x.location.name}, ${x.location.country.name}`
                : x.location.name,
            })
          );
      }

      if (survey.platformProductOrder.platformProductOrderDiseaseAreas) {
        newState.diseaseArea =
          survey.platformProductOrder.platformProductOrderDiseaseAreas.map(
            (x: any) => ({ value: x.diseaseArea.id, label: x.diseaseArea.name })
          );
      }

      if (survey.platformProductOrder.platformProductOrderEthnicities) {
        newState.ethnicity =
          survey.platformProductOrder.platformProductOrderEthnicities.map(
            (x: any) => ({ value: x.ethnicity.id, label: x.ethnicity.name })
          );
      }

      if (survey.platformProductOrder.platformProductOrderStruggles) {
        newState.struggles =
          survey.platformProductOrder.platformProductOrderStruggles.map(
            (x: any) => ({ value: x.struggle.id, label: x.struggle.name })
          );
      }

      if (survey.platformProductOrder.platformProductOrderInterests) {
        newState.interests =
          survey.platformProductOrder.platformProductOrderInterests.map(
            (x: any) => ({ value: x.interest.id, label: x.interest.name })
          );
      }

      if (survey.platformProductOrder.platformProductOrderLanguages) {
        newState.language =
          survey.platformProductOrder.platformProductOrderLanguages.map(
            (x: any) => ({ value: x.value, label: x.name })
          );
      }

      if (survey.platformProductOrder.platformProductOrderSymptoms) {
        newState.symptoms =
          survey.platformProductOrder.platformProductOrderSymptoms.map(
            (x: any) => ({ value: x.symptom.id, label: x.symptom.name })
          );
      }

      if (survey.instructionsDescription) {
        newState.instructions = survey.instructionsDescription;
      }

      if (survey.surveyType !== null) {
        const surveyTypes = [
          'Questionaire',
          'Short Interview',
          'Long Interview',
        ];

        newState.surveyType = {
          value: survey.surveyType,
          label: surveyTypes[survey.surveyType],
        };
      }

      if (survey.platformProductOrder.budget) {
        newState.budget = survey.platformProductOrder.budget;
      }

      if (survey.platformProductOrder.platformProductOrderGenders) {
        newState.gender =
          survey.platformProductOrder.platformProductOrderGenders.map(
            (x: any) => ({
              value: x.value,
              label: x.name,
            })
          );
      }

      if (survey.exampleImages) {
        const array = survey.exampleImages.map(async (x: any) => {
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

      if (
        survey.platformProductOrder.client &&
        survey.platformProductOrder.client.user &&
        survey.platformProductOrder.client.user.lastName &&
        survey.platformProductOrder.client.user.firstName &&
        survey.platformProductOrder.client.user.id
      ) {
        newState.client = {
          value: survey.platformProductOrder.client.user.id,
          label: `${survey.platformProductOrder.client.user.firstName} ${survey.platformProductOrder.client.user.lastName}`,
        };
      }

      if (survey.stakeholderTypes) {
        newState.stakeholders = survey.stakeholderTypes.map((x: any) => ({
          value: x.value,
          label: x.name,
        }));
      }

      if (
        survey.platformProductOrder &&
        survey.platformProductOrder.platformProductOrderChatRooms
      ) {
        getListOfChatRooms();
      }

      setState(newState);
    }
  }, [survey]);

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>([]);
  const [location, setLocation] = useState<any>([]);
  const [diseaseAreas, setDiseaseAreas] = useState<any>([]);
  const [stakeholders, setStakholders] = useState<any>();
  const [gender, setGender] = useState<any>([]);
  const [ethnicity, setEthnicity] = useState<any>([]);
  const [struggles, setStruggles] = useState<any>([]);
  const [interests, setInterests] = useState<any>([]);
  const [surveyTypes, setSurveyTypes] = useState<any>([]);
  // const [tokens, setTokens] = useState<any>(null);
  const [symptoms, setSymptoms] = useState<any>();
  const [ambassador, setAmbassador] = useState<any>();

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

  const getSymptoms = async () => {
    const response = await EnumsApi.getSymptoms();

    setSymptoms(
      response.result.map((x: any) => ({
        value: x.id,
        label: x.name,
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
    getProducts();
    getClient();
    getDiseaseAreas();
    getLocations();
    getGenders();
    getEthnicities();
    getStruggles();
    getInterests();
    getSurveyTypes();
    // getSurveyTokens();
    getStakeholders();
    getSymptoms();
  }, []);

  const updateSurvey = useCallback(async () => {
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
        // tokens:
        //   state.tokens || state.tokens === 0 ? state.tokens.value : undefined,
        link: state.link ? state.link : undefined,
        languages: state.language
          ? state.language.map((x: any) => x.value)
          : [],
        clientUserId: state.client.value || undefined,
        stakeholderTypes: state.stakeholders.map((x: any) => x.value),
        symptomIds: state.symptoms.map((x: any) => x.value),
      };

      await SurveyAPI.updateSurvey(id, body).then(() => {
        push('Survey successfully added.', { variant: 'success' });
        reload();
        onClose();
      });
    } catch (e) {
      push('Survey update failed.', { variant: 'error' });
    }
  }, [state, photos]);

  const [edit, setEdit] = useState(false);

  const handleEdit = () => {
    setEdit((prev) => !prev);
  };

  // const disabled = !state.surveyName || !state.tokens;
  const disabled = !state.surveyName;

  const handleDeletePhoto = (idx: number) => {
    try {
      FileManagerApi.fileDelete(idx).then(() => {
        setPhotos((prev: TCampaignPhoto[]) =>
          prev.filter((item: TCampaignPhoto) => item.id !== idx)
        );
        push('File successfully uploaded.', { variant: 'success' });
      });
    } catch (error: any) {
      push('File delete failed.', { variant: 'error' });
    }
  };

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  return (
    <Modal
      size="medium"
      title={
        <CampaignsTitle>
          {survey && survey?.name ? survey.name : ''}
          <EditIcon
            style={
              edit
                ? { cursor: 'pointer', color: '#448DC9' }
                : { cursor: 'pointer', color: '#7E839F' }
            }
            onClick={handleEdit}
          />
        </CampaignsTitle>
      }
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => (edit ? updateSurvey() : onClose())}
          disabled={disabled}
        >
          {edit ? `Update` : `Close`}
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack style={{ height: '450px' }}>
        <Tabs
          tabs={
            survey &&
            survey.platformProductOrder &&
            survey.platformProductOrder.status !== 2
              ? ['Info', 'Target', 'Instructions', 'Chat']
              : ['Info', 'Target', 'Instructions']
          }
          value={tab}
          onValue={setTab}
        />
        {tab === 0 && (
          <CreateSurveysModalMain columns={2}>
            <Input
              type="text"
              label="Survey name"
              placeholder="Survey name"
              value={state.surveyName}
              disabled={!edit}
              onValue={(surveyName) => setState({ ...state, surveyName })}
              required
            />
            {/* {tokens && (state.tokens || state.tokens === 0) && (
              <Input
                type="select"
                label="Tokens"
                value={state.tokens}
                disabled={!edit}
                onValue={(input) => setState({ ...state, tokens: input })}
                options={tokens}
                required
              />
            )} */}
            <Input
              type="text"
              label="Client"
              placeholder="Please Select"
              value={state.client?.label}
              onValue={(client) => setState({ ...state, client })}
              disabled
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
              type="multiselect"
              label="Product"
              placeholder="Please Select"
              value={state.product}
              disabled={!edit}
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
              disabled={!edit}
              onValue={(participants) => setState({ ...state, participants })}
            />
            <Input
              type="number"
              label="Questions Count"
              placeholder="Please Enter"
              disabled={!edit}
              value={state.questionsCount}
              onValue={(questionsCount) =>
                setState({ ...state, questionsCount })
              }
            />
            {/* <Input
              type="number"
              label="Question Credits"
              disabled={!edit}
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
              disabled={!edit}
              onValue={(surveyType) => setState({ ...state, surveyType })}
              options={surveyTypes}
            />
            <Input
              type="date"
              label="Start Date"
              placeholder="From"
              value={state.startDate}
              disabled={!edit}
              max={state.endDate}
              onValue={(startDate) => setState({ ...state, startDate })}
            />
            <Input
              type="date"
              label="End Date"
              placeholder="To"
              value={state.endDate}
              disabled={!edit}
              min={state.startDate}
              onValue={(endDate) => setState({ ...state, endDate })}
            />
            <Stack>
              <Input
                type="number"
                value={state.budget}
                disabled={!edit}
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
                disabled={!edit}
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
              disabled={!edit}
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
              disabled={!edit}
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
              disabled={!edit}
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
              disabled={!edit}
              onSearch={debounce(getStakeholders, 250)}
            />
            <Input
              type="multiselect"
              label="Gender"
              placeholder="Please Select"
              value={state.gender}
              onValue={(input) => setState({ ...state, gender: input })}
              options={gender}
              disabled={!edit}
            />
            <Input
              type="min-max"
              label="Age"
              placeholder="Please Enter"
              disabled={!edit}
              value={state.ageRange}
              onValue={(ageRange) => setState({ ...state, ageRange })}
            />
            <Input
              type="multiselect"
              label="Ethnicity"
              placeholder="Please Select"
              disabled={!edit}
              value={state.ethnicity}
              onValue={(input) => setState({ ...state, ethnicity: input })}
              options={ethnicity}
            />
            <Input
              type="multiselect"
              label="Struggle"
              placeholder="Please Select"
              disabled={!edit}
              value={state.struggles}
              onValue={(input) => setState({ ...state, struggles: input })}
              options={struggles}
            />
            <Input
              type="multiselect"
              label="Symptom"
              placeholder="Please Select"
              disabled={!edit}
              value={state.symptoms}
              onValue={(input) => setState({ ...state, symptoms: input })}
              options={symptoms}
            />
            <Input
              type="multiselect"
              label="Interest"
              placeholder="Please Select"
              disabled={!edit}
              value={state.interests}
              onValue={(input) => setState({ ...state, interests: input })}
              options={interests}
            />
            <GridCell columnSpan={2}>
              <Input
                multiline
                rows={5}
                disabled={!edit}
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
              disabled={!edit}
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
                    disabled={!edit}
                    onClick={handlePhotos}
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
                              <ImageDeleteButton
                                onClick={() => {
                                  if (edit) {
                                    handleDeletePhoto(id);
                                  } else {
                                    push(
                                      'Please switch to edit mode if you want to remove the image.',
                                      { variant: 'info' }
                                    );
                                  }
                                }}
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
              multiline
              rows={5}
              disabled={!edit}
              type="text"
              label="Instructions"
              placeholder="Please Enter"
              value={state.instructions}
              onValue={(instructions) => setState({ ...state, instructions })}
            />
          </CreateSurveysModalMain>
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

            {state && state.chatRoomId && state.chatRoomId.influencer
              ? state.chatRoomId && (
                  <Input
                    type="text"
                    label="Submission"
                    placeholder="www.instagram.com/link123"
                    disabled
                    value={state.submission}
                    onValue={(submission) => setState({ ...state, submission })}
                  />
                )
              : undefined}
            <GridCell columnSpan={2}>
              {state.chatRoomId ? (
                <Chat chatRoomId={state.chatRoomId} />
              ) : (
                <span />
              )}
            </GridCell>
          </AddCampaignsModalMain>
        )}
      </Stack>
    </Modal>
  );
};

export default CreatedSurveysModal;
