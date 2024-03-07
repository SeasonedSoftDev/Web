import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TExportCampaignsModalProps } from 'features/campaigns/role/admin/elements/export-campaigns-modal/types';
import { ExportCampaignsModalMain } from 'features/campaigns/role/admin/elements/export-campaigns-modal/styles';
import { Button, Checkbox, RadioButton } from 'components/ui';

const ExportCampaignsModal = ({
  onClose,
  ...props
}: TExportCampaignsModalProps) => {
  const [state, setState] = useState({
    inPreparation: false,
    finished: false,
    ongoing: false,
    reportReceived: false,
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
      <ExportCampaignsModalMain columns={2}>
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
          label="In Preparation"
          size="large"
          value={state.inPreparation}
          onValue={(inPreparation) => setState({ ...state, inPreparation })}
        />
        <Checkbox
          color="secondary"
          label="Ongoing"
          size="large"
          value={state.ongoing}
          onValue={(ongoing) => setState({ ...state, ongoing })}
        />
        <Checkbox
          color="secondary"
          label="Finished"
          size="large"
          value={state.finished}
          onValue={(finished) => setState({ ...state, finished })}
        />
        <Checkbox
          color="secondary"
          label="Report Received"
          size="large"
          value={state.reportReceived}
          onValue={(reportReceived) => setState({ ...state, reportReceived })}
        />
      </ExportCampaignsModalMain>
    </Modal>
  );
};

export default ExportCampaignsModal;
