import React from 'react';
import { useMenu, useModal, useSnackbar } from 'hooks';
import {
  ContactIcon,
  DeleteIcon,
  EditIcon,
  ScheduleIcon,
  VerticalDotsIcon,
} from 'components/svg';
import UsersAPI from 'api/users';
import { TDiscoverActionsMenuProps } from './types';
import { DiscoverActionsMain, DiscoverActionsMenu, ISpan } from './styles';
import DeleteClientsModal from '../delete-clients-modal';
import { ContactClientsModal, NoteClients, ScheduleClientsModal } from '..';

const DiscoverActions = ({
  data,
  reload,
  ...props
}: TDiscoverActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const { push } = useSnackbar();

  const [ciModal, openCiModal, closeCiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);
  const [diModal, openDiModal, closeDiModal] = useModal(false);

  const handleMenu = () => {
    setOpen(!open);
  };

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
    <DiscoverActionsMain {...props}>
      <ISpan onClick={() => handleMenu()} ref={buttonRef}>
        <VerticalDotsIcon onClick={() => handleMenu()} />
      </ISpan>
      {open && (
        <DiscoverActionsMenu
          position={position}
          items={[
            // {
            //   icon: <ContactIcon />,
            //   label: 'Contact',
            //   action: () => {
            //     openCiModal();
            //     handleMenu();
            //   },
            // },
            // {
            //   icon: <EditIcon />,
            //   label: 'Note',
            //   action: () => {
            //     openNiModal();
            //     handleMenu();
            //   },
            // },
            // {
            //   icon: <ScheduleIcon />,
            //   label: 'Schedule',
            //   action: () => {
            //     openSiModal();
            //     handleMenu();
            //   },
            // },
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
      {diModal && (
        <DeleteClientsModal
          onClose={closeDiModal}
          handleDelete={handleDelete}
        />
      )}
      {ciModal && <ContactClientsModal onClose={closeCiModal} />}
      {siModal && <ScheduleClientsModal onClose={closeSiModal} />}
      {niModal && <NoteClients onClose={closeNiModal} />}
    </DiscoverActionsMain>
  );
};

export default DiscoverActions;
