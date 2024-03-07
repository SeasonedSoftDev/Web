import React from 'react';
import { Modal } from 'components/custom';
import { DeleteInfluencerModalMain } from 'features/discover-influencers/role/admin/elements/delete-influencer-modal/styles';
import { Button } from 'components/ui';
import { TPromptInfluencerModalProps } from './types';

const PromptModal = ({
  onClose,
  handleAction,
  type = 'delete',
  target = 'influencer',
  plural = false,
  ...props
}: TPromptInfluencerModalProps) => {
  const action = type === 'delete' ? 'Delete' : 'Approve';

  const termMapping = {
    influencer: {
      singular: 'influencer',
      plural: 'influencers',
    },
    client: {
      singular: 'client',
      plural: 'clients',
    },
    ambassador: {
      singular: 'ambassador',
      plural: 'ambassadors',
    },
  };

  const entity = termMapping[target][plural ? 'plural' : 'singular'];

  return (
    <Modal
      size="small"
      title={`${action} ${entity}`}
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
        Are you sure that you want to {action.toLowerCase()} selected {entity}?{' '}
        <br /> Operation cannot be undone.
      </DeleteInfluencerModalMain>
    </Modal>
  );
};

export default PromptModal;
