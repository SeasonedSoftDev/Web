import { Modal } from 'components/custom';
import { Button, Input, Switch } from 'components/ui';
import React, { useState, useEffect } from 'react';
import { TNotificationSettings } from 'components/custom/notifications-card/elements/settings/types';
import { NotificationSettingsMain } from 'components/custom/notifications-card/elements/settings/styles';
import { GridCell, Stack } from 'components/system';
import { InputLabel } from 'components/ui/input/styles';
import { useRouter } from 'next/router';

const NotificationSettings = ({ onClose, ...props }: TNotificationSettings) => {
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
    toBeApproved: false,
    campaignCreated: false,
    accepted: false,
    signed: false,
    submited: false,
    inPreparation: false,
    finished: false,
    withdrawalRequest: false,
    registeredAmbassador: false,
    clientMessage: false,
    influencerMessage: false,
    newOrder: false,
    influencerStatusChange: false,
    smlNewOrder: false,
    surveyNewOrder: false,
    participantStatusChange: false,
    participantMessage: false,
    reportsNewOrder: false,
    paymentsToBeApproved: false,
    suggestionAdded: false,
  });

  const { pathname } = useRouter();

  useEffect(() => {}, [pathname]);

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
      <NotificationSettingsMain columns={2}>
        <GridCell columnSpan={2}>
          <InputLabel style={{ marginBottom: '10px' }}>
            Notify me before Meeting
          </InputLabel>
          <Stack direction="horizontal">
            <Input
              type="text"
              placeholder="Days"
              value={state.meetingDays}
              onValue={(meetingDays) => setState({ ...state, meetingDays })}
            />
            <Input
              type="text"
              placeholder="Hours"
              value={state.meetingHours}
              onValue={(meetingHours) => setState({ ...state, meetingHours })}
            />
          </Stack>
        </GridCell>
        <GridCell columnSpan={2}>
          <InputLabel style={{ marginBottom: '10px' }}>
            Notify me before Task
          </InputLabel>
          <Stack direction="horizontal">
            <Input
              type="text"
              placeholder="Days"
              value={state.taskDays}
              onValue={(taskDays) => setState({ ...state, taskDays })}
            />
            <Input
              type="text"
              placeholder="Hours"
              value={state.taskHours}
              onValue={(taskHours) => setState({ ...state, taskHours })}
            />
          </Stack>
        </GridCell>
        <GridCell columnSpan={2}>
          <InputLabel style={{ marginBottom: '10px' }}>
            Notify me before Reminder
          </InputLabel>
          <Stack direction="horizontal">
            <Input
              type="text"
              placeholder="Days"
              value={state.reminderDays}
              onValue={(reminderDays) => setState({ ...state, reminderDays })}
            />
            <Input
              type="text"
              placeholder="Hours"
              value={state.reminderHours}
              onValue={(reminderHours) => setState({ ...state, reminderHours })}
            />
          </Stack>
        </GridCell>
        <GridCell columnSpan={2}>
          <InputLabel style={{ marginBottom: '10px' }}>
            Notify me when Status Unchanged more than
          </InputLabel>
          <Stack direction="horizontal">
            <Input
              type="text"
              placeholder="Days"
              value={state.unchangedDays}
              onValue={(unchangedDays) => setState({ ...state, unchangedDays })}
            />
            <Input
              type="text"
              placeholder="Hours"
              value={state.unchangedHours}
              onValue={(unchangedHours) =>
                setState({ ...state, unchangedHours })
              }
            />
          </Stack>
        </GridCell>
        {pathname.includes('/discover/influencers') && (
          <GridCell columnSpan={2}>
            <InputLabel style={{ marginBottom: '10px' }}>
              Notify me when Status Change from
            </InputLabel>
            <Stack direction="horizontal">
              <Switch
                color="secondary"
                label="Registered"
                value={state.registered}
                onValue={(registered) => setState({ ...state, registered })}
              />
              <Switch
                color="secondary"
                label="To Be Approved"
                value={state.toBeApproved}
                onValue={(toBeApproved) => setState({ ...state, toBeApproved })}
              />
            </Stack>
          </GridCell>
        )}
        {pathname.includes('/discover/influencers') && (
          <GridCell columnSpan={2}>
            <InputLabel style={{ marginBottom: '10px' }}>
              Notify me when Status Change from
            </InputLabel>
            <Stack direction="horizontal">
              <Switch
                color="secondary"
                label="Registered"
                value={state.registered}
                onValue={(registered) => setState({ ...state, registered })}
              />
              <Switch
                color="secondary"
                label="To Be Approved"
                value={state.toBeApproved}
                onValue={(toBeApproved) => setState({ ...state, toBeApproved })}
              />
            </Stack>
          </GridCell>
        )}
        {pathname.includes('/discover/clients') && (
          <GridCell columnSpan={2}>
            <InputLabel style={{ marginBottom: '10px' }}>
              Notify me when Status Change from
            </InputLabel>
            <Stack direction="horizontal">
              <Switch
                color="secondary"
                label="Registered"
                value={state.registered}
                onValue={(registered) => setState({ ...state, registered })}
              />
              <Switch
                color="secondary"
                label="Order Created"
                value={state.campaignCreated}
                onValue={(campaignCreated) =>
                  setState({ ...state, campaignCreated })
                }
              />
            </Stack>
          </GridCell>
        )}
        {pathname.includes('/users/influencers') && (
          <GridCell columnSpan={2}>
            <InputLabel style={{ marginBottom: '10px' }}>
              Notify me when Status Change from
            </InputLabel>
            <Stack
              direction="horizontal"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Switch
                color="secondary"
                label="Accepted"
                value={state.accepted}
                onValue={(accepted) => setState({ ...state, accepted })}
              />
              <Switch
                color="secondary"
                label="Signed"
                value={state.signed}
                onValue={(signed) => setState({ ...state, signed })}
              />
              <Switch
                color="secondary"
                label="Submited"
                value={state.submited}
                onValue={(submited) => setState({ ...state, submited })}
              />
            </Stack>
          </GridCell>
        )}
        {pathname.includes('/users/clients') && (
          <GridCell columnSpan={2}>
            <InputLabel style={{ marginBottom: '10px' }}>
              Notify me when Status Change from
            </InputLabel>
            <Stack
              direction="horizontal"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Switch
                color="secondary"
                label="In Preparation"
                value={state.inPreparation}
                onValue={(inPreparation) =>
                  setState({ ...state, inPreparation })
                }
              />
              <Switch
                color="secondary"
                label="Finished"
                value={state.finished}
                onValue={(finished) => setState({ ...state, finished })}
              />
              <Switch
                color="secondary"
                label="Withdrawal Request"
                value={state.withdrawalRequest}
                onValue={(withdrawalRequest) =>
                  setState({ ...state, withdrawalRequest })
                }
              />
            </Stack>
          </GridCell>
        )}
        {pathname.includes('/users/ambassadors') && (
          <GridCell columnSpan={2}>
            <InputLabel style={{ marginBottom: '10px' }}>
              Notify me when Status Change from
            </InputLabel>
            <Stack
              direction="horizontal"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Switch
                color="secondary"
                label="Registered"
                value={state.registeredAmbassador}
                onValue={(registeredAmbassador) =>
                  setState({ ...state, registeredAmbassador })
                }
              />
            </Stack>
          </GridCell>
        )}
        {pathname.includes('/services/campaigns') && (
          <GridCell columnSpan={2}>
            <InputLabel style={{ marginBottom: '10px' }}>
              Notify me when Status Change from
            </InputLabel>
            <Stack direction="horizontal" style={{ marginBottom: '10px' }}>
              <Switch
                color="secondary"
                label="Client Message"
                value={state.clientMessage}
                onValue={(clientMessage) =>
                  setState({ ...state, clientMessage })
                }
              />
              <Switch
                color="secondary"
                label="Influencer Mesage"
                value={state.influencerMessage}
                onValue={(influencerMessage) =>
                  setState({ ...state, influencerMessage })
                }
              />
            </Stack>
            <Stack direction="horizontal">
              <Switch
                color="secondary"
                label="New Order"
                value={state.newOrder}
                onValue={(newOrder) => setState({ ...state, newOrder })}
              />
              <Switch
                color="secondary"
                label="Influencer Status Change"
                value={state.influencerStatusChange}
                onValue={(influencerStatusChange) =>
                  setState({ ...state, influencerStatusChange })
                }
              />
            </Stack>
          </GridCell>
        )}
        {pathname.includes('/services/sml') && (
          <GridCell columnSpan={2}>
            <InputLabel style={{ marginBottom: '10px' }}>
              Notify me when Status Change from
            </InputLabel>
            <Stack
              direction="horizontal"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Switch
                color="secondary"
                label="New Order"
                value={state.smlNewOrder}
                onValue={(smlNewOrder) => setState({ ...state, smlNewOrder })}
              />
            </Stack>
          </GridCell>
        )}
        {pathname.includes('/services/reports') && (
          <GridCell columnSpan={2}>
            <InputLabel style={{ marginBottom: '10px' }}>
              Notify me when Status Change from
            </InputLabel>
            <Stack
              direction="horizontal"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Switch
                color="secondary"
                label="New Order"
                value={state.reportsNewOrder}
                onValue={(reportsNewOrder) =>
                  setState({ ...state, reportsNewOrder })
                }
              />
            </Stack>
          </GridCell>
        )}
        {pathname.includes('/services/surveys') && (
          <GridCell columnSpan={2}>
            <InputLabel style={{ marginBottom: '10px' }}>
              Notify me when Status Change from
            </InputLabel>
            <Stack
              direction="horizontal"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Switch
                color="secondary"
                label="New Order"
                value={state.surveyNewOrder}
                onValue={(surveyNewOrder) =>
                  setState({ ...state, surveyNewOrder })
                }
              />
              <Switch
                color="secondary"
                label="Participant Status Change"
                value={state.participantStatusChange}
                onValue={(participantStatusChange) =>
                  setState({ ...state, participantStatusChange })
                }
              />
              <Switch
                color="secondary"
                label="Participant Message"
                value={state.participantMessage}
                onValue={(participantMessage) =>
                  setState({ ...state, participantMessage })
                }
              />
            </Stack>
          </GridCell>
        )}
        {pathname.includes('services/benefits') && (
          <GridCell columnSpan={2}>
            <InputLabel style={{ marginBottom: '10px' }}>
              Notify me when Status Change from
            </InputLabel>
            <Stack
              direction="horizontal"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Switch
                color="secondary"
                label="Suggestion Added"
                value={state.suggestionAdded}
                onValue={(suggestionAdded) =>
                  setState({ ...state, suggestionAdded })
                }
              />
            </Stack>
          </GridCell>
        )}
        {pathname.includes('/finance') && (
          <GridCell columnSpan={2}>
            <InputLabel style={{ marginBottom: '10px' }}>
              Notify me when Status Change from
            </InputLabel>
            <Stack
              direction="horizontal"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Switch
                color="secondary"
                label="Payments To Be Approved"
                value={state.paymentsToBeApproved}
                onValue={(paymentsToBeApproved) =>
                  setState({ ...state, paymentsToBeApproved })
                }
              />
            </Stack>
          </GridCell>
        )}
      </NotificationSettingsMain>
    </Modal>
  );
};

export default NotificationSettings;
