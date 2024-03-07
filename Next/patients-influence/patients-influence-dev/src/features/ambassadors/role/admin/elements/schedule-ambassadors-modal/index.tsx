import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TScheduleAmbassadorsModalProps } from 'features/ambassadors/role/admin/elements/schedule-ambassadors-modal/types';
import { ScheduleAmbassadorsModalMain } from 'features/ambassadors/role/admin/elements/schedule-ambassadors-modal/styles';
import { Button, Input, InputGroup, Switch } from 'components/ui';

const ScheduleAmbassadorsModal = ({
  onClose,
  ...props
}: TScheduleAmbassadorsModalProps) => {
  const [state, setState] = useState({
    title: '',
    type: null,
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    allDay: false,
    client: null,
    description: '',
  });

  return (
    <Modal
      size="small"
      title="Schedule"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Schedule
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <ScheduleAmbassadorsModalMain>
        <Input
          type="text"
          label="Title"
          placeholder="Add Title"
          value={state.title}
          onValue={(title) => setState({ ...state, title })}
        />
        <Input
          type="select"
          label="Type"
          placeholder="Please Select"
          value={state.type}
          onValue={(type) => setState({ ...state, type })}
        />
        {!state.allDay && (
          <InputGroup
            label="Time"
            inputRatio="1fr 1fr"
            elements={[
              {
                type: 'time',
                placeholder: 'From',
                value: state.startTime,
                onValue: (startTime) => setState({ ...state, startTime }),
              },
              {
                type: 'time',
                placeholder: 'To',
                value: state.endTime,
                onValue: (endTime) => setState({ ...state, endTime }),
              },
            ]}
          />
        )}
        <Switch
          label="All day"
          value={state.allDay}
          onValue={(allDay) => setState({ ...state, allDay })}
        />
        <Input
          type="select"
          label="Client"
          placeholder="Please Select"
          value={state.client}
          onValue={(client) => setState({ ...state, client })}
        />
        <Input
          multiline
          rows={5}
          type="text"
          label="Description"
          placeholder="Add Description"
          value={state.description}
          onValue={(description) => setState({ ...state, description })}
        />
      </ScheduleAmbassadorsModalMain>
    </Modal>
  );
};

export default ScheduleAmbassadorsModal;
