import React from 'react';
import { Modal } from 'components/custom';
import { TConfirmRemoveSuggestionModalProps } from 'features/benefits/role/admin/elements/confirm-remove-suggestion-modal/types';
import { ConfirmRemoveSuggestionModalMain } from 'features/benefits/role/admin/elements/confirm-remove-suggestion-modal/styles';
import { Button } from 'components/ui';

const ConfirmRemoveSuggestionModal = ({
  onClose,
  handleAction,
  ...props
}: TConfirmRemoveSuggestionModalProps) => (
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
        onClick={handleAction}
      >
        Yes
      </Button>,
    ]}
    onClose={onClose}
    {...props}
  >
    <ConfirmRemoveSuggestionModalMain columns={1}>
      <p>
        Are you sure you want to remove the Suggestion? <br />
        Operation cannot be undone.
      </p>
    </ConfirmRemoveSuggestionModalMain>
  </Modal>
);

export default ConfirmRemoveSuggestionModal;
