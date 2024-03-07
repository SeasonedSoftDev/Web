import React from 'react';
import { Modal } from 'components/custom';
import { TConfirmChangeBenefitModalProps } from 'features/benefits/role/admin/elements/confirm-change-benefit-modal/types';
import { TConfirmChangeBenefitModalMain } from 'features/benefits/role/admin/elements/confirm-change-benefit-modal/styles';
import { Button } from 'components/ui';
import { useSnackbar } from 'hooks';
import { BenefitsAPI } from 'api';

const ConfirmChangeBenefitModal = ({
  handleAction,
  onClose,
  ...props
}: TConfirmChangeBenefitModalProps) => (
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
    <TConfirmChangeBenefitModalMain columns={1}>
      <p>
        Are you sure you want to change Benefit? <br />
        Operation cannot be undone.
      </p>
    </TConfirmChangeBenefitModalMain>
  </Modal>
);

export default ConfirmChangeBenefitModal;
