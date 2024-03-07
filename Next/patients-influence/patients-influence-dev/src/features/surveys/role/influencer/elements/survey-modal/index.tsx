/* eslint-disable no-shadow */
import React, { useCallback, useEffect, useState } from 'react';
import { Chat, Modal, Tabs } from 'components/custom';
import { AddCampaignsModalMain } from 'features/campaigns/role/client/elements/created-campaign-modal/styles';
import { Button, Input, LinkInput } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { ProductOrderInfluencerStatus } from 'api/platformProduct/enums';
import { SurveyType } from 'api/survey/enums';
import ChatIO from 'api/chat';
import { CampaignsTitle } from './styles';
import { TState, TSurveyModalProps } from './types';

const SurveyModal = ({ onClose, data, ...props }: TSurveyModalProps) => {
  const [state, setState] = useState<TState>({
    companyName: '',
    surveyType: '',
    startDate: '',
    endDate: '',
    amount: '',
    status: '',
  });

  const [tab, setTab] = useState(0);

  const [chatRoom, setChatRoom] = useState({ value: '' });

  useEffect(() => {
    const newState = { ...state };

    if (newState) {
      newState.startDate = data.dateStart;
      newState.endDate = data.dateEnd;
      newState.companyName = data.platformProductOrder.client.company.name;
      newState.amount = `CHF ${data.platformProductOrder.platformProductOrderInfluencers[0].agreedAmount}`;

      switch (data.surveyType) {
        case SurveyType.Questionnaire:
          newState.surveyType = 'Questionnaire';
          break;
        case SurveyType.Short_Interview:
          newState.surveyType = 'Short Interview';
          break;
        case SurveyType.Long_Interview:
          newState.surveyType = 'Long Interview';
          break;
        default:
          newState.surveyType = '';
      }

      switch (
        data.platformProductOrder.platformProductOrderInfluencers[0].status
      ) {
        case ProductOrderInfluencerStatus.Added:
          newState.status = 'Added';
          break;
        case ProductOrderInfluencerStatus.Invited:
          newState.status = 'Invited';
          break;
        case ProductOrderInfluencerStatus.Matching:
          newState.status = 'Matching';
          break;
        case ProductOrderInfluencerStatus.NotSelected:
          newState.status = 'Not Selected';
          break;
        case ProductOrderInfluencerStatus.Withdrawn:
          newState.status = 'Left';
          break;
        case ProductOrderInfluencerStatus.Declined:
          newState.status = 'Declined';
          break;
        case ProductOrderInfluencerStatus.ToBeSubmitted:
          newState.status = 'To Be Submitted';
          break;
        case ProductOrderInfluencerStatus.ToBeApproved:
          newState.status = 'To Be Approved';
          break;
        case ProductOrderInfluencerStatus.Approved:
          newState.status = 'Approved';
          break;
        case ProductOrderInfluencerStatus.NotApproved:
          newState.status = 'Not Approved';
          break;
        case ProductOrderInfluencerStatus.Removed:
          newState.status = 'Removed';
          break;
        case ProductOrderInfluencerStatus.ToBeAnswered:
          if (data.platformProductOrder.status === 0) {
            newState.status = 'Pending';
            break;
          }
          newState.status = 'To Be Answered';
          break;
        default:
          newState.status = '';
      }

      setState(newState);
    }
  }, [data]);

  const emitRoomByUserId = () => {
    ChatIO.findChatRoomsByUserId(data.platformProductOrderId, () => {});
  };

  const subscribeToRoom = useCallback(() => {
    ChatIO.subscribeToFindChatRoom((response) => {
      setChatRoom({ value: response[0].id });
    });
  }, [state, setState]);

  useEffect(() => {
    ChatIO.connect();

    emitRoomByUserId();
    subscribeToRoom();

    return () => {
      ChatIO.disconnect();
    };
  }, []);

  return (
    <Modal
      size="medium"
      title={
        <CampaignsTitle>{data && data?.name ? data.name : ''}</CampaignsTitle>
      }
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Close
          {/* Close */}
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack
        style={{ height: '500px', overflowY: 'scroll', paddingRight: '10px' }}
      >
        <Tabs tabs={['Info', 'Chat']} value={tab} onValue={setTab} />
        {tab === 0 && (
          <AddCampaignsModalMain columns={2}>
            <Input
              type="text"
              label="Company Name"
              disabled
              value={state.companyName}
              onValue={(input) => setState({ ...state, companyName: input })}
            />

            <Input
              type="text"
              label="Amount"
              disabled
              value={state.amount}
              onValue={(input) => setState({ ...state, amount: input })}
            />

            <Input
              type="text"
              label="Type"
              disabled
              value={state.surveyType}
              onValue={(input) => setState({ ...state, surveyType: input })}
            />
            <Input
              label="Start Date"
              type="date"
              disabled
              placeholder="From"
              value={state.startDate}
              onValue={(input) => setState({ ...state, startDate: input })}
            />
            <Input
              label="Finish Date"
              type="date"
              disabled
              placeholder="To"
              value={state.endDate}
              onValue={(input) => setState({ ...state, endDate: input })}
            />
          </AddCampaignsModalMain>
        )}

        {tab === 1 && (
          <AddCampaignsModalMain columns={2}>
            {data.platformProductOrder.status ||
            data.platformProductOrder.status === 0 ? (
              <LinkInput
                link={`/surveys/questionnaire/${data.id}`}
                disabled={!data.platformProductOrder.status}
                label="Status"
                fieldText={state.status}
              />
            ) : undefined}

            <GridCell columnSpan={2}>
              {chatRoom ? <Chat chatRoomId={chatRoom} /> : <span />}
            </GridCell>
          </AddCampaignsModalMain>
        )}
      </Stack>
    </Modal>
  );
};

export default SurveyModal;
