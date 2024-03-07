import React, { useState, useEffect } from 'react';
import {
  InPreparationActionsMain,
  InPreparationActionsMenu,
  ISpan,
} from 'features/surveys/role/client/elements/inpreparation-actions/styles';
import { useMenu, useModal } from 'hooks';
import {
  AccountIcon,
  ContactIcon,
  InfoIcon,
  ManageIcon,
  ScheduleIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { TInpreparationActionsMenuProps } from 'features/surveys/role/client/elements/inpreparation-actions/types';
import { CreatedSurveysModal } from 'features/surveys/role/client/elements';
import { useRouter } from 'next/router';
import { SurveyType } from 'api/survey/enums';

const InPreparationActions = ({
  data,
  reload,
  ...props
}: TInpreparationActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const [cdModal, openCdModal, closeCdModal] = useModal(false);

  const router = useRouter();

  const initialBulkActions = [
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
    //     router.push(`/surveys/participants/${data.platformProductOrder.id}`),
    // },
    // {
    //   icon: <ManageIcon />,
    //   label: 'Manage',
    //   action: () => router.push(`/surveys/manage/${data.id}`),
    // },
    {
      icon: <ManageIcon />,
      label: 'Manage',
      action: () => {
        if (SurveyType.Questionnaire === data.surveyType) {
          router.push(`/surveys/manage/${data.id}`);
        } else {
          router.push(`surveys/participants/${data.platformProductOrder.id}`);
        }
      },
    },
    {
      icon: <ContactIcon />,
      label: 'Contact',
      action: () => {
        router.push(`mailto:client@patientsinfluence.com`);
        handleMenu();
      },
    },
    {
      icon: <ScheduleIcon />,
      label: 'Schedule',
      action: () => {
        router.push('https://calendly.com/patientsinfluence-client/30min');
        handleMenu();
      },
    },
  ];

  const [bulkActions, setBulkActions] = useState(initialBulkActions);

  useEffect(() => {
    setBulkActions((prevState) =>
      prevState.filter((action) => {
        if (action.label === 'Manage') {
          return SurveyType.Questionnaire === data.surveyType;
        }

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
      {cdModal && <CreatedSurveysModal id={data.id} onClose={closeCdModal} />}
    </InPreparationActionsMain>
  );
};

export default InPreparationActions;
