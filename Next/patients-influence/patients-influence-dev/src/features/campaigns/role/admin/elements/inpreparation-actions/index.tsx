import React, { useState, useEffect } from 'react';
import {
  InPreparationActionsMain,
  InPreparationActionsMenu,
  ISpan,
} from 'features/surveys/role/client/elements/inpreparation-actions/styles';
import { useMenu, useModal, useSnackbar } from 'hooks';
import {
  AccountIcon,
  DeleteIcon,
  FinishIcon,
  InfoIcon,
  ManageIcon,
  StartIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { useRouter } from 'next/router';
import { CampaignAPI } from 'api';
import { AxiosError } from 'axios';
import DeleteCampaignModal from '../delete-campaign-modal';
import { TInpreparationActionsMenuProps } from './types';
import CreatedCampaignModal from '../created-campaign-modal';
import PromptModal from '../prompt-modal';

const InPreparationActions = ({
  data,
  reload,
  ...props
}: TInpreparationActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const handleMenu = () => {
    setOpen((prevState: boolean) => !prevState);
  };

  const { push } = useSnackbar();

  const [ccModal, openCcModal, closeCcModal] = useModal(false);
  const [dcModal, openDCModal, closeDCModal] = useModal(false);

  const [startCModal, openStartCModal, closeStartCModal] = useModal(false);
  const [finishCModal, openFinishCModal, closeFinishCModal] = useModal(false);

  const router = useRouter();

  const handleInfo = () => {
    handleMenu();
    openCcModal();
  };

  const handleRemove = () => {
    handleMenu();
    openDCModal();
  };

  const handleStartCampaign = async () => {
    CampaignAPI.startCampaign(data.id)
      .then(() => {
        reload();
        push('Campaign started.', { variant: 'success' });
      })
      .catch((err) => {
        const error = err as AxiosError<any>;
        if (error.isAxiosError && error.response?.data.message) {
          push(error.response.data.message, { variant: 'error' });
        } else {
          push('Something went wrong', { variant: 'error' });
        }
      });
  };
  const handleFinishCampaign = async () => {
    CampaignAPI.finishCampaign(data.id)
      .then(() => {
        reload();
        push('Campaign finished.', { variant: 'success' });
      })
      .catch((err) => {
        const error = err as AxiosError<any>;
        if (error.isAxiosError && error.response?.data.message) {
          push(error.response.data.message, { variant: 'error' });
        } else {
          push('Something went wrong', { variant: 'error' });
        }
      });
  };

  const initialBulkActions = [
    {
      icon: <StartIcon />,
      label: 'Start',
      action: () => {
        handleMenu();
        openStartCModal();
      },
    },
    {
      icon: <FinishIcon />,
      label: 'Finish',
      action: () => {
        handleMenu();
        openFinishCModal();
      },
    },
    {
      icon: <InfoIcon />,
      label: 'Info',
      action: handleInfo,
    },
    {
      icon: <ManageIcon />,
      label: 'Manage',
      action: () =>
        router.push(
          `/services/campaigns/manage/${data.platformProductOrderId}`
        ),
    },
    // {
    //   icon: <ManageIcon />,
    //   label: 'Manage',
    //   action: () => {},
    // },
    // {
    //   icon: <ContactIcon />,
    //   label: 'Contact',
    //   action: () => {
    //     window.location.href = `mailto:client@patientsinfluence.com`;
    //   },
    // },
    // {
    //   icon: <ScheduleIcon />,
    //   label: 'Schedule',
    //   action: () => {
    //     router.push(
    //       'https://calendly.com/patientsinfluence-client/30min'
    //     );
    //   },
    // },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: handleRemove,
    },
  ];

  const [bulkActions, setBulkActions] = useState(initialBulkActions);

  useEffect(() => {
    setBulkActions((prevState) =>
      prevState.filter((action) => {
        if (action.label === 'Start') {
          return data.platformProductOrder.status === 0;
        }

        if (action.label === 'Finish') {
          return data.platformProductOrder.status === 1;
        }
        return true;
      })
    );
  }, [data]);

  return (
    <InPreparationActionsMain {...props}>
      <ISpan onClick={handleMenu} ref={buttonRef}>
        <VerticalDotsIcon />
      </ISpan>
      {open && (
        <InPreparationActionsMenu
          position={position}
          items={bulkActions}
          ref={menu}
        />
      )}
      {ccModal && (
        <CreatedCampaignModal
          id={data.id}
          onClose={closeCcModal}
          reload={reload}
        />
      )}
      {dcModal && (
        <DeleteCampaignModal
          id={data.id}
          onClose={closeDCModal}
          reload={reload}
        />
      )}

      {startCModal ? (
        <PromptModal
          handleAction={handleStartCampaign}
          target="campaign"
          type="start"
          onClose={closeStartCModal}
        />
      ) : undefined}
      {finishCModal ? (
        <PromptModal
          handleAction={handleFinishCampaign}
          target="campaign"
          type="finish"
          onClose={closeFinishCModal}
        />
      ) : undefined}
    </InPreparationActionsMain>
  );
};

export default InPreparationActions;
