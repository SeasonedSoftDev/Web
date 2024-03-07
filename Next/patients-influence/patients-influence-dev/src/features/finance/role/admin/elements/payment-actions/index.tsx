import React, { useCallback, useState } from 'react';

import { useMenu, useModal, useSnackbar } from 'hooks';
import {
  ApproveIcon,
  DeclineIcon,
  DeleteIcon,
  VerticalDotsIcon,
} from 'components/svg';
import FinanceAPI from 'api/finance';
import { ISpan, PaymentActionsMain, PaymentActionsMenu } from './styles';
import { TPaymentActionsMenuProps } from './types';
import ApproveFinanceModal from '../approve-finance-modal';

const PaymentActions = ({
  data,
  reload,
  ...props
}: TPaymentActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);
  const [afModal, openAfModal, closeAfModal] = useModal(false);
  const [action, setAction] = useState<'approve' | 'remove' | 'decline'>(
    'approve'
  );

  const { push } = useSnackbar();

  const handleMenu = () => {
    setOpen(!open);
  };

  const approveTransactionFlow = async () => {
    try {
      const response = await FinanceAPI.approveTransactionFlow(data.id);

      if (response.status === 201) {
        push('Updated payment successfully.', { variant: 'success' });
        reload();
      }
    } catch (error: any) {
      push('Update payment failed.', { variant: 'error' });
    }
  };

  const declineTransactionFlow = async () => {
    try {
      const response = await FinanceAPI.declineTransactionFlow(data.id);

      if (response.status === 201) {
        push('Updated payment successfully.', { variant: 'success' });
        reload();
      }
    } catch (error: any) {
      push('Update payment failed.', { variant: 'error' });
    }
  };

  const emptyFunction = async () => {};

  const callback = useCallback(async () => {
    if (action === 'approve') {
      return approveTransactionFlow();
    }
    if (action === 'decline') {
      return declineTransactionFlow();
    }

    return emptyFunction();
  }, [action]);

  return (
    <PaymentActionsMain {...props}>
      <ISpan onClick={handleMenu} ref={buttonRef}>
        <VerticalDotsIcon />
      </ISpan>
      {open && (
        <PaymentActionsMenu
          position={position}
          items={[
            {
              icon: <ApproveIcon />,
              label: 'Approve',
              action: () => {
                setAction('approve');
                handleMenu();
                openAfModal();
              },
            },
            {
              icon: <DeclineIcon />,
              label: 'Decline',
              action: () => {
                setAction('decline');
                handleMenu();
                openAfModal();
              },
            },
          ]}
          ref={menu}
        />
      )}
      {afModal && (
        <ApproveFinanceModal
          onClose={closeAfModal}
          handleAction={async () => callback()}
          plural={false}
          type={action}
        />
      )}
    </PaymentActionsMain>
  );
};

export default PaymentActions;
