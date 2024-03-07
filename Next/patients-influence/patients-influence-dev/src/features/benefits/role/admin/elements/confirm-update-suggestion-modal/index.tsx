import React from 'react';
import { Modal } from 'components/custom';
import { TConfirmUpdateSuggestionModalProps } from 'features/benefits/role/admin/elements/confirm-update-suggestion-modal/types';
import { ConfirmUpdateSuggestionModalMain } from 'features/benefits/role/admin/elements/confirm-update-suggestion-modal/styles';
import { Button } from 'components/ui';

const ConfirmUpdateSuggestion = ({
  onClose,
  ...props
}: TConfirmUpdateSuggestionModalProps) => (
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
        onClick={onClose}
      >
        Yes
      </Button>,
    ]}
    onClose={onClose}
    {...props}
  >
    <ConfirmUpdateSuggestionModalMain columns={1}>
      <p>
        Are you sure you want to confirm changes for the Suggestion? <br />
        Operation cannot be undone.
      </p>
    </ConfirmUpdateSuggestionModalMain>
  </Modal>
);

export default ConfirmUpdateSuggestion;
