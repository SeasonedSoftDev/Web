import React from 'react';
import {
  DiscoverActionsMain,
  DiscoverActionsMenu,
  ISpan,
} from 'features/discover-influencers/role/admin/elements/discover-actions/styles';
import { useMenu, useModal, useSnackbar } from 'hooks';
import {
  ContactIcon,
  DeleteIcon,
  EditIcon,
  ScheduleIcon,
  VerticalDotsIcon,
} from 'components/svg';
import {
  ContactInfluencerModal,
  NoteInfluencer,
  ScheduleInfluencerModal,
} from 'features/discover-influencers/role/admin/elements';
import { TDiscoverActionsMenuProps } from 'features/discover-influencers/role/admin/elements/discover-actions/types';
import { InfluencerAPI } from 'api';
import PromptModal from '../approve-influencer-modal';

const DiscoverActions = ({
  data,
  reload,
  ...props
}: TDiscoverActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const { push } = useSnackbar();

  const handleMenu = () => {
    setOpen(!open);
  };

  const handleDelete = async () => {
    try {
      await InfluencerAPI.deleteInfluencer(data);
      reload();
      push('Influencer successfully deleted!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const [ciModal, openCiModal, closeCiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);
  const [diModal, openDiModal, closeDiModal] = useModal(false);

  return (
    <DiscoverActionsMain {...props}>
      <ISpan onClick={() => handleMenu()} ref={buttonRef}>
        <VerticalDotsIcon onClick={() => handleMenu()} />
      </ISpan>
      {open && (
        <DiscoverActionsMenu
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
      {ciModal && <ContactInfluencerModal id={data} onClose={closeCiModal} />}
      {niModal && <NoteInfluencer onClose={closeNiModal} />}
      {diModal && (
        <PromptModal
          id={data}
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

export default DiscoverActions;
