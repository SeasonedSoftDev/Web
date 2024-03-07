import React from 'react';
import { Modal } from 'components/custom';
import { TQuestionsModalProps } from 'features/create-survey/elements/questions-modal/types';
import {
  QuestionsModalMain,
  QuestionsContainer,
  QuestionTop,
  QuestionBottom,
} from 'features/create-survey/elements/questions-modal/styles';
import { Button } from 'components/ui';

const QuestionsModal = ({
  onClose,
  firstName,
  lastName,
  questions,
  ...props
}: TQuestionsModalProps) => (
  <Modal
    size="medium"
    title={firstName + lastName}
    actions={[
      <Button
        color="primary"
        variant="contained"
        size="large"
        onClick={onClose}
      >
        Add
      </Button>,
    ]}
    onClose={onClose}
    {...props}
  >
    <QuestionsModalMain columns={1}>
      {questions.map((el: any, index: number) => (
        // eslint-disable-next-line react/no-array-index-key
        <QuestionsContainer key={index}>
          <QuestionTop>{el.question}</QuestionTop>
          <QuestionBottom>{el.answer}</QuestionBottom>
        </QuestionsContainer>
      ))}
    </QuestionsModalMain>
  </Modal>
);

export default QuestionsModal;
