import React from 'react';

import { useMenu, useModal, useSnackbar } from 'hooks';
import { ReceivedIcon, VerticalDotsIcon } from 'components/svg';
import { PlatformProductOrderAPI } from 'api/platform-product-order';
import { ISpan, PendingActionsMain, PendingActionsMenu } from './styles';
import { TPendingActionsMenuProps } from './types';
import PromptModal from '../prompt-modal';

const PendingActions = ({
  data,
  reload,
  ...props
}: TPendingActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);
  const { push } = useSnackbar();
  const [
    receivePendingRevenues,
    openReceivePendingRevenues,
    closeReceivePendingRevenues,
  ] = useModal(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const updateStatus = async () => {
    try {
      const response = await PlatformProductOrderAPI.updateById(data.id, {
        financeStatus: 1,
      });

      if (response.status === 200) {
        push('Receive revenue successfully.', { variant: 'success' });
        reload();
      }
    } catch (error: any) {
      push('Receive revenue failed.', { variant: 'error' });
    }
  };

  return (
    <PendingActionsMain {...props}>
      <ISpan onClick={handleMenu} ref={buttonRef}>
        <VerticalDotsIcon />
      </ISpan>
      {open && (
        <PendingActionsMenu
          position={position}
          items={[
            {
              icon: <ReceivedIcon />,
              label: 'Received',
              action: () => {
                handleMenu();
                openReceivePendingRevenues();
              },
            },
          ]}
          ref={menu}
        />
      )}
      {receivePendingRevenues && (
        <PromptModal
          plural={false}
          target="revenue"
          onClose={() => {
            closeReceivePendingRevenues();
          }}
          handleAction={updateStatus}
        />
      )}
    </PendingActionsMain>
  );
};

export default PendingActions;
