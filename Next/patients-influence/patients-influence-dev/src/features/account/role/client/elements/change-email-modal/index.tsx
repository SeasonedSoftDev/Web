import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TChangeEmailModalProps } from 'features/account/role/ambasador/elements/change-email-modal/types';
import { ChangeEmailModalMain } from 'features/account/role/ambasador/elements/change-email-modal/styles';
import { Button, Input } from 'components/ui';
import { Stack } from 'components/system';
import { useAppContext } from 'context';
import { useSnackbar } from 'hooks';
import { ClientAPI } from 'api';

const ChangeEmailModal = ({ onClose, ...props }: TChangeEmailModalProps) => {
  const [state, setState] = useState({
    newEmail: '',
  });

  const { user } = useAppContext();

  const { push } = useSnackbar();

  const changeEmail = async () => {
    try {
      await ClientAPI.updateClient(state.newEmail, user.client.id);
      push('Email successfully updated!', { variant: 'success' });
    } catch {
      push('Email change failed', { variant: 'error' });
    }
  };

  return (
    <Modal
      size="small"
      title="Do you want to change email?"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => {
            changeEmail();
            onClose();
          }}
        >
          Change email
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <ChangeEmailModalMain columns={1}>
          <Input
            type="text"
            label="Enter new email"
            placeholder="Please Enter"
            value={state.newEmail}
            onValue={(newEmail) => setState({ ...state, newEmail })}
          />
        </ChangeEmailModalMain>
      </Stack>
    </Modal>
  );
};

export default ChangeEmailModal;
