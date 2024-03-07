import React, { useState } from 'react';
import { Chat, Modal, Tabs } from 'components/custom';
import { TCreateSmlTabsModalProps } from 'features/sml/role/admin/elements/create-sml-tabs-modal/types';
import { CreateSmlTabsModalMain } from 'features/sml/role/admin/elements/create-sml-tabs-modal/styles';
import { Button, Input, InputGroup } from 'components/ui';
import { GridCell, Stack } from 'components/system';

const CreateSmlTabsModal = ({
  onClose,
  ...props
}: TCreateSmlTabsModalProps) => {
  const [state, setState] = useState({
    client: null,
    subscription: null,
    platform: null,
    diseaseArea: null,
    aiAnalytics: null,
    currency: null,
    amount: '',
    additional: '',
    subscriptionUntilDate: null,

    chat: null,
    chatSubscription: '',

    comments: [],
    labels: [],
    meetings: [],
    reminders: [],
    tasks: [],
    created: null,
    status: null,
    statusChange: null,
  });

  const [tab, setTab] = useState(0);

  return (
    <Modal
      size="medium"
      title="Create SML Report"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Save
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack style={{ height: '550px' }}>
        <Tabs
          tabs={['Info', 'Chat', 'Management']}
          value={tab}
          onValue={setTab}
        />
        {tab === 0 && (
          <CreateSmlTabsModalMain columns={2}>
            <Input
              type="text"
              label="Client"
              placeholder="Please Select"
              value={state.client}
              onValue={(client) => setState({ ...state, client })}
            />
            <Input
              type="select"
              label="Subscription"
              placeholder="Please Select"
              value={state.subscription}
              onValue={(subscription) => setState({ ...state, subscription })}
            />

            <Input
              type="select"
              label="Platform"
              placeholder="Please Select"
              value={state.platform}
              onValue={(platform) => setState({ ...state, platform })}
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
              label="AI Analytics"
              placeholder="Please Select"
              value={state.aiAnalytics}
              onValue={(aiAnalytics) => setState({ ...state, aiAnalytics })}
            />
            <Input
              type="date"
              label="Subscription Until Date"
              placeholder="Please Select"
              value={state.subscriptionUntilDate}
              onValue={(subscriptionUntilDate) =>
                setState({ ...state, subscriptionUntilDate })
              }
            />
            <InputGroup
              label="Budget"
              inputRatio="100px 1fr"
              elements={[
                {
                  value: state.currency,
                  onValue: (currency) => setState({ ...state, currency }),
                  type: 'select',
                  placeholder: 'CHF',
                  options: [
                    {
                      value: 'eur',
                      label: 'EUR',
                    },
                    {
                      value: 'usd',
                      label: 'USD',
                    },
                    {
                      value: 'chf',
                      label: 'CHF',
                    },
                  ],
                },
                {
                  value: state.amount,
                  onValue: (amount) => setState({ ...state, amount }),
                  type: 'text',
                  placeholder: '18',
                },
              ]}
            />
            <GridCell columnSpan={2}>
              <Input
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
              type="select"
              label="Chat"
              placeholder="Please Select"
              value={state.chat}
              onValue={(chat) => setState({ ...state, chat })}
            />
            <Input
              type="text"
              label="Chat"
              placeholder="Until 23.12.2023"
              value={state.chatSubscription}
              onValue={(chatSubscription) =>
                setState({ ...state, chatSubscription })
              }
            />
            <GridCell columnSpan={2}>{/* <Chat /> */}</GridCell>
          </CreateSmlTabsModalMain>
        )}
        {tab === 2 && (
          <CreateSmlTabsModalMain columns={2}>
            <Input
              type="multiselect"
              label="Comments"
              placeholder="Please Select"
              value={state.comments}
              onValue={(comments) => setState({ ...state, comments })}
            />
            <Input
              type="multiselect"
              label="Labels"
              placeholder="Please Select"
              value={state.labels}
              onValue={(labels) => setState({ ...state, labels })}
            />
            <Input
              type="multiselect"
              label="Meetings"
              placeholder="Please Select"
              value={state.meetings}
              onValue={(meetings) => setState({ ...state, meetings })}
            />
            <Input
              type="multiselect"
              label="Reminders"
              placeholder="Please Select"
              value={state.reminders}
              onValue={(reminders) => setState({ ...state, reminders })}
            />
            <Input
              type="multiselect"
              label="Tasks"
              placeholder="Please Select"
              value={state.tasks}
              onValue={(tasks) => setState({ ...state, tasks })}
            />
            <Input
              type="date"
              label="Created"
              placeholder="Please Select"
              value={state.created}
              onValue={(created) => setState({ ...state, created })}
            />
            <Input
              type="text"
              label="Status"
              placeholder="Please Select"
              value={state.status}
              onValue={(status) => setState({ ...state, status })}
            />
            <Input
              type="text"
              label="Status Changed"
              placeholder="Please Select"
              value={state.statusChange}
              onValue={(statusChange) => setState({ ...state, statusChange })}
            />
          </CreateSmlTabsModalMain>
        )}
      </Stack>
    </Modal>
  );
};

export default CreateSmlTabsModal;
