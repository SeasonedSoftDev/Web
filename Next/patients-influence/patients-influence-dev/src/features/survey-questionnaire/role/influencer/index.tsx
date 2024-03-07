import React, { useState, useEffect } from 'react';
import { CardWithText } from 'components/custom';
import { Stack } from 'components/system';
import { Button } from 'components/ui';
import { SurveyAPI } from 'api';
import { convertQuestionTypeString } from 'features/create-survey';
import {
  TSurveyQuestionData,
  TSurveyQuestionMultichoiceType,
  TSurveyQuestionMultiselectType,
} from 'features/create-client-survey/types';
import { useSnackbar } from 'hooks';
import { AxiosError } from 'axios';
import { ISingleSurveyResponse } from 'api/survey/types';
import { ProductOrderInfluencerStatus } from 'api/platformProduct/enums';
import { useAppContext } from 'context';
import { useRouter } from 'next/router';
import {
  CreateSurveyActions,
  QuestionContainer,
  SurveyInfluencersQuestionsMain,
} from './styles';
import Question from './elements/question';

export interface ISelectedRadioGroups {
  [groupId: number]: number;
}

export interface ISelectedCheckboxGroups {
  [groupId: number]: number[];
}

export interface IQuestionAnswers {
  surveyQuestionId: number;
  surveyOptionId?: number;
  surveyResponseText?: string;
  isOptional: boolean;
}

export interface IQuestionAnswersBody
  extends Omit<IQuestionAnswers, 'isOptional'> {}

