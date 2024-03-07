import React from 'react';
import {
  InPreparationActionsMain,
  InPreparationActionsMenu,
  ISpan,
} from 'features/reports/role/client/elements/without-report-actions/styles';
import { useMenu, useModal } from 'hooks';
import {
  ContactIcon,
  ReportIcon,
  ScheduleIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { TInpreparationActionsMenuProps } from 'features/reports/role/client/elements/without-report-actions/types';
import { useRouter } from 'next/router';
import { CreateReportsModal } from 'features/reports/role/client/elements';

const InPreparationActions = ({
  data,
  refresh,
  ...props
}: TInpreparationActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const [createReportModal, openCreateReportModal, closeCreateReportModal] =
    useModal(false);

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
              icon: <ReportIcon />,
              label: 'Report',
              action: openCreateReportModal,
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

      {createReportModal && (
        <CreateReportsModal
          refresh={refresh}
          campaign={data}
          onClose={closeCreateReportModal}
        />
      )}
    </InPreparationActionsMain>
  );
};

export default InPreparationActions;
