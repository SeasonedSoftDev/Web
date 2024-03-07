import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TChangePasswordModalProps } from 'features/account/role/ambasador/elements/change-password-modal/types';
import { ChangePasswordModalMain } from 'features/account/role/ambasador/elements/change-password-modal/styles';
import { Button, Input } from 'components/ui';
import { Stack } from 'components/system';

const ChangePasswordModal = ({
  onClose,
  ...props
}: TChangePasswordModalProps) => {
  const [state, setState] = useState({
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  });

  return (
    <Modal
      size="small"
      title="Do you want to change password?"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Change password
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <ChangePasswordModalMain columns={1}>
          <Input
            type="text"
            label="Enter old email"
            placeholder="Please Enter"
            value={state.oldPassword}
            onValue={(oldPassword) => setState({ ...state, oldPassword })}
          />
          <Input
            type="text"
            label="Enter new email"
            placeholder="Please Enter"
            value={state.newPassword}
            onValue={(newPassword) => setState({ ...state, newPassword })}
          />
          <Input
            type="text"
            label="Repeat new email"
            placeholder="Please Enter"
            value={state.repeatNewPassword}
            onValue={(repeatNewPassword) =>
              setState({ ...state, repeatNewPassword })
            }
          />
        </ChangePasswordModalMain>
      </Stack>
    </Modal>
  );
};

export default ChangePasswordModal;
