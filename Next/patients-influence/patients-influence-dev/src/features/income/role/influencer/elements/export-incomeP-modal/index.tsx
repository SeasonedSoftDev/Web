import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TExportIncomeModalProps } from 'features/income/role/influencer/elements/export-incomeP-modal/types';
import { ExportIncomeModalMain } from 'features/income/role/influencer/elements/export-incomeP-modal/styles';
import { Button, RadioButton } from 'components/ui';

const ExportIncomeModal = ({ onClose, ...props }: TExportIncomeModalProps) => {
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
      <ExportIncomeModalMain columns={2}>
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
      </ExportIncomeModalMain>
    </Modal>
  );
};

export default ExportIncomeModal;
