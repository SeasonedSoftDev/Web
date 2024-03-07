import React from 'react';
import { Modal } from 'components/custom';
import { DeleteInfluencerModalMain } from 'features/discover-influencers/role/admin/elements/delete-influencer-modal/styles';
import { Button } from 'components/ui';
import { capitalizeString } from 'utilities/string-converter';
import { TPromptInfluencerModalProps } from './types';

const SubmitLinkPrompt = ({
  onClose,
  handleAction,
  type = 'submit',
  target = 'link',
  ...props
}: TPromptInfluencerModalProps) => {
  const action = () => {
    switch (type) {
      case 'submit':
        return 'Submit';

      default:
        return 'Submit';
    }
  };

  return (
    <Modal
      size="small"
      title={`${capitalizeString(action())} ${capitalizeString(target)}`}
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
          onClick={() => {
            handleAction().then(() => {
              onClose();
            });
          }}
        >
          Yes
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <DeleteInfluencerModalMain>
        Are you sure that you want to {action().toLowerCase()} given {target} ?{' '}
        <br /> Operation cannot be undone.
      </DeleteInfluencerModalMain>
    </Modal>
  );
};

export default SubmitLinkPrompt;
