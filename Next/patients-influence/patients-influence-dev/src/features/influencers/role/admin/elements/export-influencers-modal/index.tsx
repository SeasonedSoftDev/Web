import React, { useCallback, useState } from 'react';
import { Modal } from 'components/custom';
import { TExportInfluencersModalProps } from 'features/influencers/role/admin/elements/export-influencers-modal/types';
import { ExportInfluencersModalMain } from 'features/influencers/role/admin/elements/export-influencers-modal/styles';
import { Button, RadioButton } from 'components/ui';
import { convertToCSV, downloadCSV } from 'utilities/export-csv';
import { InfluencerAPI } from 'api';

const ExportInfluencersModal = ({
  onClose,
  checkedInfluencers,
  ...props
}: TExportInfluencersModalProps) => {
  const [state, setState] = useState({
    identified: false,
    registered: false,
    contacted: false,
    callScheduled: false,
  });

  const [radioState, setRadioState] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadioState(e.target.value);
  };

  const getAllInfluencers = useCallback(async () => {
    await InfluencerAPI.getAllInfluencers({ ids: [] }).then((data) => {
      const csvContent = convertToCSV(data);
      downloadCSV(csvContent, `all-influencers${new Date().toISOString()}.csv`);
    });
  }, []);

  const getSelectedInfluencers = useCallback(async (ids: number[]) => {
    await InfluencerAPI.getAllInfluencers({ ids }).then((data) => {
      const csvContent = convertToCSV(data);
      downloadCSV(
        csvContent,
        `selected-influencers${new Date().toISOString()}.csv`
      );
    });
  }, []);

  const handleExport = useCallback(async () => {
    if (radioState && radioState === 'all') {
      getAllInfluencers();
    } else if (radioState && radioState === 'selected') {
      getSelectedInfluencers(checkedInfluencers);
    }
  }, [radioState, checkedInfluencers]);

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
      <ExportInfluencersModalMain columns={2}>
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
      </ExportInfluencersModalMain>
    </Modal>
  );
};

export default ExportInfluencersModal;
