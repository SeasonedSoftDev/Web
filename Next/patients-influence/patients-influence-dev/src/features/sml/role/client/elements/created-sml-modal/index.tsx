import React, { useEffect, useState } from 'react';
import { CurrencyFeedback, Modal } from 'components/custom';
import { TAddSmlModalProps } from 'features/sml/role/client/elements/created-sml-modal/types';
import { AddSmlModalMain } from 'features/sml/role/client/elements/created-sml-modal/styles';
import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';

const AddSmlModal = ({
  data,
  refresh,
  onClose,
  ...props
}: TAddSmlModalProps) => {
  const [state, setState] = useState<any>({
    client: null,
    subscription: data.subscriptionLength
      ? { value: 0, label: `${data.subscriptionLength} Months` }
      : null,
    platform: data.SMLPlatforms ? { value: 0, label: 'Instagram' } : null,
    diseaseArea: data.diseaseArea && data.diseaseArea.name,
    aiAnalytics: data.monthlyTokens
      ? { value: 100, label: `${data.monthlyTokens} Tokens` }
      : null,
    currency: null,
    amount: data.budget ? data.budget : '',
    additional: data.smlDescription ? data.smlDescription : '',
  });

  return (
    <Modal
      size="medium"
      title="Created SML Report"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Close
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <AddSmlModalMain columns={2}>
        <Input
          type="select"
          label="Subscription"
          placeholder="Please Select"
          value={state.subscription}
          onValue={(subscription) => setState({ ...state, subscription })}
          disabled
        />

        <Input
          type="select"
          label="Platform"
          placeholder="Please Select"
          value={state.platform}
          onValue={(platform) => setState({ ...state, platform })}
          disabled
        />
        <Input
          type="text"
          label="Disease Area"
          placeholder="Please Select"
          value={state.diseaseArea}
          onValue={(input) => {
            setState({ ...state, diseaseArea: input });
          }}
          disabled
          isFilterActive
        />
        <Input
          type="select"
          label="AI Analytics"
          placeholder="Please Select"
          value={state.aiAnalytics}
          onValue={(aiAnalytics) => setState({ ...state, aiAnalytics })}
          disabled
        />
        <Stack>
          <Input
            type="number"
            label="Budget"
            placeholder="Please Enter"
            startAdornment="CHF"
            value={state.amount}
            onValue={(amount) => setState({ ...state, amount })}
            disabled
          />
          <CurrencyFeedback value={state.amount} />
        </Stack>
        <GridCell columnSpan={2}>
          <Input
            multiline
            rows={5}
            type="text"
            label="Additional Information"
            value={state.additional}
            onValue={(additional) => setState({ ...state, additional })}
            disabled
          />
        </GridCell>
      </AddSmlModalMain>
    </Modal>
  );
};

export default AddSmlModal;
