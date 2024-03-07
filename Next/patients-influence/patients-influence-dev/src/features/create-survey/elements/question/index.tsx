import React, { useState, useCallback, useEffect } from 'react';
import { TQuestionProps } from 'features/create-survey/elements/question/types';
import {
  QuestionMain,
  QuestionHeader,
  QuestionHeaderActions,
  QuestionCounter,
  QuestionBody,
  QuestionOptions,
  QuestionHighlight,
  QuestionFooter,
} from 'features/create-survey/elements/question/styles';
import { Checkbox, Input, RadioButton, Switch } from 'components/ui';
import { CopyIcon, DeleteIcon } from 'components/svg';
import {
  TSurveyQuestionMultichoiceType,
  TSurveyQuestionMultiselectType,
} from 'features/create-survey/types';
import { Stack } from 'components/system';
import { IconButton } from '@mui/material';
import { SurveyAPI } from 'api';
import { convertQuestionTypeNumber } from 'features/create-survey';
import { AxiosError } from 'axios';
import { useSnackbar } from 'hooks';

const Question = ({
  surveyId,
  survey,
  question,
  questionId,
  isDisabled,
  updateQuestion,
  remove,
  changeType,
  copy,
  ...props
}: TQuestionProps) => {
  const [questionType, setQuestionType] = useState<{
    value: string;
    label: string;
  }>();

  const [focusedAnswerId, setFocusedAnswerId] = useState<number | undefined>();

  const { push } = useSnackbar();

  const questionOptions = [
    {
      value: 'short',
      label: 'Short Answer',
    },
    {
      value: 'paragraph',
      label: 'Paragraph',
    },
    {
      value: 'multichoice',
      label: 'Multichoice',
    },
    {
      value: 'multiselect',
      label: 'Multiselect',
    },
  ];

  const updateQuestionText = useCallback(async () => {
    if (survey.platformProductOrder.status === 0) {
      await SurveyAPI.updateSurveyQuestion(surveyId, question.id, {
        questionText: question.question,
        questionType: convertQuestionTypeNumber(question.type),
      }).catch((err) => {
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
    }
  }, [question]);

  const changeQuestion = async (v: string) => {
    updateQuestion({ question: v });
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      updateQuestionText();
    }, 1000); // Adjust the delay as needed

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [question.question]);

  const updateSurveyQuestionCredit = useCallback(async () => {
    if (survey.platformProductOrder.status === 0) {
      await SurveyAPI.updateSurveyQuestion(surveyId, question.id, {
        questionCredit: question.credit,
        questionType: convertQuestionTypeNumber(question.type),
      });
    }
  }, [question]);

  const changeCredit = async (v: string) => {
    updateQuestion({ credit: +v });
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      updateSurveyQuestionCredit();
    }, 1000);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [question.credit]);

  useEffect(() => {
    const foundOption = questionOptions.find(
      (option) => option.value === question.type
    );
    setQuestionType(foundOption);
  }, [question]);

  const changeOptional = async () => {
    if (survey.platformProductOrder.status === 0) {
      const response = await SurveyAPI.updateSurveyQuestion(
        surveyId,
        question.id,
        {
          isOptional: !question.optional,
          questionType: convertQuestionTypeNumber(question.type),
        }
      );
      if (response) {
        updateQuestion({ optional: !question.optional });
      }
    }
  };

  const updateSurveyQuestionAnswer = useCallback(
    async (answerId: number) => {
      if (focusedAnswerId) {
        const questionWithAnswers = question as
          | TSurveyQuestionMultichoiceType
          | TSurveyQuestionMultiselectType;
        const answerToSubmit = questionWithAnswers.answers.find(
          (answerState) =>
            +answerState.id === focusedAnswerId && answerId === +answerState.id
        );
        if (answerToSubmit && survey.platformProductOrder.status === 0) {
          const response = await SurveyAPI.updateSurveyQuestionOption(
            surveyId,
            question.id,
            +focusedAnswerId,
            {
              answer: answerToSubmit?.value,
            }
          );
        }
      }
    },
    [
      (
        question as
          | TSurveyQuestionMultichoiceType
          | TSurveyQuestionMultiselectType
      ).answers,
    ]
  );

  const updateAnswer = async (id: number, v: string) => {
    if (['multichoice', 'multiselect'].includes(question.type)) {
      const questionWithAnswers = question as
        | TSurveyQuestionMultichoiceType
        | TSurveyQuestionMultiselectType;

      setFocusedAnswerId(id);

      if (survey.platformProductOrder.status === 0) {
        const answer = questionWithAnswers.answers.find(
          (answerItem) => +answerItem.id === id
        );
        if (answer) {
          updateQuestion({
            answers: questionWithAnswers.answers.map((x, y) =>
              +x.id === id ? { ...x, value: v } : x
            ),
          });
        }
      }
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (focusedAnswerId) {
        updateSurveyQuestionAnswer(focusedAnswerId);
        setFocusedAnswerId(undefined);
      }
    }, 150);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [
    (
      question as
        | TSurveyQuestionMultichoiceType
        | TSurveyQuestionMultiselectType
    ).answers,
  ]);

  const removeAnswer = async (id: number) => {
    if (['multichoice', 'multiselect'].includes(question.type)) {
      const questionWithAnswers = question as
        | TSurveyQuestionMultichoiceType
        | TSurveyQuestionMultiselectType;

      if (survey.platformProductOrder.status === 0) {
        const response = await SurveyAPI.deleteSurveyQuestionType(
          surveyId,
          question.id,
          id
        );
        if (response) {
          updateQuestion({
            answers: questionWithAnswers.answers.filter((x, y) => +x.id !== id),
          });
        }
      }
    }
  };

  const addOption = async () => {
    const questionWithAnswers = question as
      | TSurveyQuestionMultichoiceType
      | TSurveyQuestionMultiselectType;

    if (survey.platformProductOrder.status === 0) {
      const response = await SurveyAPI.createSurveyQuestionOption(
        surveyId,
        question.id,
        {
          answer: '',
        }
      );

      if (response) {
        const newAnswer = {
          id: response.id,
          value: response.optionText || '',
          isOther: response.isOther,
        };
        if (questionWithAnswers.answers) {
          updateQuestion({
            answers: [...questionWithAnswers.answers, newAnswer],
          });
        } else {
          updateQuestion({ answers: [newAnswer] });
        }
      }
    }
  };

  const toggleHasOther = async () => {
    const questionWithAnswers = question as
      | TSurveyQuestionMultichoiceType
      | TSurveyQuestionMultiselectType;

    if (
      !questionWithAnswers.answers.find(
        (questionItem) => questionItem.isOther
      ) &&
      survey.platformProductOrder.status === 0
    ) {
      const response = await SurveyAPI.createSurveyQuestionOption(
        surveyId,
        question.id,
        {
          answer: 'Other',
          isOther: true,
        }
      ).catch((err) => {
        const error = err as AxiosError<any>;
        if (
          error.isAxiosError &&
          error.response?.data?.message ===
            'You can only have one other question'
        ) {
          push(error.response?.data?.message, { variant: 'warning' });
        }
      });

      if (response) {
        const newAnswer = {
          id: response.id,
          value: response.optionText || '',
          isOther: response.isOther,
        };
        if (questionWithAnswers.answers) {
          updateQuestion({
            answers: [...questionWithAnswers.answers, newAnswer],
          });
        } else {
          updateQuestion({ answers: [newAnswer] });
        }
      }
    } else {
      const otherAnswer = questionWithAnswers.answers.find(
        (answer) => answer.isOther
      );
      if (otherAnswer) {
        if (
          ['multichoice', 'multiselect'].includes(question.type) &&
          survey.platformProductOrder.status === 0
        ) {
          const response = await SurveyAPI.deleteSurveyQuestionType(
            surveyId,
            question.id,
            +otherAnswer.id
          );
          if (response) {
            updateQuestion({
              answers: questionWithAnswers.answers.filter(
                (x, y) => +x.id !== +otherAnswer.id
              ),
            });
          }
        }
      }
    }
  };

  return (
    <QuestionMain {...props}>
      <QuestionHeader>
        <QuestionCounter>
          <Input
            type="text"
            placeholder={`Question ${questionId}`}
            value={question.question}
            onValue={changeQuestion}
            disabled={isDisabled}
            style={{ maxWidth: '420px' }}
          />
        </QuestionCounter>
        <QuestionHeaderActions>
          {questionType?.value ? (
            <Input
              type="select"
              placeholder="Short Answer"
              value={questionType}
              onValue={changeType}
              options={questionOptions}
              disabled={isDisabled}
            />
          ) : undefined}
          <Input
            type="number"
            placeholder="Question credit"
            value={question.credit}
            onValue={changeCredit}
            disabled={isDisabled}
          />
        </QuestionHeaderActions>
      </QuestionHeader>
      <QuestionBody>
        {question.type === 'short' && (
          <Input
            type="text"
            placeholder="Short text answer"
            value=""
            onValue={() => {}}
            disabled={isDisabled}
          />
        )}
        {question.type === 'paragraph' && (
          <Input
            type="text"
            placeholder="Paragraph answer"
            multiline
            rows={3}
            value=""
            onValue={() => {}}
            disabled={isDisabled}
          />
        )}
        {question.type === 'multichoice' &&
        question.answers &&
        question.answers.length > 0
          ? question.answers.map((el, index) =>
              !el.isOther ? (
                <Stack direction="horizontal" key={+el.id}>
                  <RadioButton label="" value={false} disabled />
                  <Input
                    type="text"
                    placeholder="Enter question option"
                    value={el.value}
                    onValue={(v) => updateAnswer(+el.id, v)}
                    disabled={isDisabled}
                    endAdornment={
                      <IconButton
                        style={isDisabled ? { opacity: '0.7' } : undefined}
                        onClick={() => {
                          removeAnswer(+el.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                </Stack>
              ) : undefined
            )
          : undefined}
        {question.type === 'multiselect' &&
        question.answers &&
        question.answers.length > 0
          ? question.answers.map((el, index) =>
              !el.isOther ? (
                <Stack direction="horizontal" key={+el.id}>
                  <Checkbox value={false} />
                  <Input
                    type="text"
                    placeholder="Enter question option"
                    value={el.value}
                    onValue={(v) => updateAnswer(+el.id, v)}
                    disabled={isDisabled}
                    endAdornment={
                      <IconButton
                        style={isDisabled ? { opacity: '0.7' } : undefined}
                        onClick={() => {
                          removeAnswer(+el.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                </Stack>
              ) : undefined
            )
          : undefined}
        {(
          question as
            | TSurveyQuestionMultichoiceType
            | TSurveyQuestionMultiselectType
        ).answers &&
          (
            question as
              | TSurveyQuestionMultichoiceType
              | TSurveyQuestionMultiselectType
          ).answers.length > 0 &&
          (
            question as
              | TSurveyQuestionMultichoiceType
              | TSurveyQuestionMultiselectType
          ).answers.map((answer) =>
            answer.isOther ? (
              <Stack direction="horizontal" key={+answer.id}>
                {question.type === 'multiselect' ? (
                  <Checkbox value={false} />
                ) : (
                  <RadioButton label="" disabled />
                )}
                <Input
                  type="text"
                  placeholder="Other answer"
                  value=""
                  disabled={isDisabled}
                  onValue={() => {}}
                  endAdornment={
                    <IconButton
                      style={isDisabled ? { opacity: '0.7' } : undefined}
                      onClick={toggleHasOther}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                />
              </Stack>
            ) : undefined
          )}
        {['multichoice', 'multiselect'].includes(question.type) && (
          <QuestionOptions>
            <QuestionHighlight
              style={isDisabled ? { opacity: '0.7' } : undefined}
              onClick={addOption}
            >
              Add new answer
            </QuestionHighlight>
            {(
              question as
                | TSurveyQuestionMultichoiceType
                | TSurveyQuestionMultiselectType
            ).answers?.findIndex((el) => el.isOther) === -1 ? (
              <>
                or
                <QuestionHighlight
                  style={isDisabled ? { opacity: '0.7' } : undefined}
                  onClick={toggleHasOther}
                >
                  add other.
                </QuestionHighlight>
              </>
            ) : undefined}
          </QuestionOptions>
        )}
      </QuestionBody>
      <QuestionFooter>
        <CopyIcon
          style={{ color: '#9F9FB0' }}
          onClick={() => {
            if (!isDisabled) {
              copy(`${question.id}`);
            }
          }}
        />
        <DeleteIcon
          style={{ color: '#9F9FB0' }}
          onClick={() => {
            if (!isDisabled) {
              remove(`${question.id}`);
            }
          }}
        />
        <Switch
          value={question.optional}
          style={isDisabled ? { opacity: '0.7' } : undefined}
          onValue={() => {
            if (!isDisabled) {
              changeOptional();
            }
          }}
          label="Optional"
        />
      </QuestionFooter>
    </QuestionMain>
  );
};

export default Question;
