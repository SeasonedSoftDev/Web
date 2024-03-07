import { Tooltip } from '@mui/material';
import { BarChart, ExtendedLineChart, MatrixChart } from 'components/csr';
import {
  CardWithText,
  Note,
  ProgressDisplay,
  Status,
  CheckboxTable,
  Tabs,
  CampaignsCard,
  Title,
  Table,
  CardWithTextNew,
} from 'components/custom';
import { HomeInfluencerPageGrid } from 'features/home/styles';
import { TColor } from 'components/custom/status/types';
import { TTableRenderItemObject } from 'components/custom/table/types';
import { DotsIcon, InfoIcon } from 'components/svg';
import { Grid, GridCell, Stack } from 'components/system';
import { Button, InputGroup, Pagination } from 'components/ui';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ACampaignItems,
  IPCampaignItems,
} from 'features/home/role/influencer/data';
import Theme from 'theme';
import { useAppContext } from 'context';
import { IInfluencer } from 'api/influencer/types';
import { IUser } from 'api/users/types';
import { usePagination, useSnackbar } from 'hooks';
import {
  TPostTypeResult,
  TSelectFieldType,
} from 'features/discover-influencers/role/admin/elements/influencer-profile/types';
import { ISelectFieldType } from 'features/account/role/ambasador/types';
import { CampaignAPI, EnumsApi, InsightsAPI, SurveyAPI } from 'api';
import Chip from 'components/ui/chip';
import { ProductOrderInfluencerStatus } from 'api/platformProduct/enums';
import { hasEndDatePassed } from 'utilities/calendar';
import InfluencerProductStatusChips from 'components/custom/InfluencerProductStatusChips';
import { ChartWrapper, CustomStack, GridCellCustom } from './styles';
import InfluencerHomeActions from './elements/actions/available-campaigns';
import InfluencerAPI from '../../../../api/influencer';
import InfluencerHomeAvSurveyActions from './elements/actions/available-surveys';

type TPostAmount = {
  id: number;
  desiredAmount: number;
  postType: number;
};

type TSurveyAmount = {
  id: number;
  desiredAmount: number;
  surveyType: number;
};

type TSelectedType = {
  value: number;
  label: string;
};

