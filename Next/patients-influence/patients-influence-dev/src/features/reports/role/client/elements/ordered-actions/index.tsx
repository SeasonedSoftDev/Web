import React from 'react';
import {
  InPreparationActionsMain,
  InPreparationActionsMenu,
  ISpan,
} from 'features/reports/role/client/elements/ordered-actions/styles';
import { useMenu, useModal } from 'hooks';
import {
  ContactIcon,
  InfoIcon,
  ScheduleIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { TInpreparationActionsMenuProps } from 'features/reports/role/client/elements/ordered-actions/types';
import { useRouter } from 'next/router';
import { CreatedReportsModal } from 'features/reports/role/client/elements';

const InPreparationActions = ({
  data,
  ...props
}: TInpreparationActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const [
    createdReportsModal,
    openCreatedReportsModal,
    closeCreatedReportsModal,
  ] = useModal(false);

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
                handleMenu();
                openCreatedReportsModal();
              },
            },
            {
              icon: <ContactIcon />,
              label: 'Contact',
              action: () => {
                handleMenu();
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
      {createdReportsModal && (
        <CreatedReportsModal data={data} onClose={closeCreatedReportsModal} />
      )}
    </InPreparationActionsMain>
  );
};

export default InPreparationActions;
