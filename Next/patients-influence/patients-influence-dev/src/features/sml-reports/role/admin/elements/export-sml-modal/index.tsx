import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TExportSmlModalProps } from 'features/sml/role/admin/elements/export-sml-modal/types';
import { ExportSmlModalMain } from 'features/sml/role/admin/elements/export-sml-modal/styles';
import { Button, Checkbox, RadioButton } from 'components/ui';

const ExportSmlModal = ({ onClose, ...props }: TExportSmlModalProps) => {
  const [state, setState] = useState({
    tbc: false,
    finished: false,
    delivered: false,
    canceled: false,
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
          label="Ordered"
          size="large"
          value={state.tbc}
          onValue={(tbc) => setState({ ...state, tbc })}
        />
        <Checkbox
          color="secondary"
          label="Ready"
          size="large"
          value={state.finished}
          onValue={(finished) => setState({ ...state, finished })}
        />
        <Checkbox
          color="secondary"
          label="Delivered"
          size="large"
          value={state.delivered}
          onValue={(delivered) => setState({ ...state, delivered })}
        />
      </ExportSmlModalMain>
    </Modal>
  );
};

export default ExportSmlModal;
