import React from 'react';
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
import { CreatedCampaignModal } from 'features/campaigns/role/client/elements';
import { useRouter } from 'next/router';

const InPreparationActions = ({
  data,
  reload,
  ...props
}: TInpreparationActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const [ccModal, openCcModal, closeCcModal] = useModal(false);

  const router = useRouter();

  return (
    <InPreparationActionsMain {...props}>
      <ISpan onClick={handleMenu} ref={buttonRef}>
        <VerticalDotsIcon onClick={handleMenu} />
      </ISpan>
      {open && (
        <InPreparationActionsMenu
          position={position}
          items={[
            {
              icon: <InfoIcon />,
              label: 'Info',
              action: () => {
                openCcModal();
                handleMenu();
              },
            },
            // {
            //   icon: <ManageIcon />,
            //   label: 'Manage',
            //   action: () => {},
            // },
            {
              icon: <ManageIcon />,
              // label: 'Influencers',
              label: 'Manage',
              action: () =>
                router.push(`/campaigns/${data.platformProductOrderId}`),
            },
            {
              icon: <ContactIcon />,
              label: 'Contact',
              action: () => {
                window.location.href = `mailto:client@patientsinfluence.com`;
              },
            },
            {
              icon: <ScheduleIcon />,
              label: 'Schedule',
              action: () => {
                router.push(
                  'https://calendly.com/patientsinfluence-client/30min'
                );
              },
            },
          ]}
          ref={menu}
        />
      )}
      {ccModal && reload && (
        <CreatedCampaignModal
          id={data.id}
          onClose={closeCcModal}
          reload={reload}
        />
      )}
    </InPreparationActionsMain>
  );
};

export default InPreparationActions;
