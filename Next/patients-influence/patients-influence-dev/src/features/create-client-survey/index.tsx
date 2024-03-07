import { CardWithText, Chat, CheckboxTable, Tabs } from 'components/custom';
import React, { useEffect, useState } from 'react';
import {
  InfluencerProfile,
  Question,
  QuestionsModal,
  Response,
} from 'features/create-client-survey/elements';
import {
  CreateSurveyPageMain,
  AddQuestion,
  QuestionContainer,
  CreateSurveyActions,
  DemographicsWrapper,
  InfoContainer,
} from 'features/create-survey/styles';
import { Button, Card, Input, InputGroup } from 'components/ui';
import { AddIcon, SlidersHorizontalIcon } from 'components/svg';
import { Collapse, Grid, GridCell, Stack } from 'components/system';
import { useModal, useSnackbar } from 'hooks';
import { DGenerateManageSMLFilter } from 'features/manage-sml/data';
import { InputLabel } from 'components/ui/input/styles';
import { BarChart, PieChart } from 'components/csr';
import Theme from 'theme';
import {
  ManageSMLFilterActions,
  ManageSMLPageFilter,
} from 'features/manage-sml/styles';
import {
  ISingleSurveyResponse,
  ISurveyDemographicsData,
} from 'api/survey/types';
import { SurveyAPI } from 'api';
import {
  Status,
  convertQuestionTypeNumber,
  convertQuestionTypeString,
} from 'features/create-survey';
import CampaignInfluencersTable from 'features/create-survey/elements/participants-table';
import { AxiosError } from 'axios';
import {
  TSurveyQuestionMultichoiceType,
  TSurveyQuestionMultiselectType,
  TSurveyQuestionData,
  TSurveyQuestionType,
} from './types';
import {
  DQuestionMultichoiceConstructor,
  DQuestionMultiselectConstructor,
  DQuestionParagraphConstructor,
  DQuestionShortConstructor,
} from './elements/question/data';
import { BarChartWrapper, ChartWrapper } from './styles';

