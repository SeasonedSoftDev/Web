import React, { useCallback, useEffect, useState } from 'react';
import { CurrencyFeedback, Modal } from 'components/custom';

import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { useSnackbar } from 'hooks';
import { EditIcon } from 'components/svg';
import { CampaignsTitle } from 'features/campaigns/role/admin/elements/created-campaign-modal/styles';
import { DiseaseAreaAPI, SMLApi } from 'api';
import { TCreatedSmlModalProps } from './types';
import { CreatedSmlModalMain } from './styles';

const CreatedSmlModal = ({
  data,
  refresh,
  onClose,
  ...props
}: TCreatedSmlModalProps) => {
  const [state, setState] = useState<any>({
    client: `${data.platformProductOrder.client.user.firstName} ${data.platformProductOrder.client.user.lastName}`,
    subscription: data.subscriptionLength
      ? {
          value: +data.subscriptionLength,
          label: `${data.subscriptionLength} Months`,
        }
      : null,
    platform: data.SMLPlatforms ? { value: 1, label: 'Instagram' } : null,
    diseaseArea: data.platformProductOrder.platformProductOrderDiseaseAreas
      ? data.platformProductOrder.platformProductOrderDiseaseAreas.map(
          (item: any) => ({
            value: item.diseaseArea.id,
            label: item.diseaseArea.name,
          })
        )
      : null,
    aiAnalytics: {
      value: +data.monthlyTokens,
      label: `${data.monthlyTokens} Tokens`,
    },
    currency: null,
    amount: data.platformProductOrder.budget
      ? data.platformProductOrder.budget
      : '',
    additional: data.smlDescription ? data.smlDescription : '',
  });
  const [loading, setLoading] = useState(false);
  const [diseaseArea, setDiseaseArea] = useState<any>([]);
  const [tokens, setTokens] = useState<any>([]);
  const [edit, setEdit] = useState<boolean>(false);

  const handleEdit = () => {
    setEdit((prev) => !prev);
  };

  const { push } = useSnackbar();

  const getDiseaseArea = async (s: string = '') => {
    setLoading(true);
    const { result } = await DiseaseAreaAPI.getAll(s);

    setDiseaseArea(
      result.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    );
    setLoading(false);
  };

  const getTokens = async () => {
    const result = await SMLApi.getTokens();

    setTokens(
      result.map((item: any) => ({
        value: item.value,
        label: `${item.value} Tokens`,
      }))
    );
  };

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleNewTag = (v: any) => {
    setState({ ...state, diseaseAreas: [...state.diseaseAreas, v] });
  };

  useEffect(() => {
    getDiseaseArea();
    getTokens();
  }, []);

  const handleUpdate = useCallback(async () => {
    const body = {
      clientId: data.platformProductOrder.client.id,
      platforms: [state.platform?.value] || [],
      subscriptionLength: state.subscription?.value || null,
      monthlyTokens:
        state.aiAnalytics?.value !== null ? state.aiAnalytics?.value : null,
      diseaseAreas: state.diseaseArea.map((item: any) => item.value),
      budget: state.amount || null,
      smlDescription: state.additional || '',
      status: 1,
      productId: data.platformProductOrder.id,
    };

    try {
      await SMLApi.updateSML(body, data.id).then(() => {
        push('Successfully updated SML report', { variant: 'success' });
        refresh();
        onClose();
      });
    } catch (e: any) {
      push('Something went wrong.', { variant: 'error' });
    }
  }, [state, push, onClose, refresh, data.id]);

  const disabled =
    !state.platform ||
    state.diseaseArea.length === 0 ||
    !state.aiAnalytics ||
    !state.subscription ||
    !state.amount;

  return (
    <Modal
      size="medium"
      title={
        <CampaignsTitle>
          Created SML Report
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
          disabled={disabled}
          onClick={() => (edit ? handleUpdate() : onClose())}
        >
          {edit ? `Update` : `Close`}
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <CreatedSmlModalMain columns={2}>
        <Input
          type="select"
          label="Subscription"
          placeholder="Please Select"
          value={state.subscription}
          onValue={(subscription) => setState({ ...state, subscription })}
          disabled={!edit}
          options={[
            {
              value: 6,
              label: '6 Months',
            },
            {
              value: 12,
              label: '12 Months',
            },
          ]}
        />

        <Input
          type="select"
          label="Platform"
          placeholder="Please Select"
          value={state.platform}
          onValue={(platform) => setState({ ...state, platform })}
          disabled={!edit}
          options={[
            {
              value: 1,
              label: 'Instagram',
            },
          ]}
        />
        <Input
          type="multiselect"
          label="Disease Area"
          placeholder="Please Select"
          value={state.diseaseArea}
          onValue={(input) => {
            setState({ ...state, diseaseArea: input });
          }}
          disabled={!edit}
          options={diseaseArea}
          loading={loading}
          isFilterActive
        />
        <Input
          type="select"
          label="AI Analytics"
          placeholder="Please Select"
          value={state.aiAnalytics}
          onValue={(aiAnalytics) => setState({ ...state, aiAnalytics })}
          disabled={!edit}
          options={tokens}
        />
        <Stack>
          <Input
            type="number"
            label="Budget"
            placeholder="Please Enter"
            startAdornment="CHF"
            value={state.amount}
            onValue={(amount) => setState({ ...state, amount })}
            disabled={!edit}
          />
          <CurrencyFeedback value={state.amount} />
        </Stack>
        <Input
          type="text"
          label="Client"
          placeholder="Please Select"
          value={state.client}
          onValue={(client) => setState({ ...state, client })}
          disabled
        />
        <GridCell columnSpan={2}>
          <Input
            multiline
            rows={5}
            type="text"
            label="Additional Information"
            value={state.additional}
            onValue={(additional) => setState({ ...state, additional })}
            disabled={!edit}
          />
        </GridCell>
      </CreatedSmlModalMain>
    </Modal>
  );
};

export default CreatedSmlModal;
