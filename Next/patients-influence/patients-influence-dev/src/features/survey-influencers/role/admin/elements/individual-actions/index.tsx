import React from 'react';
import { useMenu, useModal, useSnackbar } from 'hooks';
import { DeleteIcon, VerticalDotsIcon } from 'components/svg';
import {
  ContactInfluencerModal,
  NoteInfluencer,
  ScheduleInfluencerModal,
} from 'features/influencers/role/admin/elements';
import { InfluencerAPI } from 'api';
import PromptModal from 'features/discover-influencers/role/admin/elements/approve-influencer-modal';
import { DiscoverActionsMain, DiscoverActionsMenu, ISpan } from './styles';
import { TDiscoverActionsMenuProps } from './types';

const IndividualActions = ({
  data,
  reload,
  ...props
}: TDiscoverActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const { push } = useSnackbar();

  const handleDelete = async () => {
    try {
      await InfluencerAPI.deleteInfluencer(data.id);
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
      <ISpan onClick={handleMenu} ref={buttonRef}>
        <VerticalDotsIcon onClick={handleMenu} />
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
      {ciModal && (
        <ContactInfluencerModal id={data.id} onClose={closeCiModal} />
      )}
      {niModal && <NoteInfluencer onClose={closeNiModal} />}
      {diModal && (
        <PromptModal
          id={data.id}
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
