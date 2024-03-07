import React, { useEffect, useState } from 'react';
import { Modal } from 'components/custom';
import { TAddReportModalProps } from 'features/reports/role/admin/elements/create-report-modal/types';
import { AddReportModalMain } from 'features/reports/role/admin/elements/create-report-modal/styles';
import { Button, Input } from 'components/ui';
import { GridCell } from 'components/system';
import { useModal, useSnackbar } from 'hooks';
import { ApproveReportsModal } from 'features/reports/role/admin/elements';
import { CampaignAPI } from 'api';

const AddReportModal = ({
  campaign,
  onClose,
  refresh,
  ...props
}: TAddReportModalProps) => {
  const [state, setState] = useState<any>({
    campaign: campaign || null,
    reportType: {
      label: 'Yes',
      value: 1,
    },
    budget: '',
    additional: '',
  });
  const [campaigns, setCampaigns] = useState<any>([]);

  const getCampaigns = async () => {
    const { result } = await CampaignAPI.getCampaigns({
      withNoReportOnly: true,
    });

    setCampaigns(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const { push } = useSnackbar();

  useEffect(() => {
    getCampaigns();
  }, []);

  const createReport = async () => {
    try {
      await CampaignAPI.createReport({
        campaignId: state.campaign.value,
        budget: parseInt(state.budget, 10),
        reportType: state.reportType.value,
        description: state.additional,
      }).then(() => refresh());
      push('Successfully createad a report.', { variant: 'success' });
    } catch {
      push('Report creation failed.', { variant: 'error' });
    }
  };

  // const [arModal, openArModal, closeArModal] = useModal(false);

  const disabled = !state.campaign;

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  return (
    <Modal
      size="medium"
      title="Create Report"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          disabled={disabled}
          onClick={() => {
            createReport();
            onClose();
          }}
        >
          Create
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <AddReportModalMain columns={2}>
        <Input
          type="select"
          label="Campaign"
          placeholder="Select Campaign"
          value={state.campaign}
          onValue={(input) => setState({ ...state, campaign: input })}
          options={campaigns}
          onSearch={debounce(getCampaigns, 250)}
          required
        />
        <Input
          type="select"
          label="Report Type"
          placeholder="Please Select"
          disabled
          value={state.reportType}
          onValue={(reportType) => setState({ ...state, reportType })}
        />
        <Input
          type="text"
          label="Budget"
          placeholder="Please Enter"
          value={state.budget}
          onValue={(budget) => setState({ ...state, budget })}
        />
        <GridCell columnSpan={2}>
          <Input
            type="text"
            label="Additional Information"
            value={state.additional}
            onValue={(additional) => setState({ ...state, additional })}
            multiline
            rows={5}
          />
        </GridCell>
      </AddReportModalMain>
      {/* {arModal && <ApproveReportsModal onClose={closeArModal} />} */}
    </Modal>
  );
};

export default AddReportModal;
