import React from 'react';
import {
  InPreparationActionsMain,
  InPreparationActionsMenu,
  ISpan,
} from 'features/reports/role/client/elements/ordered-actions/styles';
import { useMenu, useModal } from 'hooks';
import {
  ContactIcon,
  DeleteIcon,
  InfoIcon,
  ScheduleIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { TInpreparationActionsMenuProps } from 'features/reports/role/client/elements/ordered-actions/types';
import DeleteReportModal from '../delete-report-modal';
import CreatedReportModal from '../created-report-modal';

const OrderedActions = ({
  data,
  reload,
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

  const [deleteReportsModal, openDeleteReportsModal, closeDeleteReportsModal] =
    useModal(false);

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
            // {
            //   icon: <ContactIcon />,
            //   label: 'Contact',
            //   action: () => {
            //     handleMenu();
            //     window.location.href = `mailto:client@patientsinfluence.com`;
            //   },
            // },
            // {
            //   icon: <ScheduleIcon />,
            //   label: 'Schedule',
            //   action: () => {
            //     router.push(
            //       'https://calendly.com/patientsinfluence-client/30min'
            //     );
            //   },
            // },
            {
              icon: <DeleteIcon />,
              label: 'Remove',
              action: () => {
                handleMenu();
                openDeleteReportsModal();
              },
            },
          ]}
          ref={menu}
        />
      )}
      {createdReportsModal && (
        <CreatedReportModal
          data={data}
          onClose={closeCreatedReportsModal}
          reload={reload}
        />
      )}
      {deleteReportsModal && (
        <DeleteReportModal
          id={data.id}
          onClose={closeDeleteReportsModal}
          reload={reload}
        />
      )}
    </InPreparationActionsMain>
  );
};

export default OrderedActions;
