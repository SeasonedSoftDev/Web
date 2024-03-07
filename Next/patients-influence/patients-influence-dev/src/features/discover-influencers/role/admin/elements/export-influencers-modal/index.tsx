import React, { useCallback, useState } from 'react';
import { Modal } from 'components/custom';
import { TExportInfluencersModalProps } from 'features/discover-influencers/role/admin/elements/export-influencers-modal/types';
import { ExportInfluencersModalMain } from 'features/discover-influencers/role/admin/elements/export-influencers-modal/styles';
import { Button, Checkbox, RadioButton } from 'components/ui';
import { InfluencerAPI } from 'api';
import { convertToCSV, downloadCSV } from 'utilities/export-csv';

const ExportInfluencersModal = ({
  onClose,
  checkedRegInfluencers,
  checkedToBeApprovedInfluencers,
  ...props
}: TExportInfluencersModalProps) => {
  const [state, setState] = useState({
    registered: false,
    toBeApproved: false,
  });

  const [radioState, setRadioState] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadioState(e.target.value);
  };

  const getAllInfluencers = useCallback(async (status: any, type: string) => {
    await InfluencerAPI.getAllDiscoverInfluencers({
      ids: [],
      userStatus: status,
    }).then((data) => {
      const csvContent = convertToCSV(data);
      downloadCSV(
        csvContent,
        `all-${type}-discover-influencers${new Date().toISOString()}.csv`
      );
    });
  }, []);

  const getSelectedInfluencers = useCallback(
    async (ids: number[], status: any, type: string) => {
      await InfluencerAPI.getAllDiscoverInfluencers({
        ids,
        userStatus: status,
      }).then((data) => {
        const csvContent = convertToCSV(data);
        downloadCSV(
          csvContent,
          `selected-${type}-discover-influencers${new Date().toISOString()}.csv`
        );
      });
    },
    []
  );

  const handleExportAll = useCallback(async () => {
    if (state.registered) {
      getAllInfluencers([2, 3], 'registered');
    }
    if (state.toBeApproved) {
      getAllInfluencers([4], 'toBeApproved');
    }
  }, [state]);

  const handleExportSelected = useCallback(async () => {
    if (state.registered) {
      getSelectedInfluencers(checkedRegInfluencers, [2, 3], 'registered');
    }
    if (state.toBeApproved) {
      getSelectedInfluencers(
        checkedToBeApprovedInfluencers,
        [4],
        'toBeApproved'
      );
    }
  }, [state, checkedRegInfluencers, checkedToBeApprovedInfluencers]);

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
      (state.registered && isRadioSet) ||
      (state.toBeApproved && isRadioSet)
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
        <Checkbox
          color="secondary"
          label="Registered"
          size="large"
          value={state.registered}
          onValue={(registered) => setState({ ...state, registered })}
        />
        <Checkbox
          color="secondary"
          label="To Be Approved"
          size="large"
          value={state.toBeApproved}
          onValue={(toBeApproved) => setState({ ...state, toBeApproved })}
        />
      </ExportInfluencersModalMain>
    </Modal>
  );
};

export default ExportInfluencersModal;
