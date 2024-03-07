import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TChangeEmailModalProps } from 'features/account/role/ambasador/elements/change-email-modal/types';
import { ChangeEmailModalMain } from 'features/account/role/ambasador/elements/change-email-modal/styles';
import { Button, Input } from 'components/ui';
import { Stack } from 'components/system';

const ChangeEmailModal = ({ onClose, ...props }: TChangeEmailModalProps) => {
  const [state, setState] = useState({
    oldEmail: '',
    newEmail: '',
    repeatNewEmail: '',
  });

  return (
    <Modal
      size="small"
      title="Do you want to change email?"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
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
            label="Enter old email"
            placeholder="Please Enter"
            value={state.oldEmail}
            onValue={(oldEmail) => setState({ ...state, oldEmail })}
          />
          <Input
            type="text"
            label="Enter new email"
            placeholder="Please Enter"
            value={state.newEmail}
            onValue={(newEmail) => setState({ ...state, newEmail })}
          />
          <Input
            type="text"
            label="Repeat new email"
            placeholder="Please Enter"
            value={state.repeatNewEmail}
            onValue={(repeatNewEmail) => setState({ ...state, repeatNewEmail })}
          />
        </ChangeEmailModalMain>
      </Stack>
    </Modal>
  );
};

export default ChangeEmailModal;
