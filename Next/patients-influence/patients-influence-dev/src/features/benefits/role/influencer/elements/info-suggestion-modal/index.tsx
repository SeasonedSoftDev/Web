import React from 'react';
import { Modal } from 'components/custom';
import { DeleteInfluencerModalMain } from 'features/discover-influencers/role/admin/elements/delete-influencer-modal/styles';
import { Button } from 'components/ui';
import { capitalizeString } from 'utilities/string-converter';
import { TPromptInfluencerModalProps } from './types';

const InfoSuggestionModal = ({
  onClose,
  handleAction,
  ...props
}: TPromptInfluencerModalProps) => (
  <Modal
    size="small"
    title="Confirm Creating Suggestion"
    actions={[
      <Button
        color="primary"
        variant="contained"
        size="large"
        onClick={() => {
          handleAction().then(() => {
            onClose();
          });
        }}
      >
        Confirm
      </Button>,
    ]}
    onClose={onClose}
    {...props}
  >
    <DeleteInfluencerModalMain>
      You are about to create a new suggestion that will be visible only to you
      and the admins. The suggestion will be visible to everyone once the admin
      approves it.
    </DeleteInfluencerModalMain>
  </Modal>
);

export default InfoSuggestionModal;
