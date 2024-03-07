import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TExportBenefitsModalProps } from 'features/benefits/role/influencer/elements/export-benefits-modal/types';
import { ExportBenefitsModalMain } from 'features/benefits/role/influencer/elements/export-benefits-modal/styles';
import { Button, RadioButton } from 'components/ui';

const ExportBenefitsModal = ({
  onClose,
  ...props
}: TExportBenefitsModalProps) => {
  const [state, setState] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
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
      <ExportBenefitsModalMain columns={2}>
        <RadioButton
          checked={state === 'all'}
          onChange={handleChange}
          value="all"
          label="All"
        />
        <RadioButton
          checked={state === 'selected'}
          onChange={handleChange}
          value="selected"
          label="Selected"
        />
      </ExportBenefitsModalMain>
    </Modal>
  );
};

export default ExportBenefitsModal;
