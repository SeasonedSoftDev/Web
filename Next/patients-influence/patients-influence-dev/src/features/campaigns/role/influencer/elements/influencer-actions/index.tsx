import React, { useState, useEffect } from 'react';
import { useMenu, useModal, useSnackbar } from 'hooks';
import {
  ApproveIcon,
  DeclineIcon,
  DeleteIcon,
  InfoIcon,
  VerticalDotsIcon,
} from 'components/svg';
import {
  NoteInfluencer,
  ScheduleInfluencerModal,
} from 'features/discover-influencers/role/admin/elements';
import { CampaignAPI } from 'api';
import AcceptCampaign from 'features/home/role/influencer/elements/apply-campaign';
import { hasEndDatePassed } from 'utilities/calendar';
import PromptModal from '../prompt-modal';
import { THomeActionsMenuProps } from './types';
import { HomeActionsMain, HomeActionsMenu, ISpan } from './styles';
import CampaignModal from '../campaign-modal';

const InfluencerActions = ({
  data,
  reload,
  ...props
}: THomeActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);
  const [aiModal, openAiModal, closeAiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);
  const [diModal, openDiModal, closeDiModal] = useModal(false);
  const [ciModal, openCiModal, closeCiModal] = useModal(false);
  const [lCModal, openLCModal, closeLCModal] = useModal(false);

  const { push } = useSnackbar();

  const handleMenu = () => {
    setOpen((prevState: boolean) => !prevState);
  };

  const initialInfluencerActions = [
    {
      icon: <InfoIcon />,
      label: 'Info',
      action: () => {
        openCiModal();
        handleMenu();
      },
    },
    {
      icon: <ApproveIcon />,
      label: 'Apply',
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
        openLCModal();
        handleMenu();
      },
    },
  ];

  const [influencerActions, setInfluencerActions] = useState(
    initialInfluencerActions
  );

  const handleDecline = async () => {
    try {
      await CampaignAPI.declineInvitationToCampaign(data.id).then(() => {
        reload();
      });
      push('Influencer successfully declined invitation!', {
        variant: 'success',
      });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleApplyInfluencerToCampaign = async () => {
    try {
      await CampaignAPI.acceptInvitationToCampaign(data.id).then(() => {
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

  const handleLeaveCampaign = async () => {
    try {
      await CampaignAPI.removeInfluencerFromCampaign(data.id).then(() => {
        reload();
      });
      push('You have successfully left the campaign.', {
        variant: 'success',
      });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  useEffect(() => {
    setInfluencerActions((prevState) =>
      prevState.filter((action) => {
        if (action.label === 'Info') {
          const allowedStatuses = [2, 6, 7, 8, 9, 10, 11, 13];
          return allowedStatuses.includes(
            data.platformProductOrder.platformProductOrderInfluencers[0].status
          );
        }
        if (action.label === 'Leave') {
          const allowedStatuses = [2, 6, 7, 8, 9, 10, 13];
          return allowedStatuses.includes(
            data.platformProductOrder.platformProductOrderInfluencers[0].status
          );
        }
        if (action.label === 'Apply' || action.label === 'Decline') {
          const allowedStatuses = [0, 1];
          return (
            allowedStatuses.includes(
              data.platformProductOrder.platformProductOrderInfluencers[0]
                .status
            ) &&
            ((data.dateEnd && !hasEndDatePassed(data.dateEnd)) || !data.dateEnd)
          );
        }
        return true; // Include other actions by default
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
        <AcceptCampaign
          handleAction={handleApplyInfluencerToCampaign}
          onClose={closeAiModal}
        />
      )}
      {niModal && <NoteInfluencer onClose={closeNiModal} />}
      {diModal && (
        <PromptModal
          onClose={() => {
            closeDiModal();
          }}
          handleAction={handleDecline}
        />
      )}
      {lCModal && (
        <PromptModal
          type="leave"
          onClose={() => {
            closeLCModal();
          }}
          handleAction={handleLeaveCampaign}
        />
      )}
      {siModal && <ScheduleInfluencerModal onClose={closeSiModal} />}
      {ciModal && (
        <CampaignModal reload={reload} onClose={closeCiModal} data={data} />
      )}
    </HomeActionsMain>
  );
};

export default InfluencerActions;
