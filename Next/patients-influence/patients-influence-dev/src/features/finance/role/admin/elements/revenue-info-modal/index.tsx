import React, { useState } from 'react';
import { Modal, Tabs } from 'components/custom';
import { TCreateFinanceModalProps } from 'features/finance/role/admin/elements/create-finance-modal/types';
import {
  CreateFinanceModalMain,
  RevenueTitle,
} from 'features/finance/role/admin/elements/revenue-info-modal/styles';
import { Button, Input, InputGroup } from 'components/ui';
import { Stack } from 'components/system';
import { EditIcon } from 'components/svg';

const CreateFinanceModal = ({
  onClose,
  ...props
}: TCreateFinanceModalProps) => {
  const [state, setState] = useState({
    revenue: '',
    amountR: null,
    currencyR: null,
    typeR: '',
    dateR: null,
    subjectR: null,
    emailR: '',

    comments: [],
    labels: [],
    meetings: [],
    reminders: [],
    tasks: [],
    created: null,
    status: null,
    statusChanged: null,
  });

  const [tab, setTab] = useState(0);

  const [disabled, setDisabled] = useState(true);

  const handleDisabled = () => {
    setDisabled(!disabled);
  };

  // const handleFile = async () => {};

  return (
    <Modal
      size="medium"
      title={
        <RevenueTitle>
          Revenue Name
          <EditIcon
            style={
              disabled
                ? { cursor: 'pointer', color: '#7E839F' }
                : { cursor: 'pointer', color: '#448DC9' }
            }
            onClick={handleDisabled}
          />
        </RevenueTitle>
      }
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          {disabled ? 'Edit' : 'Save'}
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack style={{ height: '500px' }}>
        <Tabs tabs={['Revenue', 'Management']} value={tab} onValue={setTab} />
        {tab === 0 && (
          <CreateFinanceModalMain columns={2}>
            <Input
              type="text"
              label="Revenue"
              placeholder="Please Enter"
              disabled={disabled}
              value={state.revenue}
              onValue={(revenue) => setState({ ...state, revenue })}
            />
            <InputGroup
              label="Amount"
              inputRatio="100px 1fr"
              disabled={disabled}
              elements={[
                {
                  value: state.currencyR,
                  onValue: (currencyR) => setState({ ...state, currencyR }),
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
                  value: state.amountR,
                  onValue: (amountR) => setState({ ...state, amountR }),
                  type: 'text',
                  placeholder: '18',
                },
              ]}
            />
            <Input
              type="select"
              label="Type"
              placeholder="Please Select"
              disabled={disabled}
              value={state.typeR}
              onValue={(typeR) => setState({ ...state, typeR })}
            />
            <Input
              type="date"
              label="Date"
              placeholder="Please Select"
              disabled={disabled}
              value={state.dateR}
              onValue={(dateR) => setState({ ...state, dateR })}
            />
            <Input
              type="select"
              label="Subject"
              placeholder="Please Select"
              disabled={disabled}
              value={state.subjectR}
              onValue={(subjectR) => setState({ ...state, subjectR })}
            />
            <Input
              type="select"
              label="Email"
              placeholder="Please Select"
              disabled={disabled}
              value={state.emailR}
              onValue={(emailR) => setState({ ...state, emailR })}
            />
          </CreateFinanceModalMain>
        )}
        {tab === 1 && (
          <CreateFinanceModalMain columns={2}>
            <Input
              type="multiselect"
              label="Comments"
              placeholder="Please Enter"
              value={state.comments}
              disabled={disabled}
              onValue={(comments) => setState({ ...state, comments })}
            />
            <Input
              type="multiselect"
              label="Labels"
              placeholder="Please Enter"
              value={state.labels}
              disabled={disabled}
              onValue={(labels) => setState({ ...state, labels })}
            />
            <Input
              type="multiselect"
              label="Meetings"
              placeholder="Please Enter"
              value={state.meetings}
              disabled={disabled}
              onValue={(meetings) => setState({ ...state, meetings })}
            />
            <Input
              type="multiselect"
              label="Reminders"
              placeholder="Please Enter"
              value={state.reminders}
              disabled={disabled}
              onValue={(reminders) => setState({ ...state, reminders })}
            />
            <Input
              type="multiselect"
              label="Tasks"
              placeholder="Please Enter"
              value={state.tasks}
              disabled={disabled}
              onValue={(tasks) => setState({ ...state, tasks })}
            />
            <Input
              type="date"
              label="Created"
              placeholder="Please Enter"
              value={state.created}
              disabled={disabled}
              onValue={(created) => setState({ ...state, created })}
            />
            <Input
              type="select"
              label="Status"
              placeholder="Please Enter"
              value={state.status}
              disabled={disabled}
              onValue={(status) => setState({ ...state, status })}
            />
            <Input
              type="date"
              label="Status Changed"
              placeholder="Please Enter"
              value={state.statusChanged}
              disabled={disabled}
              onValue={(statusChanged) => setState({ ...state, statusChanged })}
            />
          </CreateFinanceModalMain>
        )}
      </Stack>
    </Modal>
  );
};

export default CreateFinanceModal;
