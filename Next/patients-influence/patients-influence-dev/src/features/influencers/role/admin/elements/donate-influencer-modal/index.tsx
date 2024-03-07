import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TDonateInfluencersModalProps } from 'features/influencers/role/admin/elements/donate-influencer-modal/types';
import { DonateInfluencersModalMain } from 'features/influencers/role/admin/elements/donate-influencer-modal/style';
import { Button, Input, InputGroup } from 'components/ui';
import { Stack } from 'components/system';

const DonateInfluencerModal = ({
  onClose,
  ...props
}: TDonateInfluencersModalProps) => {
  const [state, setState] = useState({
    project: null,
    currency: null,
    amount: '',
    message: '',
  });
  return (
    <Modal
      size="small"
      title="Donate"
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
          onClick={onClose}
        >
          Yes
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <DonateInfluencersModalMain>
        <Stack>
          <Input
            type="select"
            label="Project"
            placeholder="Please Select"
            value={state.project}
            onValue={(project) => setState({ ...state, project })}
          />
          <Input
            type="number"
            label="Desired Amount to Donate"
            placeholder="Please Enter"
            value={state.amount}
            onValue={(value) => setState({ ...state, amount: value })}
            startAdornment="CHF"
          />
          <Input
            type="text"
            multiline
            rows={3}
            label="Message"
            placeholder="Write Message"
            value={state.message}
            onValue={(message) => setState({ ...state, message })}
          />
        </Stack>
      </DonateInfluencersModalMain>
    </Modal>
  );
};

export default DonateInfluencerModal;
