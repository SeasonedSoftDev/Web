import React, { useCallback, useState } from 'react';
import { Modal } from 'components/custom';
import { TExportBenefitsModalProps } from 'features/benefits/role/influencer/elements/export-benefits-modal/types';
import { ExportBenefitsModalMain } from 'features/benefits/role/influencer/elements/export-benefits-modal/styles';
import { Button, RadioButton } from 'components/ui';
import { convertToCSV, downloadCSV } from 'utilities/export-csv';
import { BenefitsAPI } from 'api';

const ExportBenefitsModal = ({
  onClose,
  checkedBenefits,
  ...props
}: TExportBenefitsModalProps) => {
  const [radioState, setRadioState] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadioState(e.target.value);
  };

  const getAllBenefits = useCallback(async () => {
    await BenefitsAPI.getAllBenefits({ ids: [] }).then((data) => {
      const csvContent = convertToCSV(data);
      downloadCSV(csvContent, `all-benefits${new Date().toISOString()}.csv`);
    });
  }, []);

  const getSelectedCampaigns = useCallback(async (ids: number[]) => {
    await BenefitsAPI.getAllBenefits({ ids }).then((data) => {
      const csvContent = convertToCSV(data);
      downloadCSV(
        csvContent,
        `selected-benefits${new Date().toISOString()}.csv`
      );
    });
  }, []);

  const handleExport = useCallback(async () => {
    if (radioState && radioState === 'all') {
      getAllBenefits();
    } else if (radioState && radioState === 'selected') {
      getSelectedCampaigns(checkedBenefits);
    }
  }, [radioState, checkedBenefits]);

  return (
    <Modal
      size="small"
      title="Do you want to export:"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          disabled={!radioState}
          onClick={() => {
            handleExport();
            onClose();
          }}
        >
          Export
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <ExportBenefitsModalMain columns={2}>
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
      </ExportBenefitsModalMain>
    </Modal>
  );
};

export default ExportBenefitsModal;
