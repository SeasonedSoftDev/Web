import React, { useCallback, useState } from 'react';
import { Modal } from 'components/custom';
import { TExportSmlModalProps } from 'features/sml/role/admin/elements/export-sml-modal/types';
import { ExportSmlModalMain } from 'features/sml/role/admin/elements/export-sml-modal/styles';
import { Button, Checkbox, RadioButton } from 'components/ui';
import { SMLApi } from 'api';
import { convertToCSV, downloadCSV } from 'utilities/export-csv';

const ExportSmlModal = ({
  onClose,
  checkedSMLD,
  checkedSMLO,
  checkedSMLR,
  ...props
}: TExportSmlModalProps) => {
  const [state, setState] = useState({
    ordered: false,
    ready: false,
    delivered: false,
  });

  const [radioState, setRadioState] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadioState(e.target.value);
  };

  const getAllSMLs = useCallback(async (status: number, type: string) => {
    await SMLApi.getAllSMLs({ ids: [], status }).then((data) => {
      const csvContent = convertToCSV(data);
      downloadCSV(
        csvContent,
        `all-${type}-smls${new Date().toISOString()}.csv`
      );
    });
  }, []);

  const getSelectedSMLs = useCallback(
    async (ids: number[], status: number, type: string) => {
      await SMLApi.getAllSMLs({ ids, status }).then((data) => {
        const csvContent = convertToCSV(data);
        downloadCSV(
          csvContent,
          `selected-${type}-smls${new Date().toISOString()}.csv`
        );
      });
    },
    []
  );

  const handleExportAll = useCallback(async () => {
    if (state.ordered) {
      getAllSMLs(4, 'ordered');
    }
    if (state.ready) {
      getAllSMLs(5, 'ready');
    }
    if (state.delivered) {
      getAllSMLs(6, 'delivered');
    }
  }, [state]);

  const handleExportSelected = useCallback(async () => {
    if (state.ordered) {
      getSelectedSMLs(checkedSMLO, 4, 'ordered');
    }
    if (state.ready) {
      getSelectedSMLs(checkedSMLR, 5, 'ready');
    }
    if (state.delivered) {
      getSelectedSMLs(checkedSMLD, 6, 'delivered');
    }
  }, [state, checkedSMLD, checkedSMLO, checkedSMLR]);

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
    const isCheckboxSet = state.ordered || state.ready || state.delivered;
    return !isRadioSet || !isCheckboxSet;
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
      </ExportSmlModalMain>
    </Modal>
  );
};

export default ExportSmlModal;
