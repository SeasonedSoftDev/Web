import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TExportSurveysModalProps } from 'features/surveys/role/client/elements/export-surveys-modal/types';
import { ExportSurveysModalMain } from 'features/surveys/role/client/elements/export-surveys-modal/styles';
import { Button, Checkbox, RadioButton } from 'components/ui';

const ExportSurveysModal = ({
  onClose,
  ...props
}: TExportSurveysModalProps) => {
  const [state, setState] = useState({
    inPreparation: false,
    ongoing: false,
    delivered: false,
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
      <ExportSurveysModalMain columns={2}>
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
          label="Delivered"
          size="large"
          value={state.delivered}
          onValue={(delivered) => setState({ ...state, delivered })}
        />
      </ExportSurveysModalMain>
    </Modal>
  );
};

export default ExportSurveysModal;