const HomePage = () => {
  const [postOptions, setPostOptions] = useState<ISelectFieldType[]>([]);
  const [interviewOptions, setInterviewOptions] = useState<ISelectFieldType[]>(
    []
  );
  const [questionnaireOptions, setQuestionnaireOptions] = useState<
    ISelectFieldType[]
  >([]);
  const [inPrepCampaings, setInPrepCampaigns] = useState<any[]>([]);
  const [ongoingCampaings, setOngoingCampaings] = useState<any[]>([]);
  const [availableSurveys, setAvailableSurveys] = useState<any[]>([]);
  const [inProgressSurveys, setInProgressSurveys] = useState<any[]>([]);

  const [selectedPostOption, setSelectedPostOption] =
    useState<ISelectFieldType | null>(null);
  const [initialSelectedPostOption, setInitialPostOption] =
    useState<TSelectedType>();

  const [selectedQuestionnaireOption, setSelectedQuestionnaireOption] =
    useState<TSelectedType | null>(null);
  const [initialSelectedQuestionnaireOption, setInitialQuestionnaireOption] =
    useState<TSelectedType>();

  const [selectedInterviewOption, setSelectedInterviewOption] =
    useState<TSelectedType | null>(null);
  const [initialSelectedInterviewOption, setInitialInterviewOption] =
    useState<TSelectedType>();

  const [post, setPost] = useState<ISelectFieldType>();
  const [interview, setInterview] = useState<ISelectFieldType>();
  const [questionnaire, setQuestionnaire] = useState<ISelectFieldType>();

  const [postAmountToSend, setPostAmountToSend] = useState(0);
  const [interviewAmountToSend, setInterviewAmountToSend] = useState(0);
  const [questionnaireAmountToSend, setQuestionnaireAmountToSend] = useState(0);

  const handleCurrencyCalculation = (
    amount: number,
    currency: 'EUR' | 'USD' | 'CHF' = 'CHF'
  ): number => {
    let formattedAmount = 0;

    if (currency === 'EUR') {
      formattedAmount = amount * 1.03;
    }
    if (currency === 'USD') {
      formattedAmount = amount * 1.11;
    }

    if (currency === 'CHF') {
      formattedAmount = amount; // Assumes the amount is already in euros for other currencies
    }

    return +formattedAmount.toFixed(0);
  };

  const [tabsC, setTabsC] = useState(0);
  const [tabsSM, setTabsSM] = useState(0);
  const [tabsS, setTabsS] = useState(0);
  const [tabsCA, setTabsCA] = useState(0);
  const [tabsI, setTabIS] = useState(0);
  const [tabsIA, setTabsIA] = useState(0);

  const { push } = useSnackbar();

  const { currency, user } = useAppContext();

  const [postAmounts, setPostAmounts] = useState<TSelectFieldType[]>();
  const [questionaireAmounts, setQuestionaireAmounts] =
    useState<TSelectFieldType[]>();
  const [interviewAmounts, setInterviewAmounts] =
    useState<TSelectFieldType[]>();

  const [influencer, setInfluencer] = useState<IUser>();

  const [filterACampaignParams, setFilterACampaignParams] = useState({
    status: 0,
  });
  const [filterIPCampaignParams, setFilterIPCampaignParams] = useState({
    status: 1,
  });
  const [filterASurveyParams, setFilterASurveyParams] = useState({
    status: 0,
  });

  const [filterIPSurveyParams, setFilterIPSurveyParams] = useState({
    status: 1,
  });

  const formatPostAmounts = useCallback(
    (
      influencerData: IInfluencer,
      postTypes: TPostTypeResult[],
      surveyTypes: TPostTypeResult[]
    ) => {
      const { influencerCampaignAmounts, influencerSurveyAmounts } =
        influencerData;

      const postAmountsResults: TSelectFieldType[] = [];
      const questionnaireAmountResult: ISelectFieldType[] = [];
      const interviewAmountResult: ISelectFieldType[] = [];

      let postAmountAvailableOptions: ISelectFieldType[] = [];
      let questionnaireAvailableOptions: ISelectFieldType[] = [];
      let interviewAvailableOptions: ISelectFieldType[] = [];

      influencerCampaignAmounts.map((campaign) =>
        postAmountsResults.push({
          label: `${campaign.desiredAmount}`,
          value: campaign.postType,
        })
      );

      if (postAmountsResults.length) {
        postAmountAvailableOptions = postTypes
          .filter((postType) =>
            postAmountsResults.some(
              (postValue) => postValue.value === postType.value
            )
          )
          .map((postType) => ({
            label: postType.name,
            value: postType.value,
          }));
      }

      setPostOptions(postAmountAvailableOptions);

      if (postAmountsResults.length) {
        const initPost = postAmountAvailableOptions.reduce(
          (minElement, currentElement) => {
            if (currentElement.value < minElement.value) {
              return currentElement;
            }
            return minElement;
          }
        );

        setInitialPostOption({
          label: initPost.label,
          value: initPost.value,
        });
        setSelectedPostOption({
          label: initPost.label,
          value: initPost.value,
        });
      }

      influencerSurveyAmounts.map((survey) => {
        if (surveyTypes[survey.surveyType].name === 'Questionnaire') {
          return questionnaireAmountResult.push({
            label: `${survey.desiredAmount}`,
            value: survey.surveyType,
          });
        }
        return interviewAmountResult.push({
          label: `${survey.desiredAmount}`,
          value: survey.surveyType,
        });
      });

      if (questionnaireAmountResult.length) {
        questionnaireAvailableOptions = surveyTypes
          .filter((surveyType) =>
            questionnaireAmountResult.some(
              (surveyValue) => surveyValue.value === surveyType.value
            )
          )
          .map((postType) => ({
            label: postType.name,
            value: postType.value,
          }));
      }
      setQuestionnaireOptions(questionnaireAvailableOptions);

      if (questionnaireAmountResult.length) {
        setInitialQuestionnaireOption({
          label: questionnaireAvailableOptions[0].label,
          value: questionnaireAvailableOptions[0].value,
        });

        setSelectedQuestionnaireOption({
          label: questionnaireAvailableOptions[0].label,
          value: questionnaireAvailableOptions[0].value,
        });
      }

      if (interviewAmountResult.length) {
        interviewAvailableOptions = surveyTypes
          .filter((surveyType) =>
            interviewAmountResult.some(
              (surveyValue) => surveyValue.value === surveyType.value
            )
          )
          .map((surveyType) => ({
            label:
              surveyType.name === 'Short Interview'
                ? '30 min Interview'
                : '60 min Interview',
            value: surveyType.value,
          }));
      }
      setInterviewOptions(interviewAvailableOptions);

      if (interviewAmountResult.length) {
        const initInterview = interviewAvailableOptions.reduce(
          (minElement, currentElement) => {
            if (currentElement.value < minElement.value) {
              return currentElement;
            }
            return minElement;
          }
        );

        setInitialInterviewOption({
          label: initInterview.label,
          value: initInterview.value,
        });
        setSelectedInterviewOption({
          label: initInterview.label,
          value: initInterview.value,
        });
      }

      setPostAmounts(postAmountsResults);
      setQuestionaireAmounts(questionnaireAmountResult);
      setInterviewAmounts(interviewAmountResult);
    },
    [
      influencer,
      postAmounts,
      questionaireAmounts,
      interviewAmounts,
      selectedInterviewOption,
      initialSelectedInterviewOption,
      initialSelectedPostOption,
      selectedPostOption,
      postOptions,
    ]
  );

  const getInfluencerData = async () => {
    try {
      const { id } = user;
      const influencerResponse = await InfluencerAPI.getSingleInfluencer(id);
      setInfluencer(influencerResponse);
    } catch (error) {
      console.log('error', error);
    }
  };

  const getPostTypes = async (userId: number) => {
    const postResults = await EnumsApi.getPostTypes(userId);

    return postResults;
  };

  const getSurveyTypes = async () => {
    const surveyResults = await EnumsApi.getSurveyTypes();

    return surveyResults;
  };

  const updatePostAmount = async () => {
    const postAmountObj =
      influencer?.influencer.influencerCampaignAmounts?.find(
        (campaignEl) => campaignEl.postType === selectedPostOption?.value
      );
    if (postAmountObj && influencer && selectedPostOption) {
      const postAmountQuery: TPostAmount = {
        desiredAmount: +postAmountToSend,
        id: postAmountObj.id,
        postType: selectedPostOption.value,
      };

      try {
        await InfluencerAPI.addCampaignDesiredIncome(influencer.id, [
          postAmountQuery,
        ]);
        push(`Sucessfully Updated ${selectedPostOption.label}.`, {
          variant: 'success',
        });
        getInfluencerData();
      } catch {
        push('Something went wrong!', { variant: 'error' });
      }
    }
  };

  const updateInterviewAmount = async () => {
    const interviewAmountObj =
      influencer?.influencer.influencerSurveyAmounts?.find(
        (surveyEl) => surveyEl.surveyType === selectedInterviewOption?.value
      );
    if (interviewAmountObj && influencer && selectedInterviewOption) {
      const interviewAmountQuery: TSurveyAmount = {
        desiredAmount: +interviewAmountToSend,
        id: interviewAmountObj.id,
        surveyType: selectedInterviewOption?.value,
      };

      try {
        await InfluencerAPI.addSurveyDesiredIncome(influencer.id, [
          interviewAmountQuery,
        ]);
        push(`Sucessfully Updated ${selectedInterviewOption.label}.`, {
          variant: 'success',
        });
        getInfluencerData();
      } catch {
        push('Something went wrong!', { variant: 'error' });
      }
    }
  };

  const updateQuestionnaireAmount = async () => {
    const questionnaireAmountObj =
      influencer?.influencer.influencerSurveyAmounts?.find(
        (surveyEl) => surveyEl.surveyType === selectedQuestionnaireOption?.value
      );
    if (questionnaireAmountObj && influencer && selectedQuestionnaireOption) {
      const questionnaireAmountQuery: TSurveyAmount = {
        desiredAmount: +questionnaireAmountToSend,
        id: questionnaireAmountObj.id,
        surveyType: selectedQuestionnaireOption.value,
      };

      try {
        await InfluencerAPI.addSurveyDesiredIncome(influencer.id, [
          questionnaireAmountQuery,
        ]);
        push(`Sucessfully Updated ${selectedQuestionnaireOption.label}.`, {
          variant: 'success',
        });
        getInfluencerData();
      } catch {
        push('Something went wrong!', { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    getInfluencerData();
  }, []);

  useEffect(() => {
    if (selectedPostOption) {
      if (postAmounts && postAmounts.length) {
        const selectPost = postAmounts.find(
          (posts) => +selectedPostOption.value === posts.value
        );
        setPost(selectPost);
      }
    }
  }, [selectedPostOption, postAmounts]);

  useEffect(() => {
    if (selectedQuestionnaireOption) {
      if (questionaireAmounts && questionaireAmounts.length) {
        const selectQuestionaire = questionaireAmounts.find(
          (questionnaires) =>
            +selectedQuestionnaireOption.value === questionnaires.value
        );
        setQuestionnaire(selectQuestionaire);
      }
    }
  }, [selectedQuestionnaireOption, questionaireAmounts]);

  useEffect(() => {
    if (selectedInterviewOption) {
      if (interviewAmounts && interviewAmounts.length) {
        const selectedInterview = interviewAmounts.find(
          (interviews) => +selectedInterviewOption.value === interviews.value
        );
        setInterview(selectedInterview);
      }
    }
  }, [selectedInterviewOption, interviewAmounts]);

  useEffect(() => {
    if (post) {
      setPostAmountToSend(+post.label);
    }

    if (interview) {
      setInterviewAmountToSend(+interview.label);
    }

    if (questionnaire) {
      setQuestionnaireAmountToSend(+questionnaire.label);
    }
  }, [post, interview, questionnaire]);

  const {
    pagesCount: pagesACCount,
    page: aCPage,
    setTotalResults: setTotalACResults,
    handlePageChange: handleACPageChange,
    reload: aCReload,
  } = usePagination({
    limit: 5,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta } = await CampaignAPI.getCampaigns({
        limit: params.limit,
        skip: params.skip,
        ...filterACampaignParams,
      });

      setPage(params.page);

      setInPrepCampaigns(result);
      setTotalACResults(meta.countFiltered);
    },
  });

  const {
    pagesCount: pagesIPCCount,
    page: iPCPage,
    setTotalResults: setTotalIPCResults,
    handlePageChange: handleIPCPageChange,
    reload: iPCReload,
  } = usePagination({
    limit: 5,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta } = await CampaignAPI.getCampaigns({
        limit: params.limit,
        skip: params.skip,
        ...filterIPCampaignParams,
      });

      setPage(params.page);

      setOngoingCampaings(result);
      setTotalIPCResults(meta.countFiltered);
    },
  });

  const {
    pagesCount: pagesASCount,
    page: aSPage,
    setTotalResults: setTotalASResults,
    handlePageChange: handleASPageChange,
    reload: aSReload,
  } = usePagination({
    limit: 5,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta } = await SurveyAPI.getSurveys({
        limit: params.limit,
        skip: params.skip,
        ...filterASurveyParams,
      });

      setPage(params.page);

      setAvailableSurveys(result);
      setTotalASResults(meta.countFiltered);
    },
  });

  const {
    pagesCount: pagesIPSCount,
    page: iPSPage,
    setTotalResults: setTotalIPSResults,
    handlePageChange: handleIPSPageChange,
    reload: IPSReload,
  } = usePagination({
    limit: 5,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta } = await SurveyAPI.getSurveys({
        limit: params.limit,
        skip: params.skip,
        ...filterIPSurveyParams,
      });

      setPage(params.page);

      setInProgressSurveys(result);
      setTotalIPSResults(meta.countFiltered);
    },
  });

  useEffect(() => {
    if (influencer) {
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
          formatPostAmounts(
            influencer.influencer,
            postTypesResult.value,
            surveyTypesResult.value
          );
        }
      });
    }
  }, [influencer]);

  const renderACItem = ({ headItem, row, cell }: TTableRenderItemObject) => {
    if (headItem.reference === 'campaign') {
      return row.data.name;
      // return row.data.exampleImages &&
      //   row.data.exampleImages.length &&
      //   row.data.exampleImages[0].imageUrl ? (
      //   <CampaignsCard
      //     image={row.data.exampleImages[0].imageUrl}
      //     company={row.data.name}
      //     app="App placeholder"
      //   />
      // ) : (
      //   row.data.name
      // );
    }
    if (headItem.reference === 'status') {
      if (
        (row.data.dateEnd && !hasEndDatePassed(row.data.dateEnd)) ||
        !row.data.dateEnd
      ) {
        if (
          (row.data.platformProductOrder.platformProductOrderInfluencers[0]
            .status === ProductOrderInfluencerStatus.ToBeAnswered ||
            row.data.platformProductOrder.platformProductOrderInfluencers[0]
              .status === ProductOrderInfluencerStatus.ToBeSubmitted) &&
          row.data.platformProductOrder.status === 0
        ) {
          return <Chip type="default" size="small" label="Pending" />;
        }
        return (
          <InfluencerProductStatusChips
            status={
              row.data.platformProductOrder.platformProductOrderInfluencers[0]
                .status
            }
          />
        );
      }
      return <Chip type="danger" size="small" label="Ended" />;
    }
    if (headItem.reference === 'actions') {
      return (
        <InfluencerHomeActions
          data={row.data}
          status={
            row.data.platformProductOrder.platformProductOrderInfluencers[0]
              .status
          }
          reload={aCReload}
        />
      );
    }

    return '';
  };

  const renderIPCItem = ({ headItem, row, cell }: TTableRenderItemObject) => {
    if (headItem.reference === 'campaign') {
      return row.data.name;
    }
    if (headItem.reference === 'status') {
      if (
        (row.data.dateEnd && !hasEndDatePassed(row.data.dateEnd)) ||
        !row.data.dateEnd
      ) {
        return (
          <InfluencerProductStatusChips
            status={
              row.data.platformProductOrder.platformProductOrderInfluencers[0]
                .status
            }
          />
        );
      }
      return <Chip type="danger" size="small" label="Ended" />;
    }

    if (headItem.reference === 'actions') {
      return (
        <InfluencerHomeActions
          data={row.data}
          reload={iPCReload}
          status={
            row.data.platformProductOrder.platformProductOrderInfluencers[0]
              .status
          }
        />
      );
    }

    return '';
  };

  const reloadSurveyTables = async () => {
    aSReload();
    IPSReload();
  };

  const renderASItem = ({ headItem, row, cell }: TTableRenderItemObject) => {
    if (headItem.reference === 'campaign') {
      return row.data.name;
      // return row.data.exampleImages ? (
      //   <CampaignsCard
      //     image={row.data.exampleImages[0].imageUrl}
      //     company={row.data.name}
      //     app="App placeholder"
      //   />
      // ) : (
      //   row.data.name
      // );
    }
    if (headItem.reference === 'status') {
      if (
        row.data.platformProductOrder.platformProductOrderInfluencers[0]
          .status === ProductOrderInfluencerStatus.ToBeAnswered &&
        row.data.platformProductOrder.status === 0
      ) {
        return <Chip type="default" size="small" label="Pending" />;
      }
      return (
        <InfluencerProductStatusChips
          status={
            row.data.platformProductOrder.platformProductOrderInfluencers[0]
              .status
          }
        />
      );
    }

    if (headItem.reference === 'actions') {
      return (
        <InfluencerHomeAvSurveyActions
          data={row.data.id}
          reload={reloadSurveyTables}
          status={
            row.data.platformProductOrder.platformProductOrderInfluencers[0]
              .status
          }
        />
      );
    }

    return '';
  };

  return (
    <Stack>
      <HomeInfluencerPageGrid>
        <GridCell columnSpan={2} style={{ gap: '20px' }}>
          <CardWithTextNew
            title="Campaigns"
            headerColumnTable={
              <CustomStack>
                <Tabs
                  tabs={['Available', 'In Progress']}
                  value={tabsC}
                  onValue={setTabsC}
                />
                {tabsC === 0 && (
                  <>
                    <Table
                      head={ACampaignItems}
                      items={inPrepCampaings}
                      renderItem={renderACItem}
                    />
                    <Pagination
                      style={{
                        paddingTop: 'unset',
                        marginTop: 'auto',
                        justifyContent: 'right',
                      }}
                      onChange={(_e, x) => handleACPageChange(x)}
                      page={aCPage}
                      count={pagesACCount}
                    />
                  </>
                )}
                {tabsC === 1 && (
                  <>
                    <Table
                      head={IPCampaignItems}
                      items={ongoingCampaings}
                      renderItem={renderIPCItem}
                    />
                    <Pagination
                      style={{
                        paddingTop: 'unset',
                        marginTop: 'auto',
                        justifyContent: 'right',
                      }}
                      onChange={(_e, x) => handleIPCPageChange(x)}
                      page={iPCPage}
                      count={pagesIPCCount}
                    />
                  </>
                )}
              </CustomStack>
            }
          >
            <CustomStack>
              <>
                <Title
                  title="Competitive Analysis"
                  style={{
                    fontSize: '20px',
                    color: '#37428A',
                    fontWeight: '500',
                  }}
                />
                <Tabs
                  style={{ minHeight: 'unset' }}
                  tabs={['Instagram']}
                  value={tabsSM}
                  onValue={setTabsSM}
                />
                <Note showIcon={false} style={{ minHeight: '48px' }}>
                  <InfoIcon
                    style={{
                      marginRight: '5px',
                      width: '17px',
                      height: '17px',
                      alignContent: 'center',
                      display: 'inline-flex',
                      position: 'absolute',
                      top: '2px',
                    }}
                  />
                  <span style={{ marginLeft: '25px' }}>
                    Influencers with an audience your size, asks for for
                    <span style={{ color: '#448DC9' }}>21-25 {currency}</span>
                    per
                    <span style={{ color: '#448DC9' }}>
                      {selectedPostOption
                        ? selectedPostOption.label
                        : 'Post not selected'}
                    </span>
                    on average.
                  </span>
                </Note>
                <ChartWrapper>
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
                        color: `${Theme.palette.secondary.main}40`,
                        values: [5, 10, 15, 20, 25, 18, 13, 8, 3, 1],
                      },
                    ]}
                    verticalLabel="Number of Influencers"
                    horizontalLabel="Amount Per Post"
                  />
                </ChartWrapper>
                <GridCellCustom columnSpan={4}>
                  <InputGroup
                    label={
                      selectedPostOption
                        ? `Desired amount per ${selectedPostOption.label}`
                        : 'No post amounts'
                    }
                    inputRatio="150px 100px"
                    inputGroupElementStyle={{ gap: '5px' }}
                    elements={[
                      {
                        value: selectedPostOption,
                        onValue: (postOption) => {
                          if (postOption) {
                            setSelectedPostOption(postOption);
                          } else {
                            setSelectedPostOption(initialSelectedPostOption!);
                          }
                        },
                        type: 'select',
                        placeholder: 'Post amounts',
                        options: postOptions,
                        disabled: !selectedPostOption,
                      },
                      {
                        value: postAmountToSend,
                        onValue: (currencyVal) => {
                          setPostAmountToSend(currencyVal);
                        },
                        disabled: !selectedPostOption,
                        type: 'number',
                        placeholder: 'CHF',
                        endAdornment: '₣',
                      },
                    ]}
                  />
                  <Button
                    style={{
                      width: '150px',
                      height: '39px',
                      marginLeft: '10px',
                    }}
                    variant="contained"
                    color="primary"
                    onClick={updatePostAmount}
                    disabled={!selectedPostOption}
                  >
                    Save
                  </Button>
                </GridCellCustom>
                {currency !== 'CHF' && +postAmountToSend !== 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      font: 'IBM Plex Sans',
                      color: '#7E839F',
                      fontSize: '11px',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '13px',
                        height: '13px',
                        alignContent: 'center',
                        justifyContent: 'center',
                        paddingTop: '2px',
                      }}
                    >
                      <InfoIcon />
                    </div>
                    <p style={{ paddingLeft: '3px' }}>
                      {postAmountToSend} CHF is approximately
                    </p>
                    <p
                      style={{
                        paddingLeft: '3px',
                        color: '#448DC9',
                        fontWeight: '600',
                      }}
                    >
                      {handleCurrencyCalculation(
                        postAmountToSend,
                        currency as 'CHF' | 'EUR' | 'USD'
                      )}{' '}
                      {currency}.
                    </p>
                  </div>
                ) : undefined}
              </>
            </CustomStack>
          </CardWithTextNew>
        </GridCell>
        <GridCell columnSpan={2} style={{ gap: '20px' }}>
          <CardWithTextNew
            title="Surveys"
            headerColumnTable={
              <CustomStack>
                <Tabs
                  tabs={['Available', 'In Progress']}
                  value={tabsS}
                  onValue={setTabsS}
                />
                {tabsS === 0 && (
                  <>
                    <Table
                      head={[
                        {
                          reference: 'campaign',
                          label: 'Campaign',
                          visible: true,
                        },
                        {
                          reference: 'status',
                          label: 'Status',
                          visible: true,
                        },
                        {
                          reference: 'actions',
                          label: '',
                          visible: true,
                        },
                      ]}
                      items={availableSurveys}
                      renderItem={renderASItem}
                    />
                    <Pagination
                      style={{
                        paddingTop: 'unset',
                        marginTop: 'auto',
                        justifyContent: 'right',
                      }}
                      onChange={(_e, x) => handleASPageChange(x)}
                      page={aSPage}
                      count={pagesASCount}
                    />
                  </>
                )}
                {tabsS === 1 && (
                  <>
                    <Table
                      head={[
                        {
                          reference: 'campaign',
                          label: 'Campaign',
                          visible: true,
                        },
                        {
                          reference: 'status',
                          label: 'Status',
                          visible: true,
                        },
                        {
                          reference: 'actions',
                          label: '',
                          visible: true,
                        },
                      ]}
                      items={inProgressSurveys}
                      renderItem={renderASItem}
                    />
                    <Pagination
                      style={{
                        paddingTop: 'unset',
                        marginTop: 'auto',
                        justifyContent: 'right',
                      }}
                      onChange={(_e, x) => handleIPSPageChange(x)}
                      page={iPSPage}
                      count={pagesIPSCount}
                    />
                  </>
                )}
              </CustomStack>
            }
          >
            <CustomStack>
              <Title
                title="Competitive Analysis"
                style={{
                  fontSize: ' 20px',
                  color: '#37428A',
                  fontWeight: '500',
                }}
              />
              <Tabs
                style={{ minHeight: 'unset' }}
                tabs={['Questionnaire', 'Interview']}
                value={tabsIA}
                onValue={setTabsIA}
              />
              {tabsIA === 0 && (
                <>
                  <Note showIcon={false} style={{ minHeight: '48px' }}>
                    <InfoIcon
                      style={{
                        marginRight: '5px',
                        width: '17px',
                        height: '17px',
                        alignContent: 'center',
                        display: 'inline-flex',
                        position: 'absolute',
                        top: '2px',
                      }}
                    />
                    <span style={{ marginLeft: '25px' }}>
                      Patients asks for{' '}
                      <span style={{ color: '#448DC9' }}>1-2.5 {currency}</span>{' '}
                      per{' '}
                      <span style={{ color: '#448DC9' }}>Question Credit</span>{' '}
                      on average.
                    </span>
                  </Note>
                  <ChartWrapper>
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
                          color: `${Theme.palette.secondary.main}40`,
                          values: [5, 10, 15, 20, 25, 18, 13, 8, 3, 1],
                        },
                      ]}
                      verticalLabel="Number of Influencers"
                      horizontalLabel="Amount Per Post"
                    />
                  </ChartWrapper>
                  <GridCellCustom columnSpan={4}>
                    <InputGroup
                      label={
                        selectedQuestionnaireOption
                          ? `Desired amount per ${selectedQuestionnaireOption.label}`
                          : 'Question credit not set'
                      }
                      inputRatio="150px 100px"
                      inputGroupElementStyle={{ gap: '5px' }}
                      elements={[
                        {
                          value: selectedQuestionnaireOption,
                          onValue: (questionnaireOption) => {
                            if (questionnaireOption) {
                              setSelectedQuestionnaireOption(
                                questionnaireOption
                              );
                            } else {
                              setSelectedQuestionnaireOption(
                                initialSelectedQuestionnaireOption!
                              );
                            }
                          },
                          type: 'select',
                          placeholder: 'Question Credit',
                          options: questionnaireOptions,
                          disabled: !selectedQuestionnaireOption,
                        },
                        {
                          value: questionnaireAmountToSend,
                          onValue: (currencyVal) =>
                            setQuestionnaireAmountToSend(currencyVal),
                          type: 'number',
                          placeholder: 'CHF',
                          endAdornment: '₣',
                          disabled: !selectedQuestionnaireOption,
                        },
                      ]}
                    />
                    <Button
                      style={{
                        width: '150px',
                        height: '39px',
                        marginLeft: '10px',
                      }}
                      variant="contained"
                      color="primary"
                      onClick={updateQuestionnaireAmount}
                    >
                      Save
                    </Button>
                  </GridCellCustom>
                  {currency !== 'CHF' && +questionnaireAmountToSend ? (
                    <div
                      style={{
                        display: 'flex',
                        font: 'IBM Plex Sans',
                        color: '#7E839F',
                        fontSize: '11px',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '13px',
                          height: '13px',
                          alignContent: 'center',
                          justifyContent: 'center',
                          paddingTop: '2px',
                        }}
                      >
                        <InfoIcon />
                      </div>
                      <p style={{ paddingLeft: '3px' }}>
                        {questionnaireAmountToSend} CHF is approximately
                      </p>
                      <p
                        style={{
                          paddingLeft: '3px',
                          color: '#448DC9',
                          fontWeight: '600',
                        }}
                      >
                        {handleCurrencyCalculation(
                          questionnaireAmountToSend,
                          currency as 'CHF' | 'EUR' | 'USD'
                        )}{' '}
                        {currency}.
                      </p>
                    </div>
                  ) : undefined}
                </>
              )}

              {tabsIA === 1 && (
                <>
                  <Note showIcon={false} style={{ minHeight: '48px' }}>
                    <InfoIcon
                      style={{
                        marginRight: '5px',
                        width: '17px',
                        height: '17px',
                        alignContent: 'center',
                        display: 'inline-flex',
                        position: 'absolute',
                        top: '2px',
                      }}
                    />
                    <span style={{ marginLeft: '25px' }}>
                      Participants asks
                      <span style={{ color: '#448DC9' }}>23-25 USD</span>
                      per
                      <span style={{ color: '#448DC9' }}>
                        {/* eslint-disable-next-line no-nested-ternary */}
                        {!selectedInterviewOption
                          ? '30 min Interview and 60 min interview'
                          : selectedInterviewOption.label === '30 min Interview'
                          ? '30 min Interview'
                          : '60 min interview'}
                      </span>
                      on average.
                    </span>
                  </Note>
                  <ChartWrapper>
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
                          color: `${Theme.palette.secondary.main}40`,
                          values: [5, 10, 15, 20, 25, 18, 13, 8, 3, 1],
                        },
                      ]}
                      verticalLabel="Number of Influencers"
                      horizontalLabel="Amount Per Post"
                    />
                  </ChartWrapper>
                  <GridCellCustom columnSpan={4}>
                    <InputGroup
                      label={
                        selectedInterviewOption
                          ? `Desired amount per ${selectedInterviewOption.label}`
                          : 'Interviews not set'
                      }
                      inputRatio="185px 100px"
                      elements={[
                        {
                          value: selectedInterviewOption,
                          onValue: (interviewOption) => {
                            if (interviewOption) {
                              setSelectedInterviewOption(interviewOption);
                            } else {
                              setSelectedInterviewOption(
                                initialSelectedInterviewOption!
                              );
                            }
                          },
                          type: 'select',
                          placeholder: 'Interviews',
                          options: interviewOptions,
                          disabled: !selectedInterviewOption,
                        },
                        {
                          value: interviewAmountToSend,
                          onValue: (currencyVal) =>
                            setInterviewAmountToSend(currencyVal),
                          type: 'number',
                          placeholder: 'CHF',
                          endAdornment: '₣',
                          disabled: !selectedInterviewOption,
                        },
                      ]}
                    />
                    <Button
                      style={{
                        width: '150px',
                        height: '39px',
                        marginLeft: '10px',
                      }}
                      onClick={updateInterviewAmount}
                      variant="contained"
                      color="primary"
                      disabled={!selectedInterviewOption}
                    >
                      Save
                    </Button>
                  </GridCellCustom>
                  {currency !== 'CHF' && +interviewAmountToSend ? (
                    <div
                      style={{
                        display: 'flex',
                        font: 'IBM Plex Sans',
                        color: '#7E839F',
                        fontSize: '11px',
                      }}
                    >
                      <p style={{ paddingLeft: '3px' }}>
                        {interviewAmountToSend} CHF is approximately
                      </p>
                      <p
                        style={{
                          paddingLeft: '3px',
                          color: '#448DC9',
                          fontWeight: '600',
                        }}
                      >
                        {handleCurrencyCalculation(
                          interviewAmountToSend,
                          currency as 'CHF' | 'EUR' | 'USD'
                        )}{' '}
                        {currency}.
                      </p>
                    </div>
                  ) : undefined}
                </>
              )}
            </CustomStack>
          </CardWithTextNew>
        </GridCell>
      </HomeInfluencerPageGrid>
    </Stack>
  );
};

export default HomePage;
