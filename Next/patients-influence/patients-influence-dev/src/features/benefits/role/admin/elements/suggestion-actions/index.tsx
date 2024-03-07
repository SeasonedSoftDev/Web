import React, { useEffect, useState } from 'react';
import {
  ToBeApprovedActionsMain,
  ToBeApprovedActionsMenu,
  ISpan,
} from 'features/benefits/role/admin/elements/suggestion-actions/styles';
import { useMenu, useModal, useSnackbar } from 'hooks';
import {
  ApproveIcon,
  DeleteIcon,
  InfoIcon,
  VerticalDotsIcon,
} from 'components/svg';
import {
  ConfirmRemoveSuggestionModal,
  PromptModal,
  SuggestionInfoModal,
} from 'features/benefits/role/admin/elements';
import { IBenefitSuggestion } from 'api/benefits/types';
import { BenefitsAPI } from 'api';
import { AxiosError } from 'axios';

interface ISuggestionActions {
  reload: () => Promise<void>;
  data: IBenefitSuggestion;
}

const SuggestionActions = ({ reload, data, ...props }: ISuggestionActions) => {
  const [menuTba, openTba, setOpenTba, buttonRef, position] = useMenu(false);
  const [asModal, openAsModal, closeAsModal] = useModal(false);
  const [crsModal, openCrsModal, closeCrsModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);

  const { push } = useSnackbar();

  const handleMenu = () => {
    setOpenTba((prevState: boolean) => !prevState);
  };

  const initialRowActions = [
    {
      icon: <ApproveIcon />,
      label: 'Approve',
      action: () => {
        handleMenu();
        openAsModal();
      },
    },
    {
      icon: <InfoIcon />,
      label: 'Info',
      action: () => {
        handleMenu();
        openSiModal();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        handleMenu();
        openCrsModal();
      },
    },
  ];

  const handleRemoveSuggestion = async () => {
    await BenefitsAPI.deleteSuggestion(data.id)
      .then(() => {
        push('Successfully removed suggestion', { variant: 'success' });
        reload();
      })
      .catch((err) => {
        const error = err as AxiosError<any>;
        if (error.isAxiosError) {
          push('Error removing suggestion', { variant: 'error' });
        }
      });
    closeCrsModal();
  };

  const handleApproveSuggestion = async () => {
    await BenefitsAPI.approveSuggestion(data.id)
      .then((response) => {
        push(`${response.partnershipName} has successfully been aproved`, {
          variant: 'success',
        });
        reload();
      })
      .catch((err) => {
        const error = err as AxiosError<any>;
        if (error.isAxiosError) {
          push('Error removing suggestion', { variant: 'error' });
        }
      });
    closeAsModal();
  };

  const [rowActions, setRowActions] = useState(initialRowActions);

  useEffect(() => {
    setRowActions((prevState) =>
      prevState.filter((rowAction) => {
        if (rowAction.label === 'Approve') {
          return !data.isApproved;
        }

        return true;
      })
    );
  }, [data]);

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
      {crsModal && (
        <ConfirmRemoveSuggestionModal
          handleAction={handleRemoveSuggestion}
          onClose={() => {
            closeCrsModal();
          }}
        />
      )}
      {asModal ? (
        <PromptModal
          onClose={closeAsModal}
          type="approve"
          handleAction={handleApproveSuggestion}
        />
      ) : undefined}
      {siModal && (
        <SuggestionInfoModal
          reload={reload}
          data={data}
          onClose={closeSiModal}
        />
      )}
    </ToBeApprovedActionsMain>
  );
};

export default SuggestionActions;
