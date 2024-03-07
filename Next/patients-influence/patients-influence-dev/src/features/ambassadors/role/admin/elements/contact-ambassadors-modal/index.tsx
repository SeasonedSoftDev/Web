import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TContactAmbassadorsModalProps } from 'features/ambassadors/role/admin/elements/contact-ambassadors-modal/types';
import { ContactAmbassadorsModalMain } from 'features/ambassadors/role/admin/elements/contact-ambassadors-modal/styles';
import { Button, Input } from 'components/ui';

const ContactAmbassadorsModal = ({
  onClose,
  ...props
}: TContactAmbassadorsModalProps) => {
  const [state, setState] = useState({
    subject: '',
    emailType: 'template',
    message: '',
  });

  return (
    <Modal
      size="small"
      title="Contact"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Send
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <ContactAmbassadorsModalMain>
        <Input
          type="text"
          label="Subject"
          placeholder="Write Subject"
          value={state.subject}
          onValue={(subject) => setState({ ...state, subject })}
        />
        <Input
          type="select"
          label="Email type"
          placeholder="Select Email type"
          value={state.emailType}
          onValue={(emailType) =>
            setState({ ...state, emailType: emailType.value })
          }
          options={[
            {
              value: 'template',
              label: 'Template',
            },
            {
              value: 'custom',
              label: 'Custom',
            },
          ]}
        />
        {state.emailType === 'custom' && (
          <Input
            multiline
            rows={5}
            type="text"
            label="Message"
            placeholder="Your Message"
            value={state.message}
            onValue={(message) => setState({ ...state, message })}
          />
        )}
      </ContactAmbassadorsModalMain>
    </Modal>
  );
};

export default ContactAmbassadorsModal;
