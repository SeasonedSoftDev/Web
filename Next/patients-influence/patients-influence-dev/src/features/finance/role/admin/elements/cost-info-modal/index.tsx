import React, { useState } from 'react';
import { Modal, Tabs } from 'components/custom';
import { TCreateFinanceModalProps } from 'features/finance/role/admin/elements/create-finance-modal/types';
import {
  CreateFinanceModalMain,
  CostTitle,
} from 'features/finance/role/admin/elements/cost-info-modal/styles';
import { Button, Input, InputGroup } from 'components/ui';
import { Stack } from 'components/system';
import { EditIcon } from 'components/svg';

const CreateFinanceModal = ({
  onClose,
  ...props
}: TCreateFinanceModalProps) => {
  const [state, setState] = useState({
    cost: '',
    amountC: null,
    currencyC: null,
    typeC: '',
    dateC: null,
    subjectC: null,
    vendor: null,
    balanceChange: null,
    project: '',
    emailC: null,

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
        <CostTitle>
          Cost Name
          <EditIcon
            style={
              disabled
                ? { cursor: 'pointer', color: '#7E839F' }
                : { cursor: 'pointer', color: '#448DC9' }
            }
            onClick={handleDisabled}
          />
        </CostTitle>
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
        <Tabs
          tabs={['Cost', 'Revenue', 'Management']}
          value={tab}
          onValue={setTab}
        />
        {tab === 0 && (
          <CreateFinanceModalMain columns={2}>
            <Input
              type="text"
              label="Cost"
              placeholder="Please Enter"
              value={state.cost}
              onValue={(cost) => setState({ ...state, cost })}
              disabled={disabled}
            />
            <InputGroup
              label="Amount"
              inputRatio="100px 1fr"
              disabled={disabled}
              elements={[
                {
                  value: state.currencyC,
                  onValue: (currencyC) => setState({ ...state, currencyC }),
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
                  value: state.amountC,
                  onValue: (amountC) => setState({ ...state, amountC }),
                  type: 'text',
                  placeholder: '18',
                },
              ]}
            />
            <Input
              type="select"
              label="Type"
              placeholder="Please Enter"
              disabled={disabled}
              value={state.typeC}
              onValue={(typeC) => setState({ ...state, typeC })}
            />
            <Input
              type="date"
              label="Date"
              placeholder="Please Select"
              disabled={disabled}
              value={state.dateC}
              onValue={(dateC) => setState({ ...state, dateC })}
            />
            <Input
              type="select"
              label="Subject"
              placeholder="Please Select"
              disabled={disabled}
              value={state.subjectC}
              onValue={(subjectC) => setState({ ...state, subjectC })}
            />
            <Input
              type="select"
              label="Vendor"
              placeholder="Please Select"
              disabled={disabled}
              value={state.vendor}
              onValue={(vendor) => setState({ ...state, vendor })}
            />
            <Input
              type="select"
              label="Balance Change"
              placeholder="Please Select"
              disabled={disabled}
              value={state.balanceChange}
              onValue={(balanceChange) => setState({ ...state, balanceChange })}
            />
            <Input
              type="select"
              label="Project"
              placeholder="Please Select"
              disabled={disabled}
              value={state.project}
              onValue={(project) => setState({ ...state, project })}
            />
            <Input
              type="select"
              label="Email"
              placeholder="Please Select"
              disabled={disabled}
              value={state.emailC}
              onValue={(emailC) => setState({ ...state, emailC })}
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
