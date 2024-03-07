import React, { useState } from 'react';
import { CurrencyFeedback, Modal } from 'components/custom';
import { TAddReportModalProps } from 'features/reports/role/client/elements/created-report-modal/types';
import { AddReportModalMain } from 'features/reports/role/client/elements/created-report-modal/styles';
import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';

const AddReportModal = ({ data, onClose, ...props }: TAddReportModalProps) => {
  const [state, setState] = useState<any>({
    campaign: {
      value: data.campaign.id,
      label: data.campaign.name,
    },
    reportType:
      data.reportType === 1
        ? { value: 1, label: 'Yes' }
        : { value: 0, label: 'No' },
    budget: data.platformProductOrder.budget,
    additional: data.description,
  });

  return (
    <Modal
      size="medium"
      title="Created Report"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => {
            onClose();
          }}
        >
          Close
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <AddReportModalMain columns={2}>
        <Input
          type="select"
          label="Campaign"
          placeholder="Please Select"
          value={state.campaign}
          onValue={(input) => setState({ ...state, campaign: input })}
          disabled
        />
        <Input
          type="select"
          label="Report Type"
          placeholder="Please Select"
          value={state.reportType}
          onValue={(reportType) => setState({ ...state, reportType })}
          disabled
        />
        <Stack>
          <Input
            type="number"
            label="Budget"
            startAdornment="CHF"
            placeholder="Please Enter"
            value={state.budget}
            onValue={(budget) => setState({ ...state, budget })}
            disabled
          />
          <CurrencyFeedback value={state.budget} />
        </Stack>

        <GridCell columnSpan={2}>
          <Input
            type="text"
            label="Additional Information"
            value={state.additional}
            onValue={(additional) => setState({ ...state, additional })}
            multiline
            rows={5}
            disabled
          />
        </GridCell>
      </AddReportModalMain>
    </Modal>
  );
};

export default AddReportModal;
