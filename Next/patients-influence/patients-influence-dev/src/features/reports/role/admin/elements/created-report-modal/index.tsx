import React, { useCallback, useEffect, useState } from 'react';
import { CurrencyFeedback, Modal } from 'components/custom';
import { AddReportModalMain } from 'features/reports/role/client/elements/created-report-modal/styles';
import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { CampaignsTitle } from 'features/campaigns/role/admin/elements/created-campaign-modal/styles';
import { EditIcon } from 'components/svg';
import { CampaignAPI, ClientAPI, EnumsApi } from 'api';
import { useSnackbar } from 'hooks';
import UsersAPI from 'api/users';
import { TCreatedReportModalProps } from './types';

const CreatedReportModal = ({
  data,
  onClose,
  reload,
  ...props
}: TCreatedReportModalProps) => {
  const [state, setState] = useState<any>({
    campaign: {
      value: data.campaign.id,
      label: data.campaign.name,
    },
    reportType:
      data.reportType === 1
        ? { value: 1, label: 'Yes' }
        : { value: 0, label: 'No' },
    budget: data.platformProductOrder.budget,
    additional: data.description,
    client: {
      value: data.campaign.platformProductOrder.client.userId,
      label: `${data.campaign.platformProductOrder.client.user.firstName} ${data.campaign.platformProductOrder.client.user.lastName}`,
    },
  });
  const [ambassador, setAmbassador] = useState<string>('');

  const [edit, setEdit] = useState<boolean>(false);

  const handleEdit = () => {
    setEdit((prev) => !prev);
  };

  const [report, setReport] = useState([]);

  const getReportTypes = async () => {
    const result = await EnumsApi.getReportTypes();

    setReport(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const getClient = useCallback(async () => {
    if (state.client && state.client?.value) {
      const { client } = await ClientAPI.getSingleClient(state.client.value);

      if (client && client.ambassador) {
        const response = await UsersAPI.getUser(client.ambassador.userId);

        setAmbassador(`${response.firstName} ${response.lastName}`);
      } else {
        setAmbassador('');
      }
    } else {
      setAmbassador('');
    }
  }, [state.client?.value]);

  useEffect(() => {
    getReportTypes();
    getClient();
  }, []);

  const { push } = useSnackbar();

  const handleUpdate = useCallback(async () => {
    const body = {
      description: state.additional,
      budget: +state.budget,
      reportType: state.reportType.value,
      campaignId: +state.campaign.value,
    };

    try {
      await CampaignAPI.updateReport(+data.id, body).then(() => {
        push('Campaign Updated Successfully', { variant: 'success' });
        reload();
        onClose();
      });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  }, [state, push, onClose, reload, data.id]);

  return (
    <Modal
      size="medium"
      title={
        <CampaignsTitle>
          {data.campaign && data.campaign?.name ? data.campaign.name : ''}
          <EditIcon
            style={
              edit
                ? { cursor: 'pointer', color: '#448DC9' }
                : { cursor: 'pointer', color: '#7E839F' }
            }
            onClick={handleEdit}
          />
        </CampaignsTitle>
      }
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => (edit ? handleUpdate() : onClose())}
        >
          {edit ? 'Update' : 'Close'}
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
          disabled
        />
        <Input
          type="select"
          label="Report Type"
          placeholder="Please Select"
          value={state.reportType}
          onValue={(reportType) => setState({ ...state, reportType })}
          disabled={!edit}
          options={report}
        />
        <Input
          type="text"
          label="Client"
          placeholder="Please Select"
          value={state.client.label ?? 'None'}
          onValue={(client) => setState({ ...state, client })}
          disabled
        />
        <Input
          type="text"
          label="Ambassador"
          placeholder="Please Select"
          value={ambassador ?? 'None'}
          onValue={(input) => setState({ ...state, ambassador: input })}
          disabled
        />
        <Stack>
          <Input
            type="number"
            label="Budget"
            startAdornment="CHF"
            placeholder="Please Enter"
            value={state.budget}
            onValue={(budget) => setState({ ...state, budget })}
            disabled={!edit}
            min={0}
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
            disabled={!edit}
          />
        </GridCell>
      </AddReportModalMain>
    </Modal>
  );
};

export default CreatedReportModal;
