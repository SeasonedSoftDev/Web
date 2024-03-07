import React from 'react';
import {
  ToBeApprovedActionsMain,
  ToBeApprovedActionsMenu,
  ISpan,
} from 'features/discover-influencers/role/admin/elements/to-be-approved-actions/styles';
import { useMenu, useModal, useSnackbar } from 'hooks';
import {
  ApproveIcon,
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
import { TToBeApprovedProps } from 'features/discover-influencers/role/admin/elements/to-be-approved-actions/types';
import { InfluencerAPI } from 'api';
import UsersAPI from 'api/users';
import PromptModal from '../approve-influencer-modal';

const ToBeApprovedActions = ({
  data,
  reload,
  ...props
}: TToBeApprovedProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const { push } = useSnackbar();
  const handleMenu = () => {
    setOpen(!open);
  };

  const [approveModal, openApproveModal, closeApproveModal] = useModal(false);
  const [ciModal, openCiModal, closeCiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);
  const [diModal, openDiModal, closeDiModal] = useModal(false);

  const handleApprove = async () => {
    try {
      await UsersAPI.updateSingleUser(data, { status: 5 });
      reload();

      push('Influencer successfully approved!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
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

  const toBeApprovedActions = [
    {
      icon: <ApproveIcon />,
      label: 'Approve',
      action: () => {
        openApproveModal();
        handleMenu();
      },
    },
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
  ];

  return (
    <ToBeApprovedActionsMain>
      <ISpan ref={buttonRef}>
        <VerticalDotsIcon onClick={handleMenu} />
      </ISpan>
      {open && (
        <ToBeApprovedActionsMenu
          position={position}
          items={toBeApprovedActions}
          ref={menu}
        />
      )}
      {ciModal && <ContactInfluencerModal id={data} onClose={closeCiModal} />}
      {niModal && <NoteInfluencer onClose={closeNiModal} />}
      {diModal && (
        <PromptModal
          onClose={() => {
            closeDiModal();
          }}
          handleAction={handleDelete}
        />
      )}
      {approveModal && (
        <PromptModal
          type="approve"
          onClose={() => {
            closeApproveModal();
          }}
          handleAction={handleApprove}
        />
      )}
      {siModal && <ScheduleInfluencerModal onClose={closeSiModal} />}
    </ToBeApprovedActionsMain>
  );
};

export default ToBeApprovedActions;
