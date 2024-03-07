import React from 'react';
import {
  SingleAmbassadorActionsMain,
  SingleAmbassadorActionsMenu,
  ISpan,
} from 'features/ambassadors/role/admin/elements/single-ambassador-actions/styles';
import { useMenu, useModal, useSnackbar } from 'hooks';
import {
  ContactIcon,
  DeleteIcon,
  EditIcon,
  ScheduleIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { InfluencerAPI } from 'api';
import PromptModal from 'features/discover-influencers/role/admin/elements/approve-influencer-modal';
import ContactAmbassadorsModal from '../contact-ambassadors-modal';
import ScheduleAmbassadorsModal from '../schedule-ambassadors-modal';
import { NoteAmbassadors } from '..';
import { TDiscoverActionsMenuProps } from './types';

const SingleAmbassadorActions = ({
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

      push('Ambassador successfully deleted!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const [ciModal, openCiModal, closeCiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);
  const [diModal, openDiModal, closeDiModal] = useModal(false);

  return (
    <SingleAmbassadorActionsMain>
      <ISpan onClick={handleMenu} ref={buttonRef}>
        <VerticalDotsIcon onClick={handleMenu} />
      </ISpan>
      {open && (
        <SingleAmbassadorActionsMenu
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
      {ciModal && <ContactAmbassadorsModal onClose={closeCiModal} />}
      {niModal && <NoteAmbassadors onClose={closeNiModal} />}
      {diModal && (
        <PromptModal
          target="ambassador"
          onClose={() => {
            closeDiModal();
          }}
          handleAction={handleDelete}
        />
      )}
      {siModal && <ScheduleAmbassadorsModal onClose={closeSiModal} />}
    </SingleAmbassadorActionsMain>
  );
};

export default SingleAmbassadorActions;
