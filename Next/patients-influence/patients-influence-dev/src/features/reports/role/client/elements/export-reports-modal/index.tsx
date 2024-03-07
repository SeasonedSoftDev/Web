import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TExportReportsModalProps } from 'features/reports/role/client/elements/export-reports-modal/types';
import { ExportReportsModalMain } from 'features/reports/role/client/elements/export-reports-modal/styles';
import { Button, Checkbox, RadioButton } from 'components/ui';

const ExportReportsModal = ({
  onClose,
  ...props
}: TExportReportsModalProps) => {
  const [state, setState] = useState({
    withoutReport: false,
    toBeCreated: false,
    received: false,
    approved: false,
  });

  const [radioState, setRadioState] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadioState(e.target.value);
  };

  return (
    <Modal
      size="small"
      title="Do you want to export:"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Export
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <ExportReportsModalMain columns={2}>
        <RadioButton
          checked={radioState === 'all'}
          onChange={handleChange}
          value="all"
          label="All"
        />
        <RadioButton
          checked={radioState === 'selected'}
          onChange={handleChange}
          value="selected"
          label="Selected"
        />
        <Checkbox
          color="secondary"
          label="Without Report"
          size="large"
          value={state.withoutReport}
          onValue={(withoutReport) => setState({ ...state, withoutReport })}
        />
        <Checkbox
          color="secondary"
          label="To Be Created"
          size="large"
          value={state.toBeCreated}
          onValue={(toBeCreated) => setState({ ...state, toBeCreated })}
        />
        <Checkbox
          color="secondary"
          label="Received"
          size="large"
          value={state.received}
          onValue={(received) => setState({ ...state, received })}
        />
        <Checkbox
          color="secondary"
          label="Approved"
          size="large"
          value={state.approved}
          onValue={(approved) => setState({ ...state, approved })}
        />
      </ExportReportsModalMain>
    </Modal>
  );
};

export default ExportReportsModal;