const SurveyInfluencersQuestionsPage = ({
  id,
  influencerId,
}: {
  id: string;
  influencerId?: string;
}) => {
  const { role } = useAppContext();
  const [questions, setQuestions] = useState<Array<TSurveyQuestionData>>([]);
  const [questionAnswerResults, setQuestionAnswerResults] = useState<
    IQuestionAnswers[]
  >([]);

  const [survey, setSurvey] = useState<ISingleSurveyResponse>();
  const [status, setStatus] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const { push } = useSnackbar();
  const router = useRouter();

  const [selectedRadioGroups, setSelectedRadioGroups] =
    useState<ISelectedRadioGroups>({});
  const [selectedCheckboxGroups, setSelectedCheckboxGroups] =
    useState<ISelectedCheckboxGroups>({});

  const getSurveyQuestions = async () => {
    await SurveyAPI.getSurveyQuestions(+id)
      .then((data) => {
        const surveyQuestions: Array<TSurveyQuestionData> = data.map(
          (item: any) => ({
            id: item.id,
            type: convertQuestionTypeString(item.questionType),
            question: item.questionText,
            optional: item.isOptional,
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
      })
      .catch((err) => {
        const error = err as AxiosError<any>;
        if (error.isAxiosError) {
          push("You can't view this page right now.", { variant: 'error' });
          router.push('/surveys');
        }
      });
  };

  const handleRadioChange = (questionId: number, selectedOptionId: number) => {
    setSelectedRadioGroups((prevSelectedRadioGroups) => ({
      ...prevSelectedRadioGroups,
      [questionId]: selectedOptionId,
    }));
  };

  const handleCheckboxChange = (
    questionId: number,
    selectedOptionId: number
  ) => {
    setSelectedCheckboxGroups((prevSelectedCheckboxGroups) => ({
      ...prevSelectedCheckboxGroups,
      // eslint-disable-next-line no-nested-ternary
      [questionId]: prevSelectedCheckboxGroups[questionId]
        ? prevSelectedCheckboxGroups[questionId].includes(selectedOptionId)
          ? prevSelectedCheckboxGroups[questionId].filter(
              // eslint-disable-next-line no-shadow
              (id) => id !== selectedOptionId
            )
          : [...prevSelectedCheckboxGroups[questionId], selectedOptionId]
        : [selectedOptionId],
    }));
  };

  const handleCheckboxChangeInitial = (
    questionId: number,
    selectedOptionId: number
  ) => {
    setSelectedCheckboxGroups((prevSelectedCheckboxGroups) => {
      const updatedGroups = { ...prevSelectedCheckboxGroups };
      const questionGroup = updatedGroups[questionId] || [];

      if (!questionGroup.includes(selectedOptionId)) {
        updatedGroups[questionId] = [...questionGroup, selectedOptionId];
      }

      return updatedGroups;
    });
  };

  const handleTextFieldsChange = (questionId: number, inputValue: string) => {
    setQuestionAnswerResults((prevState) =>
      prevState.map((question) => {
        if (question.surveyQuestionId === questionId) {
          return {
            ...question,
            surveyResponseText: inputValue,
          };
        }
        return question;
      })
    );
  };

  const getSingleSurvey = async (surveyId: number) => {
    if (!survey) {
      await SurveyAPI.getSurveyAsInfluencer(
        surveyId,
        influencerId ? +influencerId : undefined
      )
        .then((surveyResponse) => {
          setSurvey(surveyResponse);
          if (
            role === 'INFLUENCER' &&
            ![
              ProductOrderInfluencerStatus.ToBeAnswered,
              ProductOrderInfluencerStatus.NotApproved,
            ].includes(
              surveyResponse.platformProductOrder
                .platformProductOrderInfluencers[0].status
            )
          ) {
            setIsDisabled(true);
          } else {
            setIsDisabled(false);
          }

          if (role !== 'INFLUENCER') {
            setIsDisabled(true);
          }

          switch (
            surveyResponse.platformProductOrder
              .platformProductOrderInfluencers[0].status
          ) {
            case ProductOrderInfluencerStatus.Added:
              setStatus('Added');
              break;
            case ProductOrderInfluencerStatus.Invited:
              setStatus('Invited');
              break;
            case ProductOrderInfluencerStatus.Matching:
              setStatus('Matching');
              break;
            case ProductOrderInfluencerStatus.NotSelected:
              setStatus('Not Selected');
              break;
            case ProductOrderInfluencerStatus.Withdrawn:
              setStatus('Left');
              break;
            case ProductOrderInfluencerStatus.Declined:
              setStatus('Declined');
              break;
            case ProductOrderInfluencerStatus.ToBeSubmitted:
              setStatus('To Be Submitted');
              break;
            case ProductOrderInfluencerStatus.ToBeApproved:
              setStatus('To Be Approved');
              break;
            case ProductOrderInfluencerStatus.Approved:
              setStatus('Approved');
              break;
            case ProductOrderInfluencerStatus.NotApproved:
              setStatus('Not Approved');
              break;
            case ProductOrderInfluencerStatus.Removed:
              setStatus('Removed');
              break;
            case ProductOrderInfluencerStatus.ToBeAnswered:
              setStatus('To Be Answered');
              break;
            default:
              setStatus('');
          }
          surveyResponse.surveyResponses.forEach((surveyResponseItem: any) => {
            if (
              surveyResponseItem.surveyQuestionId &&
              surveyResponseItem.surveyOptionId &&
              surveyResponseItem.surveyOption.surveyQuestion.questionType
            ) {
              const questionTypeString = convertQuestionTypeString(
                surveyResponseItem.surveyOption.surveyQuestion.questionType
              );
              if (questionTypeString === 'multiselect') {
                handleCheckboxChangeInitial(
                  surveyResponseItem.surveyQuestionId,
                  surveyResponseItem.surveyOptionId
                );
              }
              if (questionTypeString === 'multichoice') {
                handleRadioChange(
                  surveyResponseItem.surveyQuestionId,
                  surveyResponseItem.surveyOptionId
                );
              }
            }

            if (
              surveyResponseItem.surveyQuestionId &&
              !surveyResponseItem.surveyOptionId &&
              surveyResponseItem.surveyResponseText.length
            ) {
              handleTextFieldsChange(
                surveyResponseItem.surveyQuestionId,
                surveyResponseItem.surveyResponseText
              );
            }
          });
        })
        .catch((err) => {
          const error = err as AxiosError<any>;

          if (error.isAxiosError && error.response?.data.message) {
            push(error.response.data.message, { variant: 'error' });
          }
        });
    }
  };

  useEffect(() => {
    if (id && questionAnswerResults.length) {
      getSingleSurvey(+id);
    }
  }, [id, questionAnswerResults]);

  useEffect(() => {
    getSurveyQuestions();
  }, []);

  const handleSubmitNewQuestion = async () => {
    if (role !== 'INFLUENCER') {
      return;
    }
    const questionsForAPI = questionAnswerResults
      .map((questionForApi) => {
        if (
          questionForApi.surveyResponseText ||
          questionForApi.surveyResponseText === ''
        ) {
          return questionForApi;
        }

        if (
          questionForApi.surveyQuestionId &&
          selectedRadioGroups[questionForApi.surveyQuestionId] ===
            questionForApi.surveyOptionId
        ) {
          return questionForApi;
        }

        if (
          selectedCheckboxGroups[questionForApi.surveyQuestionId]?.length &&
          questionForApi.surveyOptionId &&
          selectedCheckboxGroups[questionForApi.surveyQuestionId].includes(
            questionForApi.surveyOptionId
          )
        ) {
          return questionForApi;
        }

        return null;
      })
      .filter((questionForApi) => questionForApi !== null);

    const textRequiredQuestions = questionsForAPI.filter(
      (question) =>
        !question?.surveyOptionId &&
        !question?.surveyResponseText?.trim().length &&
        !question?.isOptional
    );

    if (textRequiredQuestions.length) {
      push('Please enter the required text fields', { variant: 'error' });
      return;
    }

    const notAnsweredQuestions = questionAnswerResults.filter(
      (allQuestionField) => {
        const element2 = questionsForAPI.some(
          (answeredQuestion) =>
            answeredQuestion!.surveyQuestionId ===
            allQuestionField.surveyQuestionId
        );

        return !element2 && allQuestionField.isOptional === false;
      }
    );

    const requiredNotAnsweredQuestions = notAnsweredQuestions.filter(
      (notAnsweredQuestionItem) => !notAnsweredQuestionItem.isOptional
    );

    if (requiredNotAnsweredQuestions.length) {
      push('Please check all required checkbox or radio fields', {
        variant: 'error',
      });
      return;
    }

    const questionsForAPIWithoutOptional: IQuestionAnswersBody[] =
      questionsForAPI.map((questionAPI) => {
        const { isOptional, ...restOfQuestion } = questionAPI!;

        return restOfQuestion;
      });

    await SurveyAPI.submitSurveyResults(+id, questionsForAPIWithoutOptional)
      .then(() => {
        setIsDisabled(true);
        setStatus('To Be Approved');
        push('You have sucessfully submitted the questionnaire.');
      })
      .catch((err) => {
        const error = err as AxiosError<any>;

        if (error.isAxiosError) {
          push(error.response?.data.message, { variant: 'error' });
        }
      });
  };

  useEffect(() => {
    if (questions) {
      const formattedQuestions: IQuestionAnswers[] = [];

      questions.forEach((question) => {
        if (question.type === 'short' || question.type === 'paragraph') {
          formattedQuestions.push({
            surveyQuestionId: question.id,
            surveyResponseText: '',
            surveyOptionId: undefined,
            isOptional: question.optional,
          });
        }
        if (
          question.type === 'multichoice' ||
          question.type === 'multiselect'
        ) {
          const questionWithAnswers = question as
            | TSurveyQuestionMultichoiceType
            | TSurveyQuestionMultiselectType;
          questionWithAnswers.answers.forEach((answer) =>
            formattedQuestions.push({
              surveyQuestionId: question.id,
              surveyResponseText: undefined,
              surveyOptionId: +answer.id,
              isOptional: question.optional,
            })
          );
        }
        return question;
      });

      setQuestionAnswerResults(formattedQuestions);
    }
  }, [questions]);

  return (
    <SurveyInfluencersQuestionsMain>
      <CardWithText
        title={`${survey ? survey.name : 'Survey'}`}
        description={status}
      >
        <Stack>
          <QuestionContainer>
            {questions.map((el, index) => (
              <Question
                key={el.id}
                questionIdx={index + 1}
                question={el}
                isDisabled={isDisabled}
                selectedRadioGroups={selectedRadioGroups}
                selectedCheckBoxGroups={selectedCheckboxGroups}
                questionAnswerResults={questionAnswerResults}
                handleCheckboxChange={handleCheckboxChange}
                handleRadioChange={handleRadioChange}
                handleTextFieldsChange={handleTextFieldsChange}
              />
            ))}
          </QuestionContainer>
          {role === 'INFLUENCER' ? (
            <CreateSurveyActions>
              <Button
                size="large"
                color="primary"
                variant="contained"
                onClick={handleSubmitNewQuestion}
                disabled={isDisabled}
              >
                Submit Survey
              </Button>
            </CreateSurveyActions>
          ) : undefined}
        </Stack>
      </CardWithText>
    </SurveyInfluencersQuestionsMain>
  );
};

export default SurveyInfluencersQuestionsPage;
