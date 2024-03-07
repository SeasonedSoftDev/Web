import React, { useEffect, useState } from 'react';
import {
  ToBeApprovedActionsMain,
  ToBeApprovedActionsMenu,
  ISpan,
} from 'features/benefits/role/admin/elements/suggestion-actions/styles';
import { useMenu, useModal } from 'hooks';
import {
  DeleteIcon,
  InfoIcon,
  ScheduleIcon,
  VerticalDotsIcon,
} from 'components/svg';
import {
  ChangeBenefit,
  ConfirmRemoveBenefitModal,
} from 'features/benefits/role/admin/elements';
import { IPaginatedBenefit } from 'api/benefits/types';

interface IBenefitActions {
  reload: () => Promise<void>;
  data: IPaginatedBenefit;
}

const BenefitActions = ({ reload, data, ...props }: IBenefitActions) => {
  const [menuTba, openTba, setOpenTba, buttonRef, position] = useMenu(false);
  const [cbModal, openCbModal, closeCbModal] = useModal(false);
  const [crbModal, openCrbModal, closeCrbModal] = useModal(false);

  const handleMenu = () => {
    setOpenTba(!openTba);
  };

  const initialRowActions = [
    {
      icon: <InfoIcon />,
      label: 'Info',
      action: () => {
        handleMenu();
        openCbModal();
      },
    },
    {
      icon: <ScheduleIcon />,
      label: 'Schedule',
      action: () => {},
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        openCrbModal();
        handleMenu();
      },
    },
  ];

  const [rowActions, setRowActions] = useState(initialRowActions);

  return (
    <ToBeApprovedActionsMain>
      <ISpan ref={buttonRef} onClick={handleMenu}>
        <VerticalDotsIcon />
      </ISpan>

      {openTba ? (
        <ToBeApprovedActionsMenu
          position={position}
          items={rowActions}
          ref={menuTba}
        />
      ) : undefined}
      {crbModal && (
        <ConfirmRemoveBenefitModal
          action={reload}
          id={data.id}
          onClose={() => {
            closeCrbModal();
            reload();
          }}
        />
      )}
      {cbModal && (
        <ChangeBenefit
          data={data}
          reload={reload}
          onClose={async () => {
            closeCbModal();
            await reload();
          }}
        />
      )}
    </ToBeApprovedActionsMain>
  );
};

export default BenefitActions;
