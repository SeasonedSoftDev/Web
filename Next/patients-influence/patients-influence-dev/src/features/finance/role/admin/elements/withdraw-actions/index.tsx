import React, { useCallback, useState } from 'react';

import { useMenu, useModal, useSnackbar } from 'hooks';
import { ApproveIcon, DeclineIcon, VerticalDotsIcon } from 'components/svg';
import FinanceAPI from 'api/finance';
import { ISpan, WithdrawActionsMain, WithdrawActionsMenu } from './styles';
import { TWithdrawActionsMenuProps } from './types';
import ApproveFinanceModal from '../approve-finance-modal';

const WithdrawActions = ({
  data,
  reload,
  ...props
}: TWithdrawActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);
  const [modal, openModal, closeModal] = useModal(false);
  const [action, setAction] = useState<'approve' | 'remove' | 'decline'>(
    'approve'
  );
  const { push } = useSnackbar();

  const handleMenu = () => {
    setOpen(!open);
  };

  const approveWithdrawal = async () => {
    try {
      await FinanceAPI.approveWithdrawRequest(data.id).then(() => {
        push('Approve withdrawal successfully.', { variant: 'success' });
        reload();
      });
    } catch (error: any) {
      push('Approve withdrawal failed.', { variant: 'error' });
    }
  };

  const declineWithdrawal = async () => {
    try {
      await FinanceAPI.declineWithdrawRequest(data.id).then(() => {
        push('Decline withdrawal successfully.', { variant: 'success' });
        reload();
      });
    } catch (error: any) {
      push('Decline withdrawal failed.', { variant: 'error' });
    }
  };

  const emptyFunction = async () => {};

  const callback = useCallback(() => {
    if (action === 'approve') {
      return approveWithdrawal();
    }
    if (action === 'decline') {
      return declineWithdrawal();
    }

    return emptyFunction();
  }, [action]);

  return (
    <WithdrawActionsMain {...props}>
      <ISpan onClick={handleMenu} ref={buttonRef}>
        <VerticalDotsIcon />
      </ISpan>
      {open && (
        <WithdrawActionsMenu
          position={position}
          items={[
            {
              icon: <ApproveIcon />,
              label: 'Approve',
              action: () => {
                setAction('approve');
                handleMenu();
                openModal();
              },
            },
            {
              icon: <DeclineIcon />,
              label: 'Decline',
              action: () => {
                setAction('decline');
                handleMenu();
                openModal();
              },
            },
          ]}
          ref={menu}
        />
      )}
      {modal && (
        <ApproveFinanceModal
          onClose={closeModal}
          handleAction={async () => callback()}
          plural={false}
          type={action}
          target="withdrawal"
        />
      )}
    </WithdrawActionsMain>
  );
};

export default WithdrawActions;
