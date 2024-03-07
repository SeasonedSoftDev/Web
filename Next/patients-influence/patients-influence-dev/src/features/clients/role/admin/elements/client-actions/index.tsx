import React, { useEffect } from 'react';
import {
  ClientActionsMain,
  ClientActionsMenu,
  ISpan,
} from 'features/clients/role/admin/elements/client-actions/styles';
import { useMenu, useModal, useSnackbar } from 'hooks';
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
import UsersAPI from 'api/users';

const ClientActions = ({ data, reload, ...props }: TClientActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const { push } = useSnackbar();

  const handleMenu = () => {
    setOpen(!open);
  };

  const [ciModal, openCiModal, closeCiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);
  const [diModal, openDiModal, closeDiModal] = useModal(false);

  const handleDelete = async () => {
    try {
      await UsersAPI.deleteUser(data).then((deletedClient: any) => {
        reload();
        push(`Client ${deletedClient.firstName} successfully deleted!`, {
          variant: 'success',
        });
      });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  return (
    <ClientActionsMain {...props}>
      <ISpan onClick={handleMenu} ref={buttonRef}>
        <VerticalDotsIcon onClick={handleMenu} />
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
          onClose={closeDiModal}
          handleDelete={handleDelete}
        />
      )}
      {siModal && <ScheduleClientsModal onClose={closeSiModal} />}
    </ClientActionsMain>
  );
};

export default ClientActions;
