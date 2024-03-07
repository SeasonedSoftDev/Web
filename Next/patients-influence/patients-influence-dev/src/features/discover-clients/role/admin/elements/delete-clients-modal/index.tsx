import React from 'react';
import { Modal } from 'components/custom';
import { TDeleteClientsModalProps } from 'features/discover-clients/role/admin/elements/delete-clients-modal/types';
import { DeleteClientsModalMain } from 'features/discover-clients/role/admin/elements/delete-clients-modal/styles';
import { Button } from 'components/ui';

const DeleteClientsModal = ({
  onClose,
  handleDelete,
  ...props
}: TDeleteClientsModalProps) => (
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
        onClick={() => {
          if (handleDelete) {
            handleDelete().then(() => {
              onClose();
            });
          } else {
            onClose();
          }
        }}
      >
        Yes
      </Button>,
    ]}
    onClose={onClose}
    {...props}
  >
    <DeleteClientsModalMain>
      Are you sure that you want to remove a client? <br /> Operation cannot be
      undone.
    </DeleteClientsModalMain>
  </Modal>
);

export default DeleteClientsModal;
