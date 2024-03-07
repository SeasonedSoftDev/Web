import React, { useState, useEffect } from 'react';
import { useMenu, useModal, useSnackbar } from 'hooks';
import {
  ApproveIcon,
  DeclineIcon,
  DeleteIcon,
  InfoIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { NoteInfluencer } from 'features/discover-influencers/role/admin/elements';
import { SurveyAPI } from 'api';
import { hasEndDatePassed } from 'utilities/calendar';
import PromptModal from '../prompt-modal';
import { THomeActionsMenuProps } from './types';
import { HomeActionsMain, HomeActionsMenu, ISpan } from './styles';
import SurveyModal from '../survey-modal';

const InfluencerSurveyActions = ({
  data,
  reload,
  ...props
}: THomeActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const [aiModal, openAiModal, closeAiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);
  const [diModal, openDiModal, closeDiModal] = useModal(false);
  const [lSModal, openLsModal, closeLsModal] = useModal(false);

  const { push } = useSnackbar();

  const handleMenu = () => {
    setOpen((prevState: boolean) => !prevState);
  };

  const initialInfluencerActions = [
    {
      icon: <InfoIcon />,
      label: 'Info',
      action: () => {
        openSiModal();
        handleMenu();
      },
    },
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

    {
      icon: <DeleteIcon />,
      label: 'Leave',
      action: () => {
        openLsModal();
        handleMenu();
      },
    },
  ];

  const [influencerActions, setInfluencerActions] = useState(
    initialInfluencerActions
  );

  const handleDecline = async () => {
    try {
      await SurveyAPI.declineInvitationToSurvey(data.id).then(() => {
        reload();
      });
      push('Influencer successfully declined invitation!', {
        variant: 'success',
      });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleLeaveSurvey = async () => {
    try {
      await SurveyAPI.removeInfluencersFromSurvey(data.id).then(() => {
        reload();
      });
      push('You have successfully left the survey.', {
        variant: 'success',
      });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleApplyInfluencerToSurvey = async () => {
    try {
      await SurveyAPI.acceptInvitationToSurvey(data.id).then(() => {
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
      prevState.filter((item) => {
        if (item.label === 'Info') {
          const allowedStatuses = [2, 6, 7, 8, 9, 10, 11, 13];
          return allowedStatuses.includes(
            data.platformProductOrder.platformProductOrderInfluencers[0].status
          );
        }
        if (item.label === 'Leave') {
          const allowedStatuses = [2, 6, 7, 8, 9, 10, 13];
          return allowedStatuses.includes(
            data.platformProductOrder.platformProductOrderInfluencers[0].status
          );
        }
        if (item.label === 'Accept' || item.label === 'Decline') {
          const allowedStatuses = [0, 1];
          return (
            allowedStatuses.includes(
              data.platformProductOrder.platformProductOrderInfluencers[0]
                .status
            ) &&
            ((data.dateEnd && !hasEndDatePassed(data.dateEnd)) || !data.dateEnd)
          );
        }
        return true;
      })
    );
  }, [data.platformProductOrder.platformProductOrderInfluencers[0].status]);

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
      {lSModal && (
        <PromptModal
          target="survey"
          type="leave"
          onClose={() => {
            closeLsModal();
          }}
          handleAction={handleLeaveSurvey}
        />
      )}
      {siModal && <SurveyModal onClose={closeSiModal} data={data} />}
    </HomeActionsMain>
  );
};

export default InfluencerSurveyActions;
