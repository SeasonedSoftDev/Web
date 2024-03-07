import React, { useEffect, useState } from 'react';
import { CurrencyFeedback, Modal } from 'components/custom';
import { TAddReportModalProps } from 'features/reports/role/client/elements/create-report-modal/types';
import { AddReportModalMain } from 'features/reports/role/client/elements/create-report-modal/styles';
import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { CampaignAPI } from 'api';
import { useSnackbar } from 'hooks';

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

  // const [reportTypes, setReportTypes] = useState<any>([]);
  const [campaigns, setCampaigns] = useState<any>([]);

  // const getReportTypes = async () => {
  //   const result = await EnumsApi.getReportTypes();

  //   setReportTypes(
  //     result.map((x: any) => ({
  //       value: x.value,
  //       label: x.name,
  //     }))
  //   );
  // };

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
    // getReportTypes();
    getCampaigns();
  }, []);

  const createReport = async () => {
    try {
      await CampaignAPI.createReport({
        campaignId: state.campaign.value,
        budget: parseInt(state.budget, 10),
        reportType: state.reportType.value,
        description: state.additional,
      });
      push('Successfully createad a report.', { variant: 'success' });
    } catch {
      push('Report creation failed.', { variant: 'error' });
    }
  };

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
            refresh();
            onClose();
          }}
        >
          Create Report
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <AddReportModalMain columns={2}>
        <Input
          type="select"
          label="Campaign"
          placeholder="Please Select"
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
          // options={reportTypes}
        />
        <Stack>
          <Input
            type="number"
            label="Budget"
            startAdornment="CHF"
            placeholder="Please Enter"
            value={state.budget}
            onValue={(budget) => setState({ ...state, budget })}
          />
          <CurrencyFeedback value={state.budget} />
        </Stack>

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
    </Modal>
  );
};

export default AddReportModal;
