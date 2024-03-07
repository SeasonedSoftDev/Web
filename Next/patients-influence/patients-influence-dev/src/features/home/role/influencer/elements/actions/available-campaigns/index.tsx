import React, { useState, useEffect } from 'react';
import { useMenu, useModal, useSnackbar } from 'hooks';
import { ApproveIcon, DeclineIcon, VerticalDotsIcon } from 'components/svg';
import {
  NoteInfluencer,
  ScheduleInfluencerModal,
} from 'features/discover-influencers/role/admin/elements';
import { CampaignAPI } from 'api';
import { hasEndDatePassed } from 'utilities/calendar';
import PromptModal from '../../prompt-modal';
import { THomeActionsMenuProps } from './types';
import { HomeActionsMain, HomeActionsMenu, ISpan } from './styles';
import AcceptCampaign from '../../apply-campaign';

const InfluencerHomeActions = ({
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

  // useEffect(() => {
  //   setInfluencerActions((prevState) => {
  //     if (prevState.length) {
  //       return (
  //         prevState.filter(() => [0, 1].includes(status)) &&
  //         ((data.dateEnd && !hasEndDatePassed(data.dateEnd)) || !data.dateEnd)
  //       );
  //     }
  //     return [];
  //   });
  // }, [status]);

  useEffect(() => {
    setInfluencerActions((prevState) =>
      prevState.filter((action) => {
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
        <AcceptCampaign
          handleAction={handleApplyInfluencerToCampaign}
          onClose={closeAiModal}
        />
      )}
      {niModal && <NoteInfluencer onClose={closeNiModal} />}
      {diModal && (
        <PromptModal
          id={data.id}
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

export default InfluencerHomeActions;
