import React, { useState } from 'react';
import { Modal, Tabs } from 'components/custom';
import { TCreateSmlTabsModalProps } from 'features/sml/role/admin/elements/create-sml-tabs-modal/types';
import { CreateSmlTabsModalMain } from 'features/sml/role/admin/elements/create-sml-tabs-modal/styles';
import { Button, Input, Switch } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { InputLabel } from 'components/ui/input/styles';
import { EditIcon } from 'components/svg';

const CreateSmlTabsModal = ({
  onClose,
  ...props
}: TCreateSmlTabsModalProps) => {
  const [state, setState] = useState({
    company: null,
    client: null,
    diseaseArea: null,
    language: null,
    subscription: null,
    pricePerMonth: null,
    additional: '',

    comments: [],
    labels: [],
    meetings: [],
    reminders: [],
    tasks: [],
    created: null,
    timesSold: null,
    revenue: null,
  });

  const [tab, setTab] = useState(0);

  const [editable, setEditable] = useState(false);

  const handleEdit = () => {
    setEditable((prev) => !prev);
  };

  const firstTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      Create SML Report <EditIcon onClick={handleEdit} />
    </div>
  );
  const secondTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      Campaign name <EditIcon onClick={handleEdit} />
    </div>
  );

  return (
    <Modal
      size="medium"
      title={tab === 0 ? firstTitle : secondTitle}
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          {tab === 0 ? 'Create' : 'Close'}
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <Tabs tabs={['Info', 'Management']} value={tab} onValue={setTab} />
        {tab === 0 && (
          <CreateSmlTabsModalMain columns={2}>
            <Input
              disabled={editable}
              type="text"
              label="Company"
              placeholder="Please Select"
              value={state.company}
              onValue={(company) => setState({ ...state, company })}
            />
            <Input
              disabled={editable}
              type="select"
              label="Client"
              placeholder="Please Select"
              value={state.client}
              onValue={(client) => setState({ ...state, client })}
            />
            <Input
              disabled={editable}
              type="text"
              label="Disease Area"
              placeholder="Please Select"
              value={state.diseaseArea}
              onValue={(diseaseArea) => setState({ ...state, diseaseArea })}
              isFilterActive
            />
            <Input
              disabled={editable}
              type="select"
              label="Language"
              placeholder="Please Select"
              value={state.language}
              onValue={(language) => setState({ ...state, language })}
            />
            <Input
              disabled={editable}
              type="select"
              label="Subscription"
              placeholder="Please Select"
              value={state.subscription}
              onValue={(subscription) => setState({ ...state, subscription })}
            />
            <Input
              disabled={editable}
              type="select"
              label="Price per Month"
              placeholder="Please Select"
              value={state.pricePerMonth}
              onValue={(pricePerMonth) => setState({ ...state, pricePerMonth })}
            />
            <GridCell columnSpan={2}>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Package</InputLabel>
                  <Switch label="Competitive Analysis" />
                  <Switch label="Demographics" />
                  <Switch label="Insights" />
                </Stack>
                <Stack>
                  <InputLabel>Platform</InputLabel>
                  <Switch label="Instagram" />
                  <Switch label="Tiktok" />
                  <Switch label="Twitter" />
                </Stack>
              </Stack>
            </GridCell>
            <GridCell columnSpan={2}>
              <Input
                disabled={editable}
                multiline
                rows={5}
                type="text"
                label="Additional Information"
                value={state.additional}
                onValue={(additional) => setState({ ...state, additional })}
              />
            </GridCell>
          </CreateSmlTabsModalMain>
        )}
        {tab === 1 && (
          <CreateSmlTabsModalMain columns={2}>
            <Input
              disabled={editable}
              type="multiselect"
              label="Comments"
              value={state.comments}
              onValue={(comments) => setState({ ...state, comments })}
            />
            <Input
              disabled={editable}
              type="multiselect"
              label="Labels"
              value={state.labels}
              onValue={(labels) => setState({ ...state, labels })}
            />
            <Input
              disabled={editable}
              type="multiselect"
              label="Meetings"
              value={state.meetings}
              onValue={(meetings) => setState({ ...state, meetings })}
            />
            <Input
              disabled={editable}
              type="multiselect"
              label="Reminders"
              value={state.reminders}
              onValue={(reminders) => setState({ ...state, reminders })}
            />
            <Input
              disabled={editable}
              type="multiselect"
              label="Tasks"
              value={state.tasks}
              onValue={(tasks) => setState({ ...state, tasks })}
            />
            <Input
              disabled={editable}
              type="date"
              label="Created"
              value={state.created}
              onValue={(created) => setState({ ...state, created })}
            />
            <Input
              disabled={editable}
              type="text"
              label="Times Sold"
              value={state.timesSold}
              onValue={(timesSold) => setState({ ...state, timesSold })}
            />
            <Input
              disabled={editable}
              type="text"
              label="Revenue"
              value={state.revenue}
              onValue={(revenue) => setState({ ...state, revenue })}
            />
          </CreateSmlTabsModalMain>
        )}
      </Stack>
    </Modal>
  );
};

export default CreateSmlTabsModal;
