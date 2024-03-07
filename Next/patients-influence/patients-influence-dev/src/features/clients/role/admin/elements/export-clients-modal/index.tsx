import React, { useCallback, useState } from 'react';
import { Modal } from 'components/custom';
import { TExportClientsModalProps } from 'features/clients/role/admin/elements/export-clients-modal/types';
import { ExportClientsModalMain } from 'features/clients/role/admin/elements/export-clients-modal/styles';
import { Button, RadioButton } from 'components/ui';
import { ClientAPI } from 'api';
import { convertToCSV, downloadCSV } from 'utilities/export-csv';

const ExportClientsModal = ({
  onClose,
  checkedClients,
  ...props
}: TExportClientsModalProps) => {
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

  const getAllClients = async () => {
    await ClientAPI.getAllClients({ ids: [] }).then((data) => {
      const csvContent = convertToCSV(data);
      downloadCSV(csvContent, `all-clients${new Date().toISOString()}.csv`);
    });
  };

  const getSelectedClients = async (ids: number[]) => {
    await ClientAPI.getAllClients({ ids }).then((data) => {
      const csvContent = convertToCSV(data);
      downloadCSV(
        csvContent,
        `selected-clients${new Date().toISOString()}.csv`
      );
    });
  };

  const handleExport = useCallback(async () => {
    if (radioState && radioState === 'all') {
      getAllClients();
    } else if (radioState && radioState === 'selected') {
      getSelectedClients(checkedClients);
    }
  }, [radioState, checkedClients]);

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
      <ExportClientsModalMain columns={2}>
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
      </ExportClientsModalMain>
    </Modal>
  );
};

export default ExportClientsModal;
