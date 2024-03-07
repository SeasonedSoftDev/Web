import React from 'react';
import { Modal } from 'components/custom';
import { TConfirmRemoveBenefitModalProps } from 'features/benefits/role/admin/elements/confirm-remove-benefit-modal/types';
import { ConfirmRemoveBenefitModalMain } from 'features/benefits/role/admin/elements/confirm-remove-benefit-modal/styles';
import { Button } from 'components/ui';
import { useSnackbar } from 'hooks';
import { BenefitsAPI } from 'api';

const ConfirmRemoveBenefitModal = ({
  action,
  id,
  onClose,
  ...props
}: TConfirmRemoveBenefitModalProps) => {
  const { push } = useSnackbar();

  const handleDelete = async () => {
    try {
      await BenefitsAPI.deleteBenefit(id);
      push('Benefit successfully deleted.', { variant: 'success' });
    } catch {
      push("Benefit couldn't be deleted.", { variant: 'error' });
    }
  };

  return (
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
            handleDelete();
            action();
            onClose();
          }}
        >
          Yes
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <ConfirmRemoveBenefitModalMain columns={1}>
        <p>
          Are you sure you want to remove the Benefit? <br />
          Operation cannot be undone.
        </p>
      </ConfirmRemoveBenefitModalMain>
    </Modal>
  );
};

export default ConfirmRemoveBenefitModal;
