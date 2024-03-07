import React, { useState, useEffect } from 'react';

import { useMenu, useModal, useSnackbar } from 'hooks';
import {
  AccountIcon,
  ContactIcon,
  DeleteIcon,
  FinishIcon,
  InfoIcon,
  ManageIcon,
  ScheduleIcon,
  StartIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { useRouter } from 'next/router';
import { SurveyType } from 'api/survey/enums';
import { SurveyAPI } from 'api';
import { AxiosError } from 'axios';
import { TInpreparationActionsMenuProps } from './types';
import {
  ISpan,
  InPreparationActionsMain,
  InPreparationActionsMenu,
} from './styles';
import CreatedSurveysModal from '../created-surveys-modal';
import DeleteSurveyModal from '../delete-survey-modal';
import PromptModal from '../prompt-modal';

const InPreparationActions = ({
  data,
  reload,
  ...props
}: TInpreparationActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);
  const [dsModal, openDSModal, closeDSModal] = useModal(false);

  const { push } = useSnackbar();
  const handleMenu = () => {
    setOpen((prevState: boolean) => !prevState);
  };

  const [cdModal, openCdModal, closeCdModal] = useModal(false);
  const [startSModal, openStartSModal, closeStartSModal] = useModal(false);
  const [finishSModal, openFinishSModal, closeFinishSModal] = useModal(false);

  const handleRemove = () => {
    openDSModal();
    handleMenu();
  };

  const handleStartSurvey = async () => {
    SurveyAPI.startSurvey(data.id)
      .then(() => {
        reload();
        push('Survey started.', { variant: 'success' });
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

  const handleFinishSurvey = async () => {
    SurveyAPI.finishSurvey(data.id)
      .then(() => {
        reload();
        push('Survey Finished.', { variant: 'success' });
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

  const router = useRouter();

  const initialBulkActions = [
    {
      icon: <StartIcon />,
      label: 'Start',
      action: () => {
        handleMenu();
        openStartSModal();
      },
    },
    {
      icon: <FinishIcon />,
      label: 'Finish',
      action: () => {
        handleMenu();
        openFinishSModal();
      },
    },
    {
      icon: <InfoIcon />,
      label: 'Info',
      action: () => {
        handleMenu();
        openCdModal();
      },
    },
    // {
    //   icon: <AccountIcon />,
    //   label: 'Participants',
    //   action: () =>
    //     router.push(`/services/surveys/${data.platformProductOrder.id}`),
    // },
    {
      icon: <ManageIcon />,
      label: 'Manage',
      action: () => {
        if (SurveyType.Questionnaire === data.surveyType) {
          router.push(`/services/surveys/manage/${data.id}`);
        } else {
          router.push(`/services/surveys/${data.platformProductOrder.id}`);
        }
      },
    },
    // {
    //   icon: <ContactIcon />,
    //   label: 'Contact',
    //   action: () => {
    //     router.push(`mailto:client@patientsinfluence.com`);
    //     handleMenu();
    //   },
    // },
    // {
    //   icon: <ScheduleIcon />,
    //   label: 'Schedule',
    //   action: () => {
    //     router.push(
    //       'https://calendly.com/patientsinfluence-client/30min'
    //     );
    //     handleMenu();
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

        // if (action.label === 'Manage') {
        //   return SurveyType.Questionnaire === data.surveyType;
        // }

        // if (action.label === 'Participants') {
        //   return SurveyType.Questionnaire !== data.surveyType;
        // }

        return true;
      })
    );
  }, [data.surveyType]);

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
      {cdModal && data.id && (
        <CreatedSurveysModal
          id={data.id}
          onClose={closeCdModal}
          reload={reload}
        />
      )}

      {dsModal && (
        <DeleteSurveyModal
          id={data.id}
          onClose={closeDSModal}
          reload={reload}
        />
      )}
      {startSModal ? (
        <PromptModal
          handleAction={handleStartSurvey}
          target="survey"
          type="start"
          onClose={closeStartSModal}
        />
      ) : undefined}
      {finishSModal ? (
        <PromptModal
          handleAction={handleFinishSurvey}
          target="survey"
          type="finish"
          onClose={closeFinishSModal}
        />
      ) : undefined}
    </InPreparationActionsMain>
  );
};

export default InPreparationActions;
