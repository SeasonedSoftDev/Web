import React, { useState, useEffect } from 'react';
import { TResponseProps } from 'features/create-client-survey/elements/response/types';
import { Input } from 'components/ui';
import { Stack } from 'components/system';
import { BubbleChart, PieChart } from 'components/csr';
import { InputLabel } from 'components/ui/input/styles';
import Theme from 'theme';
import {
  IBubbleChartGraph,
  ISurveyQuestionChartResponse,
} from 'api/survey/types';
import { SurveyAPI } from 'api';
import { AxiosError } from 'axios';
import {
  BubbleChartWrapper,
  ResultsWrapper,
  ResponseMain,
  ResponseHeader,
  ResponseBody,
  ResponseOptions,
  ResponseQuestion,
  ResponseAnswer,
  ResponseAnswers,
} from './styles';

const Response = ({ surveyId, data, ...props }: TResponseProps) => {
  const {
    id,
    optional,
    question,
    type,
    answers,
    usersThatResponded,
    hasOther,
  } = data;

  const defaultParticipant = { label: 'All', value: 0 };
  const [participants, setParticipants] = useState([defaultParticipant]);

  const [pickedInfluencer, setPickedInfluencer] = useState(defaultParticipant);
  const [questionLabels, setQuestionLabels] =
    useState<{ id: number; label: string }[]>();
  const [fullGraphData, setFullGraphData] =
    useState<ISurveyQuestionChartResponse>();
  const [pickedGraphData, setPickedGraphData] = useState<IBubbleChartGraph[]>();
  const [chartData, setChartData] = useState<{
    labels: string[];
    data: number[];
  }>({ labels: [], data: [] });

  const options = [
    {
      value: 'dateOfBirth',
      label: 'Age',
    },
    {
      value: 'ethnicity',
      label: 'Ethnicity',
    },
    {
      value: 'gender',
      label: 'Gender',
    },
  ];

  const [pickedVariable, setPickedVariable] = useState<{
    value: string;
    label: string;
  }>(options[0]);

  useEffect(() => {
    if (fullGraphData && answers) {
      const filteredFirstDataset = answers
        .filter((item) =>
          Object.values(fullGraphData).some((graphData) =>
            graphData.some((graphItem) => graphItem.optionText === item.value)
          )
        )
        .map((answer, index) => ({ id: index + 1, label: answer.value }));

      setQuestionLabels(filteredFirstDataset);
    }
  }, [answers, fullGraphData]);

  const getSurveyQuestionGraphData = async () => {
    if (surveyId && answers) {
      if (pickedInfluencer.label === 'All') {
        await SurveyAPI.getSurveyQuestionResponse(surveyId, id).then(
          (response) => {
            if (Object.keys(response).length) {
              const questionLabelsFormatted = answers
                .filter((item) =>
                  Object.values(response).some((graphData) =>
                    graphData.some(
                      (graphItem) => graphItem.optionText === item.value
                    )
                  )
                )
                .map((answer, index) => ({
                  id: index + 1,
                  label: answer.value,
                }));

              const optionTextToQuestionNumber: { [key: string]: number } = {};
              questionLabelsFormatted.forEach((item) => {
                optionTextToQuestionNumber[item.label] = item.id;
              });

              const formattedDataset: ISurveyQuestionChartResponse = {};

              Object.keys(response).forEach((key) => {
                formattedDataset[key] = response[key].map((item) => ({
                  ...item,
                  x: optionTextToQuestionNumber[item.optionText],
                }));
              });

              setFullGraphData(formattedDataset);
              setPickedGraphData(formattedDataset[pickedVariable.value]);
            }
          }
        );
      } else {
        await SurveyAPI.getSurveyQuestionResponse(
          surveyId,
          id,
          pickedInfluencer.value
        ).then((response) => {
          if (Object.keys(response).length) {
            const questionLabelsFormatted = answers
              .filter((item) =>
                Object.values(response).some((graphData) =>
                  graphData.some(
                    (graphItem) => graphItem.optionText === item.value
                  )
                )
              )
              .map((answer, index) => ({
                id: index + 1,
                label: answer.value,
              }));

            const optionTextToQuestionNumber: { [key: string]: number } = {};
            questionLabelsFormatted.forEach((item) => {
              optionTextToQuestionNumber[item.label] = item.id;
            });

            const formattedDataset: ISurveyQuestionChartResponse = {};

            Object.keys(response).forEach((key) => {
              formattedDataset[key] = response[key].map((item) => ({
                ...item,
                x: optionTextToQuestionNumber[item.optionText],
              }));
            });

            setFullGraphData(formattedDataset);
            setPickedGraphData(formattedDataset[pickedVariable.value]);
          }
        });
      }
    }
  };

  const handleValueFocus = (variable: { value: string; label: string }) => {
    setPickedVariable(variable);
    if (fullGraphData) setPickedGraphData(fullGraphData[variable.value]);
  };

  useEffect(() => {
    if (fullGraphData && pickedVariable) {
      const optionTextCounts: { [key: string]: number } = {};

      const categoryData = fullGraphData[pickedVariable.value];

      // eslint-disable-next-line no-restricted-syntax
      for (const entry of categoryData) {
        const { optionText } = entry;

        if (!optionTextCounts[optionText]) {
          optionTextCounts[optionText] = 1;
        } else {
          // eslint-disable-next-line no-plusplus
          optionTextCounts[optionText]++;
        }
      }

      const labels = Object.keys(optionTextCounts);
      const dataVals = Object.values(optionTextCounts);

      setChartData({ labels, data: dataVals });
    }
  }, [fullGraphData]);

  const handleFocusedInfluencerFocus = (
    influencer:
      | {
          label: string;
          value: number;
        }
      | undefined
  ) => {
    if (influencer) {
      setPickedInfluencer(influencer);
    } else {
      setPickedInfluencer(defaultParticipant);
    }
  };

  useEffect(() => {
    if (answers) getSurveyQuestionGraphData();
    if (usersThatResponded && usersThatResponded.length) {
      setParticipants((prevState) => {
        const users = usersThatResponded.map((user) => ({
          label: user.fullName,
          value: user.id,
        }));

        return [{ label: 'All', value: 0 }, ...users];
      });
    }
  }, [answers, pickedInfluencer]);

  return (
    <ResponseMain {...props}>
      <ResponseHeader>
        <ResponseQuestion>{question}</ResponseQuestion>
        <Input
          type="select"
          placeholder="Please Select"
          value={pickedInfluencer}
          onValue={(v) => {
            handleFocusedInfluencerFocus(v);
          }}
          options={participants}
        />
      </ResponseHeader>
      <ResponseBody>
        <ResponseAnswer>
          {['multichoice', 'multiselect'].includes(type) && (
            <>
              <ResponseAnswers />
              <ResponseOptions>
                <ResultsWrapper direction="horizontal">
                  <Stack
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <InputLabel> Results </InputLabel>
                    <PieChart
                      style={{ width: '80%', maxWidth: '85%' }}
                      labels={chartData.labels}
                      data={chartData.data}
                    />
                  </Stack>
                  <Stack>
                    <Input
                      type="select"
                      label="Variable"
                      placeholder="Please Select"
                      value={pickedVariable}
                      onValue={(v) => {
                        if (v) {
                          handleValueFocus(v);
                        } else {
                          handleValueFocus(options[0]);
                        }
                      }}
                      options={options}
                    />
                    <BubbleChartWrapper>
                      <BubbleChart
                        labels={questionLabels || []}
                        pickedVariable={pickedVariable}
                        data={[
                          {
                            color: `${Theme.palette.primary.main}`,
                            values: pickedGraphData || [],
                          },
                        ]}
                        verticalLabel={pickedVariable.label}
                        horizontalLabel="Question Options"
                        questionLabels={questionLabels}
                      />
                    </BubbleChartWrapper>
                  </Stack>
                </ResultsWrapper>
              </ResponseOptions>
            </>
          )}
        </ResponseAnswer>
      </ResponseBody>
    </ResponseMain>
  );
};

export default Response;