const CreateSurveyPage = ({ id }: { id: string }) => {
  const [tab, setTab] = useState(0);

  const [survey, setSurvey] = useState<ISingleSurveyResponse>();

  const getSingleSurvey = async (surveyId: number) => {
    const surveyResponse = await SurveyAPI.getSurvey(surveyId);

    setSurvey(surveyResponse);
  };

  const { push } = useSnackbar();

  const [questions, setQuestions] = useState<Array<TSurveyQuestionData>>([]);

  const [isDisabled, setIsDisabled] = useState(false);

  const getSurveyQuestions = async () => {
    const resp = await SurveyAPI.getSurveyQuestions(+id);
    const surveyQuestions: Array<TSurveyQuestionData> = resp.map(
      (item: any) => ({
        id: item.id,
        type: convertQuestionTypeString(item.questionType),
        question: item.questionText,
        optional: item.isOptional,
        usersThatResponded: item.usersThatResponded || undefined,
        answers: item.surveyOptions.length
          ? item.surveyOptions.map((surveyOptionItem: any) => ({
              id: surveyOptionItem.id,
              value: surveyOptionItem.optionText,
              isOther: surveyOptionItem.isOther,
            }))
          : undefined,
      })
    );

    if (surveyQuestions.length) {
      setQuestions(surveyQuestions);
    }
  };

  const handleSubmitNewQuestion = async (
    body = {
      questionType: 0,
      isOptional: false,
      questionText: '',
    }
  ) => {
    await SurveyAPI.createSurveyQuestion(+id, body)
      .then(() => {
        getSurveyQuestions();
      })
      .catch((err) => {
        const error = err as AxiosError<any>;

        if (
          error.isAxiosError &&
          (error.response?.status === 400 || error.response?.status === 403)
        ) {
          push(error.response.data.message, { variant: 'error' });
          return;
        }

        push('Something went wrong.', { variant: 'error' });
      });
  };

  const deleteQuestion = async (qid: string) => {
    const numberQid = +qid;

    const response = await SurveyAPI.deleteSurveyQuestion(+id, numberQid);
    if (response) {
      setQuestions((prev) => prev.filter((el) => el.id !== numberQid));
    }
  };

  const copyQuestion = (qid: string) => {
    const numberQid = +qid;
    const helperId = questions.findIndex((el) => el.id === numberQid);
    const helper = questions.find((el) => el.id === numberQid);

    if (helper && helperId > -1) {
      const copiedQuestion = { ...helper };

      const formattedCopy = {
        questionType: convertQuestionTypeNumber(copiedQuestion.type),
        questionText: copiedQuestion.question,
        isOptional: copiedQuestion.optional,
        answers:
          (
            copiedQuestion as
              | TSurveyQuestionMultichoiceType
              | TSurveyQuestionMultiselectType
          ).answers &&
          (
            copiedQuestion as
              | TSurveyQuestionMultichoiceType
              | TSurveyQuestionMultiselectType
          ).answers.length
            ? (
                copiedQuestion as
                  | TSurveyQuestionMultichoiceType
                  | TSurveyQuestionMultiselectType
              ).answers.map((answer) => ({
                answer: answer.value ? answer.value : '',
                isOther: answer.isOther || undefined,
              }))
            : undefined,
      };
      handleSubmitNewQuestion(formattedCopy);
    }
  };

  const updateQuestion = (qid: number) => (a: any) => {
    setQuestions(questions.map((x) => (x.id === qid ? { ...x, ...a } : x)));
  };

  const changeType = (qid: number) => async (income: any) => {
    const questionInMind = questions.find((el) => el.id === qid);
    const questionTypes = {
      short: () => DQuestionShortConstructor(questionInMind!),
      paragraph: () => DQuestionParagraphConstructor(questionInMind!),
      multichoice: () => DQuestionMultichoiceConstructor(questionInMind!),
      multiselect: () => DQuestionMultiselectConstructor(questionInMind!),
    };

    if (!income || !income.value) {
      return;
    }

    const smh: TSurveyQuestionType = income.value;

    const newQuestion = questionTypes[smh]();

    const response = await SurveyAPI.updateSurveyQuestion(+id, qid, {
      questionType: convertQuestionTypeNumber(newQuestion.type),
    });

    if (response.surveyOptions.length) {
      const formattedQuestionWithAnswers = newQuestion as
        | TSurveyQuestionMultichoiceType
        | TSurveyQuestionMultiselectType;
      formattedQuestionWithAnswers.answers = response.surveyOptions.map(
        (surveyOptionItem: any) => ({
          id: surveyOptionItem.id,
          value: surveyOptionItem.optionText,
          isOther: surveyOptionItem.isOther,
        })
      );

      setQuestions((prev) =>
        prev.map((el) => (el.id === qid ? formattedQuestionWithAnswers : el))
      );
    } else {
      setQuestions((prev) =>
        prev.map((el) => (el.id === qid ? newQuestion : el))
      );
    }
  };

  const [ifModal, openIfModal, closeIfModal] = useModal(false);
  const [qmModal, openQmModal, closeQmModal] = useModal(false);

  const [filterTabs, setFilterTabs] = useState(0);

  const [demographicsData, setDemographicsData] =
    useState<ISurveyDemographicsData>();

  const [filter, setFilter] = useState<any>(DGenerateManageSMLFilter());
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(DGenerateManageSMLFilter());
  };

  const getSurveyDemographicData = async () => {
    await SurveyAPI.getDemographicGraphData(+id)
      .then((response) => {
        setDemographicsData(response);
      })
      .catch((err) => {
        const error = err as AxiosError<any>;

        if (error.isAxiosError) {
          console.log(error.response?.data.message);
        }
      });
  };

  useEffect(() => {
    if (survey?.platformProductOrder.status !== 0) {
      getSurveyDemographicData();
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [survey?.platformProductOrder.status]);

  useEffect(() => {
    if (id) getSingleSurvey(+id);
  }, [id]);

  useEffect(() => {
    getSurveyQuestions();
  }, []);

  return (
    <CreateSurveyPageMain>
      <Tabs
        value={tab}
        onValue={setTab}
        tabs={[
          'Questions',
          'Responses',
          'Participants',
          'Demographics',
          // 'AI Consultant',
        ]}
        style={{ overflow: 'auto' }}
      />

      {tab === 0 && (
        <CardWithText
          title={`${survey?.name} (${survey?.questionCount || 0} Questions)`}
        >
          <Stack>
            <QuestionContainer>
              {survey &&
                questions.map((el, index) => (
                  <Question
                    key={el.id}
                    surveyId={+id}
                    survey={survey}
                    isDisabled={isDisabled}
                    questionId={index + 1}
                    copy={copyQuestion}
                    remove={deleteQuestion}
                    updateQuestion={updateQuestion(el.id)}
                    changeType={changeType(el.id)}
                    question={el}
                  />
                ))}
            </QuestionContainer>
            <CreateSurveyActions>
              <AddQuestion
                style={isDisabled ? { opacity: '0.7' } : undefined}
                onClick={() => handleSubmitNewQuestion()}
              >
                <AddIcon />
                Add new question
              </AddQuestion>
              {/* <Button
                size="large"
                color="primary"
                variant="contained"
                onClick={submitSurvey}
              >
                Submit Survey
              </Button> */}
            </CreateSurveyActions>
          </Stack>
        </CardWithText>
      )}
      {tab === 1 && (
        <CardWithText title={`${survey?.name} Question`}>
          <Stack>
            <Stack>
              {!!questions.length &&
              survey?.platformProductOrder.status !== Status.InPreparation &&
              (
                questions[0] as unknown as
                  | TSurveyQuestionMultichoiceType
                  | TSurveyQuestionMultiselectType
              ).usersThatResponded?.length
                ? questions.map((el, index) => {
                    if (
                      el.type === 'multichoice' ||
                      el.type === 'multiselect'
                    ) {
                      // eslint-disable-next-line react/no-array-index-key
                      return <Response key={index} surveyId={+id} data={el} />;
                    }
                    return undefined;
                  })
                : undefined}
              {!!questions.length &&
              !(
                questions[0] as unknown as
                  | TSurveyQuestionMultichoiceType
                  | TSurveyQuestionMultiselectType
              ).usersThatResponded?.length &&
              survey?.platformProductOrder.status !== Status.InPreparation ? (
                <InfoContainer>
                  There are currently no answers from influencers.
                </InfoContainer>
              ) : undefined}
              {survey?.platformProductOrder.status === Status.InPreparation ? (
                <InfoContainer>Survey is in preparation.</InfoContainer>
              ) : undefined}
            </Stack>
          </Stack>
        </CardWithText>
      )}

      {tab === 2 && (
        <Stack>
          {survey?.platformProductOrderId ? (
            <CampaignInfluencersTable id={survey?.platformProductOrderId} />
          ) : undefined}
        </Stack>
      )}

      {tab === 3 && (
        <Card>
          <DemographicsWrapper>
            {questions.length &&
            (
              questions[0] as unknown as
                | TSurveyQuestionMultichoiceType
                | TSurveyQuestionMultiselectType
            ).usersThatResponded?.length ? (
              <>
                <GridCell columnSpan={2}>
                  <Stack style={{ overflowY: 'scroll' }}>
                    <InputLabel>Age & Gender</InputLabel>
                    <BarChartWrapper>
                      <BarChart
                        isChartDisabled={false}
                        labels={
                          demographicsData
                            ? demographicsData.ageAndGenderGraph.graphLabels
                            : []
                        }
                        data={[
                          {
                            subLabel: 'Male',
                            color: `${Theme.palette.primary.main}`,
                            values: demographicsData
                              ? demographicsData.ageAndGenderGraph.maleCountData
                              : [],
                          },
                          {
                            subLabel: 'Female',
                            color: `${Theme.palette.secondary.light}`,
                            values: demographicsData
                              ? demographicsData.ageAndGenderGraph
                                  .femaleCountData
                              : [],
                          },
                          {
                            subLabel: 'Other',
                            color: `#7E839F`,
                            values: demographicsData
                              ? demographicsData.ageAndGenderGraph
                                  .otherCountData
                              : [],
                          },
                        ]}
                        verticalLabel="Number of mentions"
                      />
                    </BarChartWrapper>
                  </Stack>
                </GridCell>
                <ChartWrapper>
                  <Stack style={{ overflowY: 'scroll' }}>
                    <InputLabel>Stakeholder</InputLabel>
                    <PieChart
                      style={{
                        width: '100%',
                      }}
                      labels={
                        demographicsData
                          ? demographicsData.stakeholderGraph.graphLabels
                          : []
                      }
                      data={
                        demographicsData
                          ? demographicsData.stakeholderGraph
                              .influencerStakeholderData
                          : []
                      }
                    />
                  </Stack>
                  <Stack style={{ overflowY: 'scroll' }}>
                    <InputLabel>Ethnicity</InputLabel>
                    <PieChart
                      style={{
                        width: '100%',
                      }}
                      labels={
                        demographicsData
                          ? demographicsData.ethnicitiesGraph.graphLabels
                          : []
                      }
                      data={
                        demographicsData
                          ? demographicsData.ethnicitiesGraph
                              .influencerEthnicityData
                          : []
                      }
                    />
                  </Stack>
                </ChartWrapper>
                <ChartWrapper>
                  <Stack style={{ overflowY: 'scroll' }}>
                    <InputLabel>Location</InputLabel>
                    <div
                      style={{
                        minWidth: 500,
                        width:
                          demographicsData &&
                          demographicsData.countriesGraph.graphLabels.length > 8
                            ? demographicsData.countriesGraph.graphLabels
                                .length * 40
                            : 500,
                        height: 300,
                        margin: '50px 0px',
                      }}
                    >
                      <BarChart
                        isChartDisabled={false}
                        labels={
                          demographicsData
                            ? demographicsData.countriesGraph.graphLabels
                            : []
                        }
                        data={[
                          {
                            color: `${Theme.palette.primary.main}`,
                            values: demographicsData
                              ? demographicsData.countriesGraph
                                  .influencerCountryData
                              : [],
                          },
                        ]}
                        verticalLabel="Number of mentions"
                      />
                    </div>
                  </Stack>
                  <Stack style={{ overflowY: 'scroll' }}>
                    <InputLabel>Patient Diseases</InputLabel>
                    <div
                      style={{
                        minWidth: 500,
                        width:
                          demographicsData &&
                          demographicsData.diseasesGraph.graphLabels.length > 8
                            ? demographicsData.diseasesGraph.graphLabels
                                .length * 40
                            : 500,
                        height: 300,
                        margin: '50px 0px',
                      }}
                    >
                      <BarChart
                        isChartDisabled={false}
                        labels={
                          demographicsData
                            ? demographicsData.diseasesGraph.graphLabels
                            : []
                        }
                        data={[
                          {
                            color: `${Theme.palette.primary.main}`,
                            values:
                              demographicsData &&
                              demographicsData.diseasesGraph.graphLabels
                                .length > 8
                                ? demographicsData.diseasesGraph
                                    .influencerDiseaseData
                                : [],
                          },
                        ]}
                        verticalLabel="Number of mentions"
                      />
                    </div>
                  </Stack>
                </ChartWrapper>
              </>
            ) : (
              <InfoContainer>
                {survey?.platformProductOrder.status === Status.InPreparation
                  ? 'Survey is in preparation.'
                  : 'There are currently no answers from influencers.'}
              </InfoContainer>
            )}
          </DemographicsWrapper>
        </Card>
      )}
      {/* {tab === 4 && (
        <>
          <CardWithText
            title="AI Consultant"
            description="More than 30.7k posts"
            actions={[
              <Button
                color={filterOpen ? 'secondary' : 'default'}
                variant="contained"
                onClick={toggleFilter}
                startIcon={<SlidersHorizontalIcon width="18" height="18" />}
              >
                Filters
              </Button>,
            ]}
          >
            <Collapse in={filterOpen}>
              <ManageSMLPageFilter>
                <Tabs
                  tabs={['Author', 'Post']}
                  value={filterTabs}
                  onValue={setFilterTabs}
                />
                {filterTabs === 0 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Stakeholder"
                      placeholder="Please Select"
                      value={filter.stakeholder}
                      onValue={(stakeholder) =>
                        setFilter({ ...filter, stakeholder })
                      }
                    />
                    <Input
                      type="select"
                      label="Gender"
                      placeholder="Please Select"
                      value={filter.gender}
                      onValue={(gender) => setFilter({ ...filter, gender })}
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="select"
                      label="Disease Area"
                      placeholder="Please Select"
                      value={filter.diseaseArea}
                      onValue={(diseaseArea) =>
                        setFilter({ ...filter, diseaseArea })
                      }
                    />
                    <Input
                      type="select"
                      label="Location"
                      placeholder="Please Select"
                      value={filter.location}
                      onValue={(location) => setFilter({ ...filter, location })}
                    />
                    <Input
                      type="select"
                      label="Ethnicity"
                      placeholder="Please Select"
                      value={filter.ethnicity}
                      onValue={(ethnicity) =>
                        setFilter({ ...filter, ethnicity })
                      }
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="min-max"
                      label="Age"
                      value={filter.age}
                      onValue={(age) => setFilter({ ...filter, age })}
                    />
                    <Input
                      type="select"
                      label="Struggles"
                      placeholder="Please Select"
                      value={filter.struggles}
                      onValue={(struggles) =>
                        setFilter({ ...filter, struggles })
                      }
                    />
                    <Input
                      type="select"
                      label="Symptoms"
                      placeholder="Please Select"
                      value={filter.symptoms}
                      onValue={(symptoms) => setFilter({ ...filter, symptoms })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Please Select"
                      value={filter.interests}
                      onValue={(interests) =>
                        setFilter({ ...filter, interests })
                      }
                    />
                    <Input
                      type="text"
                      label="Bio"
                      placeholder="Please Enter"
                      value={filter.bio}
                      onValue={(bio) => setFilter({ ...filter, bio })}
                    />
                  </Grid>
                )}
                {filterTabs === 1 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Social Media"
                      placeholder="Select Select"
                      value={filter.socialMedia}
                      onValue={(socialMedia) =>
                        setFilter({ ...filter, socialMedia })
                      }
                    />
                    <Input
                      type="select"
                      label="Theme"
                      placeholder="Select Select"
                      value={filter.theme}
                      onValue={(theme) => setFilter({ ...filter, theme })}
                    />
                    <Input
                      type="select"
                      label="Disease Area (HCP)"
                      placeholder="Select Select"
                      value={filter.diseaseAreaBA}
                      onValue={(diseaseAreaBA) =>
                        setFilter({ ...filter, diseaseAreaBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Struggle"
                      placeholder="Select Select"
                      value={filter.struggle}
                      onValue={(struggle) => setFilter({ ...filter, struggle })}
                    />
                    <Input
                      type="select"
                      label="Symptom"
                      placeholder="Select Select"
                      value={filter.symptom}
                      onValue={(symptom) => setFilter({ ...filter, symptom })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Select Select"
                      value={filter.interestBA}
                      onValue={(interestBA) =>
                        setFilter({ ...filter, interestBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Sentiment"
                      placeholder="Select Select"
                      value={filter.sentiment}
                      onValue={(sentiment) =>
                        setFilter({ ...filter, sentiment })
                      }
                    />
                    <Input
                      type="select"
                      label="Language"
                      placeholder="Select Select"
                      value={filter.language}
                      onValue={(language) => setFilter({ ...filter, language })}
                    />
                    <Input
                      type="select"
                      label="Brand"
                      placeholder="Select Select"
                      value={filter.brand}
                      onValue={(brand) => setFilter({ ...filter, brand })}
                    />
                    <Input
                      type="select"
                      label="Product"
                      placeholder="Select Select"
                      value={filter.product}
                      onValue={(product) => setFilter({ ...filter, product })}
                    />
                    <Input
                      type="min-max"
                      label="Likes"
                      value={filter.likes}
                      onValue={(likes) => setFilter({ ...filter, likes })}
                    />
                    <Input
                      type="min-max"
                      label="Comments"
                      value={filter.comments}
                      onValue={(comments) => setFilter({ ...filter, comments })}
                    />
                    <InputGroup
                      label="Date"
                      inputRatio="1fr 1fr"
                      elements={[
                        {
                          value: filter.startDate,
                          onValue: (startDate) =>
                            setFilter({ ...filter, startDate }),
                          type: 'date',
                          placeholder: 'From',
                        },
                        {
                          value: filter.endDate,
                          onValue: (endDate) =>
                            setFilter({ ...filter, endDate }),
                          type: 'date',
                          placeholder: 'To',
                        },
                      ]}
                    />
                    <Input
                      type="text"
                      label="Keyword"
                      placeholder="Select Enter"
                      value={filter.keyword}
                      onValue={(keyword) => setFilter({ ...filter, keyword })}
                    />
                  </Grid>
                )}
                <ManageSMLFilterActions direction="horizontal">
                  <Button color="primary" variant="contained">
                    Filter
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={clearFilters}
                  >
                    Clear filter
                  </Button>
                </ManageSMLFilterActions>
              </ManageSMLPageFilter>
            </Collapse>
          </CardWithText>
          <CardWithText title="Remaining Tokens"><Chat /></CardWithText>
        </>
      )} */}

      {ifModal && <InfluencerProfile onClose={closeIfModal} />}
      {qmModal && (
        <QuestionsModal
          firstName="John"
          lastName="Doe"
          questions={questions}
          onClose={closeQmModal}
        />
      )}
    </CreateSurveyPageMain>
  );
};

export default CreateSurveyPage;
