import React from 'react';
import { Modal } from 'components/custom';
import { TDeleteInfluencerModalProps } from 'features/influencers/role/admin/elements/delete-influencer-modal/types';
import { DeleteInfluencerModalMain } from 'features/influencers/role/admin/elements/delete-influencer-modal/styles';
import { Button } from 'components/ui';

const DeleteInfluencerModal = ({
  onClose,
  ...props
}: TDeleteInfluencerModalProps) => (
  <Modal
    size="small"
    title="Delete Influencer"
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
    <DeleteInfluencerModalMain>
      Are you sure that you want to remove influencer? <br /> Operation cannot
      be undone.
    </DeleteInfluencerModalMain>
  </Modal>
);

export default DeleteInfluencerModal;
