import React, { useState, useEffect } from 'react';
import {
  QuestionMain,
  QuestionHeader,
  QuestionCounter,
  QuestionBody,
} from 'features/create-client-survey/elements/question/styles';
import { Checkbox, Input, RadioButton } from 'components/ui';
import {
  TSurveyQuestionMultichoiceType,
  TSurveyQuestionMultiselectType,
} from 'features/create-survey/types';
import { Stack } from 'components/system';
import { useSnackbar } from 'hooks';
import { TQuestionProps } from './types';

const Question = ({
  isDisabled,
  question,
  questionIdx,
  handleCheckboxChange,
  handleRadioChange,
  handleTextFieldsChange,
  selectedRadioGroups,
  selectedCheckBoxGroups,
  questionAnswerResults,

  ...props
}: TQuestionProps) => {
  const [questionType, setQuestionType] = useState<{
    value: string;
    label: string;
  }>();

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

  const handleText = (value: string) => {
    handleTextFieldsChange(question.id, value);
  };

  const handleRadioChangeButton = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleRadioChange(question.id, +e.target.value);
  };

  useEffect(() => {
    const foundOption = questionOptions.find(
      (option) => option.value === question.type
    );
    setQuestionType(foundOption);
  }, [question]);

  return (
    <QuestionMain {...props}>
      <QuestionHeader>
        <QuestionCounter>
          <p>
            {questionIdx}. {question.question}{' '}
            {question.optional ? '' : '(Required)'}
          </p>
        </QuestionCounter>
      </QuestionHeader>
      <QuestionBody>
        {question.type === 'short' && (
          <Input
            type="text"
            placeholder={`Please enter your answer here to question ${questionIdx}`}
            value={
              questionAnswerResults.find(
                (questionRes) => questionRes.surveyQuestionId === question.id
              )?.surveyResponseText
            }
            onValue={(v: string) => {
              handleText(v);
            }}
            disabled={isDisabled}
          />
        )}
        {question.type === 'paragraph' && (
          <Input
            type="text"
            placeholder="Paragraph answer"
            multiline
            rows={3}
            value={
              questionAnswerResults.find(
                (questionRes) => questionRes.surveyQuestionId === question.id
              )?.surveyResponseText
            }
            onValue={(v: string) => {
              handleText(v);
            }}
            disabled={isDisabled}
          />
        )}
        {question.type === 'multichoice' &&
        question.answers &&
        question.answers.length > 0
          ? question.answers.map((el, index) =>
              !el.isOther ? (
                <Stack direction="horizontal" key={+el.id}>
                  <RadioButton
                    disabled={isDisabled}
                    label={`${el.value}`}
                    value={el.id}
                    onChange={handleRadioChangeButton}
                    name={`radio-group-${question.id}`}
                    checked={selectedRadioGroups[question.id] === +el.id}
                  />{' '}
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
                  <Checkbox
                    disabled={isDisabled}
                    value={
                      selectedCheckBoxGroups &&
                      selectedCheckBoxGroups[question.id]
                        ? selectedCheckBoxGroups[question.id].includes(+el.id)
                        : undefined
                    }
                    label={`${el.value}`}
                    name={`checkbox-group-${question.id}`}
                    onValue={(v: boolean) =>
                      handleCheckboxChange(question.id, +el.id)
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
                  <Checkbox
                    label={answer.value}
                    disabled={isDisabled}
                    value={
                      selectedCheckBoxGroups &&
                      selectedCheckBoxGroups[question.id]
                        ? selectedCheckBoxGroups[question.id].includes(
                            +answer.id
                          )
                        : undefined
                    }
                    name={`checkbox-group-${question.id}`}
                    onValue={(v: boolean) =>
                      handleCheckboxChange(question.id, +answer.id)
                    }
                  />
                ) : (
                  <RadioButton
                    checked={selectedRadioGroups[question.id] === +answer.id}
                    // checked={selectedRadioGroups[question.id] === +answer.id}
                    value={answer.id}
                    label={answer.value}
                    onChange={handleRadioChangeButton}
                    name={`radio-group-${question.id}`}
                    disabled={isDisabled}
                  />
                )}
              </Stack>
            ) : undefined
          )}
      </QuestionBody>
    </QuestionMain>
  );
};

export default Question;
