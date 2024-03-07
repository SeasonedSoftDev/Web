import React, { useCallback, useState } from 'react';
import { Modal } from 'components/custom';
import { TExportReportsModalProps } from 'features/reports/role/admin/elements/export-reports-modal/types';
import { ExportReportsModalMain } from 'features/reports/role/admin/elements/export-reports-modal/styles';
import { Button, Checkbox, RadioButton } from 'components/ui';
import { CampaignAPI } from 'api';
import { convertToCSV, downloadCSV } from 'utilities/export-csv';

const ExportReportsModal = ({
  onClose,
  checkedReportsO,
  checkedReportsR,
  checkedReportsD,
  ...props
}: TExportReportsModalProps) => {
  const [state, setState] = useState({
    ordered: false,
    ready: false,
    delivered: false,
  });

  const [radioState, setRadioState] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadioState(e.target.value);
  };

  const getAllReports = useCallback(async (status: number, type: string) => {
    await CampaignAPI.getAllReports({ ids: [], status }).then((data) => {
      const csvContent = convertToCSV(data);
      downloadCSV(
        csvContent,
        `all-${type}-reports${new Date().toISOString()}.csv`
      );
    });
  }, []);

  const getSelectedReports = useCallback(
    async (ids: number[], status: number, type: string) => {
      await CampaignAPI.getAllReports({ ids, status }).then((data) => {
        const csvContent = convertToCSV(data);
        downloadCSV(
          csvContent,
          `selected-${type}-reports${new Date().toISOString()}.csv`
        );
      });
    },
    []
  );

  const handleExportAll = useCallback(async () => {
    if (state.ordered) {
      getAllReports(4, 'ordered');
    }
    if (state.ready) {
      getAllReports(5, 'ready');
    }
    if (state.delivered) {
      getAllReports(6, 'delivered');
    }
  }, [state]);

  const handleExportSelected = useCallback(async () => {
    if (state.ordered) {
      getSelectedReports(checkedReportsO, 4, 'ordered');
    }
    if (state.ready) {
      getSelectedReports(checkedReportsR, 5, 'ready');
    }
    if (state.delivered) {
      getSelectedReports(checkedReportsD, 6, 'delivered');
    }
  }, [state, checkedReportsO, checkedReportsR, checkedReportsD]);

  const handleExport = useCallback(() => {
    if (radioState && radioState === 'all') {
      handleExportAll();
    }
    if (radioState && radioState === 'selected') {
      handleExportSelected();
    }
  }, [state, radioState]);

  const disabled = useCallback(() => {
    const isRadioSet = radioState === 'all' || radioState === 'selected';
    const checkboxSet = state.ordered || state.ready || state.delivered;
    return !isRadioSet || !checkboxSet;
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
      <ExportReportsModalMain columns={2}>
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
          value={state.ordered}
          onValue={(ordered) => setState({ ...state, ordered })}
        />
        <Checkbox
          color="secondary"
          label="Ready"
          size="large"
          value={state.ready}
          onValue={(ready) => setState({ ...state, ready })}
        />
        <Checkbox
          color="secondary"
          label="Delivered"
          size="large"
          value={state.delivered}
          onValue={(delivered) => setState({ ...state, delivered })}
        />
      </ExportReportsModalMain>
    </Modal>
  );
};

export default ExportReportsModal;
