import React, { useCallback, useState } from 'react';
import { Modal } from 'components/custom';
import { TExportCampaignsModalProps } from 'features/campaigns/role/admin/elements/export-campaigns-modal/types';
import { ExportCampaignsModalMain } from 'features/campaigns/role/admin/elements/export-campaigns-modal/styles';
import { Button, Checkbox, RadioButton } from 'components/ui';
import { CampaignAPI } from 'api';
import { convertToCSV, downloadCSV } from 'utilities/export-csv';

const ExportCampaignsModal = ({
  onClose,
  checkedIPCampaigns,
  checkedOCampaigns,
  checkedFCampaigns,
  ...props
}: TExportCampaignsModalProps) => {
  const [state, setState] = useState({
    inPreparation: false,
    finished: false,
    ongoing: false,
  });

  const [radioState, setRadioState] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadioState(e.target.value);
  };

  const getAllCampaigns = useCallback(async (status: number, type: string) => {
    await CampaignAPI.getAllCampaigns({ ids: [], status }).then((data) => {
      const csvContent = convertToCSV(data);
      downloadCSV(
        csvContent,
        `all-${type}-campaigns${new Date().toISOString()}.csv`
      );
    });
  }, []);

  const getSelectedCampaigns = useCallback(
    async (ids: number[], status: number, type: string) => {
      await CampaignAPI.getAllCampaigns({ ids, status }).then((data) => {
        const csvContent = convertToCSV(data);
        downloadCSV(
          csvContent,
          `selected-${type}-campaigns${new Date().toISOString()}.csv`
        );
      });
    },
    []
  );

  const handleExportAll = useCallback(async () => {
    if (state.inPreparation) {
      getAllCampaigns(0, 'in-preparation');
    }
    if (state.ongoing) {
      getAllCampaigns(1, 'ongoing');
    }
    if (state.finished) {
      getAllCampaigns(2, 'finished');
    }
  }, [state]);

  const handleExportSelected = useCallback(async () => {
    if (state.inPreparation) {
      getSelectedCampaigns(checkedIPCampaigns, 0, 'in-preparation');
    }
    if (state.ongoing) {
      getSelectedCampaigns(checkedOCampaigns, 1, 'ongoing');
    }
    if (state.finished) {
      getSelectedCampaigns(checkedFCampaigns, 2, 'finished');
    }
  }, [state, checkedIPCampaigns, checkedOCampaigns, checkedFCampaigns]);

  const handleExport = useCallback(async () => {
    if (radioState && radioState === 'all') {
      handleExportAll();
    } else if (radioState && radioState === 'selected') {
      handleExportSelected();
    }
  }, [state, radioState]);

  const disabled = useCallback(() => {
    const isRadioSet = radioState === 'all' || radioState === 'selected';

    if (
      (state.inPreparation && isRadioSet) ||
      (state.ongoing && isRadioSet) ||
      (state.finished && isRadioSet)
    ) {
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
      <ExportCampaignsModalMain columns={2}>
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
          label="Finished"
          size="large"
          value={state.finished}
          onValue={(finished) => setState({ ...state, finished })}
        />
      </ExportCampaignsModalMain>
    </Modal>
  );
};

export default ExportCampaignsModal;
