import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TExportSmlModalProps } from 'features/sml/role/admin/elements/export-sml-modal/types';
import { ExportSmlModalMain } from 'features/sml/role/admin/elements/export-sml-modal/styles';
import { Button, Checkbox, RadioButton } from 'components/ui';

const ExportSmlModal = ({ onClose, ...props }: TExportSmlModalProps) => {
  const [state, setState] = useState({
    ofInterest: false,
    newAll: false,
    archive: false,
    subscriptions: false,
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
      <ExportSmlModalMain columns={2}>
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
          label="Of interest"
          size="large"
          value={state.ofInterest}
          onValue={(ofInterest) => setState({ ...state, ofInterest })}
        />
        <Checkbox
          color="secondary"
          label="New"
          size="large"
          value={state.newAll}
          onValue={(newAll) => setState({ ...state, newAll })}
        />
        <Checkbox
          color="secondary"
          label="Archive"
          size="large"
          value={state.archive}
          onValue={(archive) => setState({ ...state, archive })}
        />
        <Checkbox
          color="secondary"
          label="Subscriptions"
          size="large"
          value={state.subscriptions}
          onValue={(subscriptions) => setState({ ...state, subscriptions })}
        />
      </ExportSmlModalMain>
    </Modal>
  );
};

export default ExportSmlModal;
