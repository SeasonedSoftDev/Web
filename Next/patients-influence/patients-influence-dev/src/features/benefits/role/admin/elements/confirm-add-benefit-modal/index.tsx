import React from 'react';
import { Modal } from 'components/custom';
import { TConfirmAddBenefitModalProps } from 'features/benefits/role/admin/elements/confirm-add-benefit-modal/types';
import { TConfirmAddBenefitModalMain } from 'features/benefits/role/admin/elements/confirm-add-benefit-modal/styles';
import { Button } from 'components/ui';

const ConfirmAddBenefitModal = ({
  handleAction,
  onClose,
  ...props
}: TConfirmAddBenefitModalProps) => (
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
          handleAction();
        }}
      >
        Yes
      </Button>,
    ]}
    onClose={onClose}
    {...props}
  >
    <TConfirmAddBenefitModalMain columns={1}>
      <p>
        Are you sure you want to add Benefit? <br />
        Operation cannot be undone.
      </p>
    </TConfirmAddBenefitModalMain>
  </Modal>
);

export default ConfirmAddBenefitModal;
