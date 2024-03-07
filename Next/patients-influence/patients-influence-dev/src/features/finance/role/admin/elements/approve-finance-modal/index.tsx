import React from 'react';
import { Modal } from 'components/custom';
import { TApproveFinanceModalProps } from 'features/finance/role/admin/elements/approve-finance-modal/types';
import {
  ApproveFinanceModalMain,
  ApproveFinanceText,
} from 'features/finance/role/admin/elements/approve-finance-modal/styles';
import { Button } from 'components/ui';
import { Stack } from 'components/system';

const ApproveFinanceModal = ({
  onClose,
  handleAction,
  type,
  target = 'payment',
  plural,
  ...props
}: TApproveFinanceModalProps) => {
  const action = type;

  const termMapping = {
    payment: {
      singular: 'payment',
      plural: 'payments',
    },
    withdrawal: {
      singular: 'withdrawal',
      plural: 'withdrawals',
    },
  };

  const entity = termMapping[target][plural ? 'plural' : 'singular'];

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
          onClick={() => handleAction().then(() => onClose())}
        >
          Yes
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <ApproveFinanceModalMain columns={1}>
          <ApproveFinanceText>
            Are you sure you want to {action?.toLocaleLowerCase()} selected{' '}
            {entity}? <br />
            Operation cannot be undone.
          </ApproveFinanceText>
        </ApproveFinanceModalMain>
      </Stack>
    </Modal>
  );
};

export default ApproveFinanceModal;
