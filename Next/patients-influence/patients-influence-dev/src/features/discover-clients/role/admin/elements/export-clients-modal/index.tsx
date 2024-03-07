import React, { useCallback, useState } from 'react';
import { Modal } from 'components/custom';
import { TExportClientsModalProps } from 'features/discover-clients/role/admin/elements/export-clients-modal/types';
import { ExportClientsModalMain } from 'features/discover-clients/role/admin/elements/export-clients-modal/styles';
import { Button, Checkbox, RadioButton } from 'components/ui';
import { ClientAPI } from 'api';
import { convertToCSV, downloadCSV } from 'utilities/export-csv';

const ExportClientsModal = ({
  onClose,
  checkedRegClients,
  checkedSchedClients,
  ...props
}: TExportClientsModalProps) => {
  const [state, setState] = useState({
    registered: false,
    scheduled: false,
  });

  const [radioState, setRadioState] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadioState(e.target.value);
  };

  const getAllClients = useCallback(async (status: any, type: string) => {
    await ClientAPI.getAllDiscoverClients({
      ids: [],
      userStatus: status,
    }).then((data) => {
      const csvContent = convertToCSV(data);
      downloadCSV(
        csvContent,
        `all-${type}-discover-clients${new Date().toISOString()}.csv`
      );
    });
  }, []);

  const getSelectedInfluencers = useCallback(
    async (ids: number[], status: any, type: string) => {
      await ClientAPI.getAllDiscoverClients({
        ids,
        userStatus: status,
      }).then((data) => {
        const csvContent = convertToCSV(data);
        downloadCSV(
          csvContent,
          `selected-${type}-discover-clients${new Date().toISOString()}.csv`
        );
      });
    },
    []
  );

  const handleExportAll = useCallback(async () => {
    if (state.registered) {
      getAllClients([2, 3], 'registered');
    }
    if (state.scheduled) {
      getAllClients([7], 'scheduled');
    }
  }, [state]);

  const handleExportSelected = useCallback(async () => {
    if (state.registered) {
      getSelectedInfluencers(checkedRegClients, [2, 3], 'registered');
    }
    if (state.scheduled) {
      getSelectedInfluencers(checkedSchedClients, [7], 'scheduled');
    }
  }, [state, checkedRegClients, checkedSchedClients]);

  const handleExport = useCallback(async () => {
    if (radioState && radioState === 'all') {
      handleExportAll();
    } else if (radioState && radioState === 'selected') {
      handleExportSelected();
    }
  }, [state, radioState]);

  const disabled = useCallback(() => {
    const isRadioSet = radioState === 'all' || radioState === 'selected';

    if ((state.registered && isRadioSet) || (state.scheduled && isRadioSet)) {
      return false;
    }
    return true;
  }, [state, radioState]);

  return (
    <Modal
      size="small"
      title="Do you want to export:"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          disabled={disabled()}
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
        {/* <Checkbox
          color="secondary"
          label="Identified"
          size="large"
          value={state.identified}
          onValue={(identified) => setState({ ...state, identified })}
        /> */}
        <Checkbox
          color="secondary"
          label="Registered"
          size="large"
          value={state.registered}
          onValue={(registered) => setState({ ...state, registered })}
        />
        {/* <Checkbox
          color="secondary"
          label="Contacted"
          size="large"
          value={state.contacted}
          onValue={(contacted) => setState({ ...state, contacted })}
        /> */}
        <Checkbox
          color="secondary"
          label="Scheduled"
          size="large"
          value={state.scheduled}
          onValue={(callScheduled) =>
            setState({ ...state, scheduled: callScheduled })
          }
        />
      </ExportClientsModalMain>
    </Modal>
  );
};

export default ExportClientsModal;
