import React, { useState, useEffect } from 'react';
import { useMenu, useModal, useSnackbar } from 'hooks';
import { ApproveIcon, DeclineIcon, VerticalDotsIcon } from 'components/svg';
import {
  NoteInfluencer,
  ScheduleInfluencerModal,
} from 'features/discover-influencers/role/admin/elements';
import { SurveyAPI } from 'api';
import PromptModal from '../../prompt-modal';
import { THomeActionsMenuProps } from './types';
import { HomeActionsMain, HomeActionsMenu, ISpan } from './styles';

const InfluencerHomeAvSurveyActions = ({
  data,
  reload,
  status,
  ...props
}: THomeActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const [aiModal, openAiModal, closeAiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);
  const [diModal, openDiModal, closeDiModal] = useModal(false);

  const { push } = useSnackbar();

  const handleMenu = () => {
    setOpen((prevState: boolean) => !prevState);
  };

  const initialInfluencerActions = [
    {
      icon: <ApproveIcon />,
      label: 'Accept',
      action: () => {
        openAiModal();
        handleMenu();
      },
    },
    {
      icon: <DeclineIcon />,
      label: 'Decline',
      action: () => {
        openDiModal();
        handleMenu();
      },
    },
  ];

  const [influencerActions, setInfluencerActions] = useState(
    initialInfluencerActions
  );

  const handleDecline = async () => {
    try {
      await SurveyAPI.declineInvitationToSurvey(data).then(() => {
        reload();
      });
      push('Influencer successfully declined invitation!', {
        variant: 'success',
      });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleApplyInfluencerToSurvey = async () => {
    try {
      await SurveyAPI.acceptInvitationToSurvey(data).then(() => {
        reload();
      });

      push('Influencer successfully accepted invitation!', {
        variant: 'success',
      });
      closeAiModal();
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  useEffect(() => {
    setInfluencerActions((prevState) =>
      prevState.filter(() => [0, 1].includes(status))
    );
  }, [status]);

  return (
    <HomeActionsMain {...props}>
      {influencerActions.length ? (
        <ISpan
          onClick={() => {
            handleMenu();
          }}
          ref={buttonRef}
        >
          <VerticalDotsIcon />
        </ISpan>
      ) : undefined}
      {open && (
        <HomeActionsMenu
          position={position}
          items={influencerActions}
          ref={menu}
        />
      )}
      {aiModal && (
        <PromptModal
          target="survey"
          type="accept"
          handleAction={handleApplyInfluencerToSurvey}
          onClose={closeAiModal}
        />
      )}
      {niModal && <NoteInfluencer onClose={closeNiModal} />}
      {diModal && (
        <PromptModal
          target="survey"
          type="decline"
          onClose={() => {
            closeDiModal();
          }}
          handleAction={handleDecline}
        />
      )}
      {siModal && <ScheduleInfluencerModal onClose={closeSiModal} />}
    </HomeActionsMain>
  );
};

export default InfluencerHomeAvSurveyActions;
