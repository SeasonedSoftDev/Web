import React, { useEffect } from 'react';
import {
  OrderedActionsMain,
  OrderedActionsMenu,
  ISpan,
} from 'features/sml/role/client/elements/ordered-actions/styles';
import { useMenu, useModal } from 'hooks';
import {
  ContactIcon,
  InfoIcon,
  OrderedIcon,
  ScheduleIcon,
  VerticalDotsIcon,
} from 'components/svg';
// import {
//   ContactInfluencerModal,
//   DeleteInfluencerModal,
//   NoteInfluencer,
//   ScheduleInfluencerModal,
// } from 'features/sml/role/client/elements';
import { TOrderedActionsMenuProps } from 'features/sml/role/client/elements/ordered-actions/types';
import { useRouter } from 'next/router';
import { CreatedSMLModal } from '..';

const DiscoverActions = ({
  data,
  reload,
  ...props
}: TOrderedActionsMenuProps) => {
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  // const [ciModal, openCiModal, closeCiModal] = useModal(false);
  // const [siModal, openSiModal, closeSiModal] = useModal(false);
  // const [niModal, openNiModal, closeNiModal] = useModal(false);
  // const [diModal, openDiModal, closeDiModal] = useModal(false);
  const [createdSMLModal, openCreatedSMLModal, closeCreatedSMLModal] =
    useModal(false);

  const router = useRouter();

  return (
    <OrderedActionsMain {...props}>
      <ISpan onClick={handleMenu} ref={buttonRef}>
        <VerticalDotsIcon />
      </ISpan>
      {open && (
        <OrderedActionsMenu
          position={position}
          items={[
            {
              icon: <InfoIcon />,
              label: 'Info',
              action: openCreatedSMLModal,
            },
            {
              icon: <ContactIcon />,
              label: 'Contact',
              action: () => {
                router.push('mailto:client@patientsinfluence.com');
                handleMenu();
                // window.location.href = `mailto:client@patientsinfluence.com`;
              },
            },
            {
              icon: <ScheduleIcon />,
              label: 'Schedule',
              action: () => {
                router.push(
                  'https://calendly.com/patientsinfluence-client/30min'
                );
                handleMenu();
              },
            },
          ]}
          ref={menu}
        />
      )}
      {createdSMLModal && (
        <CreatedSMLModal
          refresh={reload}
          onClose={closeCreatedSMLModal}
          data={data}
        />
      )}
      {/* {ciModal && <ContactInfluencerModal id={data} onClose={closeCiModal} />}
      {niModal && <NoteInfluencer onClose={closeNiModal} />}
      {siModal && <ScheduleInfluencerModal onClose={closeSiModal} />} */}
    </OrderedActionsMain>
  );
};

export default DiscoverActions;
