import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TOrderSmlModalProps } from 'features/sml/role/admin/elements/order-sml-modal/types';
import { OrderSmlModalMain } from 'features/sml/role/admin/elements/order-sml-modal/styles';
import { Button, Input, Switch } from 'components/ui';
import { Grid, GridCell, Stack } from 'components/system';

const OrderSmlModal = ({ onClose, ...props }: TOrderSmlModalProps) => {
  const [state, setState] = useState({
    client: null,
    company: null,
    diseaseArea: null,
    language: null,
    dateRange: null,
    subscription: null,
  });

  return (
    <Modal
      size="medium"
      title="Social Media Listening Order"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Create
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <OrderSmlModalMain columns={2}>
        <Input
          type="select"
          label="Client"
          placeholder="Please Select"
          value={state.client}
          onValue={(client) => setState({ ...state, client })}
        />
        <Input
          type="select"
          label="Company"
          placeholder="Please Select"
          value={state.company}
          onValue={(company) => setState({ ...state, company })}
        />
        <Input
          type="select"
          label="Disease Area"
          placeholder="Please Select"
          value={state.diseaseArea}
          onValue={(diseaseArea) => setState({ ...state, diseaseArea })}
          isFilterActive
        />
        <Input
          type="select"
          label="Language"
          placeholder="Please Select"
          value={state.language}
          onValue={(language) => setState({ ...state, language })}
        />
        <Input
          type="select"
          label="Date Range"
          placeholder="Please Select"
          value={state.dateRange}
          onValue={(dateRange) => setState({ ...state, dateRange })}
        />
        <Input
          type="select"
          label="Subscription"
          placeholder="Please Select"
          value={state.subscription}
          onValue={(subscription) => setState({ ...state, subscription })}
        />

        <GridCell columnSpan={2}>
          <Grid columns={2}>
            <Stack>
              <p>Stakeholders</p>
              <Switch label="Patients" />
              <Switch label="Caregivers" />
              <Switch label="Doctors" />
              <Switch label="Nurses" />
            </Stack>
            <Stack>
              <p>Platform</p>
              <Switch label="Instagram" />
              <Switch label="Twitter" />
              <Switch label="Tiktok" />
            </Stack>
          </Grid>
        </GridCell>
      </OrderSmlModalMain>
    </Modal>
  );
};

export default OrderSmlModal;
