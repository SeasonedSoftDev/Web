import React, { useState, useEffect } from 'react';
import { useMenu, useModal, useSnackbar } from 'hooks';
import {
  ApproveIcon,
  DeclineIcon,
  DeleteIcon,
  VerticalDotsIcon,
} from 'components/svg';
import {
  ContactInfluencerModal,
  NoteInfluencer,
  ScheduleInfluencerModal,
} from 'features/influencers/role/admin/elements';
import { InfluencerAPI, SurveyAPI } from 'api';
import { ProductOrderInfluencerStatus } from 'api/platformProduct/enums';
import { AxiosError } from 'axios';
import { useAppContext } from 'context';
import PromptModal from '../prompt-modal';
import { TDiscoverActionsMenuProps } from './types';
import { DiscoverActionsMain, DiscoverActionsMenu, ISpan } from './styles';

const IndividualActions = ({
  surveyId,
  data,
  reload,
  ...props
}: TDiscoverActionsMenuProps) => {
  const { role } = useAppContext();
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const handleMenu = () => {
    setOpen((prevState: boolean) => !prevState);
  };

  const { push } = useSnackbar();

  const [ciModal, openCiModal, closeCiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);
  const [diModal, openDiModal, closeDiModal] = useModal(false);
  const [deModal, openDeModal, closeDeModal] = useModal(false);
  const [aiModal, openAiModal, closeAiModal] = useModal(false);

  const initialInfluencerActions = [
    {
      icon: <ApproveIcon />,
      label: 'Approve',
      action: () => {
        handleMenu();
        openAiModal();
      },
    },
    {
      icon: <DeclineIcon />,
      label: 'Decline',
      action: () => {
        handleMenu();
        openDeModal();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        handleMenu();
        openDiModal();
      },
    },
  ];

  const [influencerActions, setInfluencerActions] = useState(
    initialInfluencerActions
  );

  const handleDelete = async () => {
    try {
      await InfluencerAPI.deleteInfluencer(data.id);
      reload();

      push('Influencer successfully deleted!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleApprove = async () => {
    await SurveyAPI.approveInfluencerSuveySubmission(surveyId, {
      influencerIds: [data.influencerId],
    })
      .then(() => {
        push('Submission has been approved', { variant: 'success' });
        reload();
      })
      .catch((err) => {
        const error = err as AxiosError<any>;

        if (error.isAxiosError && error.response?.data.message) {
          push(error.response?.data.message, { variant: 'error' });
        }
      });
  };

  const handleDecline = async () => {
    await SurveyAPI.disaproveInfluencerSuveySubmission(surveyId, {
      influencerIds: [data.influencerId],
    })
      .then(() => {
        push('Submission has been declined', { variant: 'info' });
        reload();
      })
      .catch((err) => {
        const error = err as AxiosError<any>;

        if (error.isAxiosError && error.response?.data.message) {
          push(error.response?.data.message, { variant: 'error' });
        }
      });
  };

  useEffect(() => {
    setInfluencerActions((prevState) =>
      prevState.filter((action) => {
        if (action.label === 'Remove') {
          return !!(role === 'SUPERADMIN' || role === 'ADMIN');
        }

        if (action.label === 'Approve' || action.label === 'Decline') {
          const allowedStatuses = [ProductOrderInfluencerStatus.ToBeApproved];
          return allowedStatuses.includes(data.status);
        }
        return true;
      })
    );
  }, [data.status]);

  return (
    <DiscoverActionsMain {...props}>
      {influencerActions.length ? (
        <>
          <ISpan onClick={handleMenu} ref={buttonRef}>
            <VerticalDotsIcon />
          </ISpan>
          {open && (
            <DiscoverActionsMenu
              position={position}
              items={influencerActions}
              ref={menu}
            />
          )}
        </>
      ) : undefined}
      {ciModal && <ContactInfluencerModal onClose={closeCiModal} />}
      {niModal && <NoteInfluencer onClose={closeNiModal} />}
      {deModal && (
        <PromptModal
          target="submission"
          type="decline"
          onClose={() => {
            closeDeModal();
          }}
          handleAction={handleDecline}
        />
      )}
      {aiModal && (
        <PromptModal
          target="submission"
          type="approve"
          onClose={() => {
            closeAiModal();
          }}
          handleAction={handleApprove}
        />
      )}
      {diModal && (
        <PromptModal
          onClose={() => {
            closeDiModal();
          }}
          handleAction={handleDelete}
        />
      )}
      {siModal && <ScheduleInfluencerModal onClose={closeSiModal} />}
    </DiscoverActionsMain>
  );
};

export default IndividualActions;
