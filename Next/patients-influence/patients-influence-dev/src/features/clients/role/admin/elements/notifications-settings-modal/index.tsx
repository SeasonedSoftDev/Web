import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TNotificationsSettingsModalProps } from 'features/clients/role/admin/elements/notifications-settings-modal/types';
import { NotificationsSettingsModalMain } from 'features/clients/role/admin/elements/notifications-settings-modal/styles';
import { Button, Input, Switch } from 'components/ui';
import { InputLabel } from 'components/ui/input/styles';
import { Stack } from 'components/system';

const NotificationsSettingsModal = ({
  onClose,
  ...props
}: TNotificationsSettingsModalProps) => {
  const [state, setState] = useState({
    meetingDays: '',
    meetingHours: '',
    taskDays: '',
    taskHours: '',
    reminderDays: '',
    reminderHours: '',
    unchangedDays: '',
    unchangedHours: '',
    registered: false,
    verified: false,
  });

  return (
    <Modal
      size="small"
      title="Notifications Settings"
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
      <NotificationsSettingsModalMain columns={1}>
        <Stack>
          <Stack>
            <InputLabel>Notify me before Meeting</InputLabel>
            <Stack direction="horizontal">
              <Input
                value={state.meetingDays}
                onValue={(meetingDays) => setState({ ...state, meetingDays })}
                type="text"
                placeholder="Days"
              />
              <Input
                value={state.meetingHours}
                onValue={(meetingHours) => setState({ ...state, meetingHours })}
                type="text"
                placeholder="Hours"
              />
            </Stack>
          </Stack>
          <Stack>
            <InputLabel>Notify me before Task</InputLabel>
            <Stack direction="horizontal">
              <Input
                value={state.taskDays}
                onValue={(taskDays) => setState({ ...state, taskDays })}
                type="text"
                placeholder="Days"
              />
              <Input
                value={state.taskHours}
                onValue={(taskHours) => setState({ ...state, taskHours })}
                type="text"
                placeholder="Hours"
              />
            </Stack>
          </Stack>
          <Stack>
            <InputLabel>Notify me before Reminder</InputLabel>
            <Stack direction="horizontal">
              <Input
                value={state.reminderDays}
                onValue={(reminderDays) => setState({ ...state, reminderDays })}
                type="text"
                placeholder="Days"
              />
              <Input
                value={state.reminderHours}
                onValue={(reminderHours) =>
                  setState({ ...state, reminderHours })
                }
                type="text"
                placeholder="Hours"
              />
            </Stack>
          </Stack>
          <Stack>
            <InputLabel>Notify me when Status Unchanged more than</InputLabel>
            <Stack direction="horizontal">
              <Input
                value={state.unchangedDays}
                onValue={(unchangedDays) =>
                  setState({ ...state, unchangedDays })
                }
                type="text"
                placeholder="Days"
              />
              <Input
                value={state.unchangedHours}
                onValue={(unchangedHours) =>
                  setState({ ...state, unchangedHours })
                }
                type="text"
                placeholder="Hours"
              />
            </Stack>
          </Stack>

          <Stack>
            <InputLabel>Notify me when Status Changes to</InputLabel>
            <Stack direction="horizontal">
              <Switch label="In Preparation" />
              <Switch label="Finished" />
              <Switch label="Report Pending" />
            </Stack>
          </Stack>
        </Stack>
      </NotificationsSettingsModalMain>
    </Modal>
  );
};

export default NotificationsSettingsModal;
