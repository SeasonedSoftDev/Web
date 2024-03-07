import React, { useEffect } from 'react';
import {
  ClientActionsMain,
  ClientActionsMenu,
  ISpan,
} from 'features/clients/role/admin/elements/client-actions/styles';
import { useMenu, useModal } from 'hooks';
import {
  ContactIcon,
  DeleteIcon,
  EditIcon,
  ScheduleIcon,
  VerticalDotsIcon,
} from 'components/svg';
import {
  ContactClientsModal,
  DeleteClientsModal,
  NoteClients,
  ScheduleClientsModal,
} from 'features/clients/role/admin/elements';
import { TClientActionsMenuProps } from 'features/clients/role/admin/elements/client-actions/types';

const ClientActions = ({ data, ...props }: TClientActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const [ciModal, openCiModal, closeCiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);
  const [diModal, openDiModal, closeDiModal] = useModal(false);

  return (
    <ClientActionsMain>
      <ISpan onClick={handleMenu} ref={buttonRef}>
        <VerticalDotsIcon />
      </ISpan>
      {open && (
        <ClientActionsMenu
          position={position}
          items={[
            {
              icon: <ContactIcon />,
              label: 'Contact',
              action: () => {
                openCiModal();
                handleMenu();
              },
            },
            {
              icon: <EditIcon />,
              label: 'Note',
              action: () => {
                openNiModal();
                handleMenu();
              },
            },
            {
              icon: <ScheduleIcon />,
              label: 'Schedule',
              action: () => {
                openSiModal();
                handleMenu();
              },
            },
            {
              icon: <DeleteIcon />,
              label: 'Remove',
              action: () => {
                openDiModal();
                handleMenu();
              },
            },
          ]}
          ref={menu}
        />
      )}
      {ciModal && <ContactClientsModal id={data} onClose={closeCiModal} />}
      {niModal && <NoteClients onClose={closeNiModal} />}
      {diModal && (
        <DeleteClientsModal
          id={data}
          onClose={() => {
            closeDiModal();
          }}
        />
      )}
      {siModal && <ScheduleClientsModal onClose={closeSiModal} />}
    </ClientActionsMain>
  );
};

export default ClientActions;
