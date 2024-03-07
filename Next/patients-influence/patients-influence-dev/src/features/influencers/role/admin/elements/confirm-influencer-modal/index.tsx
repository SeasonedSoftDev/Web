import React from 'react';
import { Modal } from 'components/custom';
import { TConfirmInfluencerModalProps } from 'features/influencers/role/admin/elements/confirm-influencer-modal/types';
import { ConfirmInfluencerModalMain } from 'features/influencers/role/admin/elements/confirm-influencer-modal/styles';
import { Button } from 'components/ui';

const DeleteInfluencerModal = ({
  onClose,
  ...props
}: TConfirmInfluencerModalProps) => (
  <Modal
    size="small"
    title="Please Confirm"
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
    <ConfirmInfluencerModalMain>
      Are you sure that you want to start updating with scrapping tool? <br />
      Operation will take some time.
    </ConfirmInfluencerModalMain>
  </Modal>
);

export default DeleteInfluencerModal;
