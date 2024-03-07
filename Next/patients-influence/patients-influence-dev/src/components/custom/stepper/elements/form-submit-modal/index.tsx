import React from 'react';
import { Modal } from 'components/custom';
import { Button } from 'components/ui';
import { SubmitFormModal } from './styles';
import { TPromptFormSubmitModalProps } from './types';

const PromptFormSubmitModal = ({
  onClose,
  onSubmit,
  ...props
}: TPromptFormSubmitModalProps) => (
  <Modal
    size="small"
    title="Are you sure?"
    actions={[
      <Button
        color="default"
        variant="contained"
        size="large"
        onClick={onClose}
      >
        No
      </Button>,
      <Button
        color="primary"
        variant="contained"
        size="large"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onSubmit(event as unknown as React.FormEvent<HTMLDivElement>);
          onClose();
        }}
      >
        Yes
      </Button>,
    ]}
    onClose={onClose}
    {...props}
  >
    <SubmitFormModal>
      Are you sure that you want to submit the registration? <br />
      Some Desired Amount fields haven&apos;t been filled.
    </SubmitFormModal>
  </Modal>
);

export default PromptFormSubmitModal;
