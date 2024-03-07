import React from 'react';
import { Modal } from 'components/custom';
import { TDeleteAmbassadorsModalProps } from 'features/ambassadors/role/admin/elements/delete-ambassadors-modal/types';
import { DeleteAmbassadorsModalMain } from 'features/ambassadors/role/admin/elements/delete-ambassadors-modal/styles';
import { Button } from 'components/ui';

const DeleteAmbassadorsModal = ({
  onClose,
  ...props
}: TDeleteAmbassadorsModalProps) => (
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
    <DeleteAmbassadorsModalMain>
      Are you sure that you want to remove ambasador? <br /> Operation cannot be
      undone.
    </DeleteAmbassadorsModalMain>
  </Modal>
);

export default DeleteAmbassadorsModal;
