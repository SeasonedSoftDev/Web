import React, { useState, useEffect } from 'react';
import {
  DiscoverActionsMain,
  DiscoverActionsMenu,
  ISpan,
} from 'features/influencers/role/admin/elements/discover-actions/styles';
import { useMenu, useModal, useSnackbar } from 'hooks';
import {
  AddIcon,
  ApproveIcon,
  DeclineIcon,
  DeleteIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { ProductOrderInfluencerStatus } from 'api/platformProduct/enums';
import { CampaignAPI } from 'api';
import { AxiosError } from 'axios';
import { useAppContext } from 'context';
import { TDiscoverActionsMenuProps } from './types';
import PromptModal from '../prompt-modal';

const IndividualActions = ({
  campaignId,
  data,
  reload,
  ...props
}: TDiscoverActionsMenuProps) => {
  const { role } = useAppContext();
  const [menu, open, setOpen, buttonRef, position] = useMenu(false);
  const [asModal, openAsModal, closeAsModal] = useModal(false);
  const [dsModal, openDsModal, closeDsModal] = useModal(false);
  const [iModal, openIModal, closeIModal] = useModal(false);
  const [removeBulkInfModal, openRemoveBulkInfModal, closeRemoveBulkInfModal] =
    useModal(false);
  const [confirmMatchModal, openConfirmMatchModal, closeConfirmMatchModal] =
    useModal(false);

  const handleMenu = () => {
    setOpen((prevState: boolean) => !prevState);
  };

  const initialActions = [
    {
      icon: <AddIcon />,
      label: 'Invite',
      action: () => {
        handleMenu();
        openIModal();
      },
    },
    {
      icon: <ApproveIcon />,
      label: 'Confirm',
      action: () => {
        openConfirmMatchModal();
        handleMenu();
      },
    },
    {
      icon: <ApproveIcon />,
      label: 'Approve',
      action: () => {
        openAsModal();
        handleMenu();
      },
    },
    {
      icon: <DeclineIcon />,
      label: 'Decline',
      action: () => {
        openDsModal();
        handleMenu();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        handleMenu();
        openRemoveBulkInfModal();
      },
    },
  ];

  const [influencerActions, setInfluencerActions] = useState(initialActions);

  const { push } = useSnackbar();

  const handleBulkInfluencerRemoval = async () => {
    if (campaignId) {
      CampaignAPI.removeInfluencerFromCampaign(campaignId, [data.influencerId])
        .then(() => {
          push('Successfully removed influencers from a campaign.', {
            variant: 'success',
          });

          reload();
        })
        .catch((error) => console.log('error', error));
    }
  };

  const handleBulkInfluencerInvitations = async () => {
    CampaignAPI.inviteInfluencersToCampaign(campaignId, [data.influencerId])
      .then(() => {
        push('Successfully invited influencers to a campaign', {
          variant: 'success',
        });

        reload();
      })
      .catch((err) => {
        const error = err as AxiosError<any>;
        if (
          error?.response?.data.statusCode === 400 &&
          error?.response?.data.message ===
            "Influencer [object Object] doesn't have valid state to be invited"
        ) {
          push("Selected influencers can't be invited!", {
            variant: 'error',
          });
        } else {
          push('Something went wrong here!', { variant: 'error' });
        }
      });
  };

  const handleApprove = async () => {
    CampaignAPI.approveSubmissionForCampaign(
      data.influencer.campaignInfluencerPerformances[0].campaignId,
      {
        influencerIds: [data.influencerId],
      }
    )
      .then(() => {
        push('Sucessfully approved submission', {
          variant: 'success',
        });
        reload();
      })
      .catch((err) => {
        const error = err as AxiosError<any>;
        if (
          error.isAxiosError &&
          error.response!.status >= 400 &&
          error.response!.status < 500
        ) {
          push('User Error', {
            variant: 'error',
          });
        }

        if (error.isAxiosError && error.response!.status >= 500) {
          push('Something went wrong on the server!', {
            variant: 'error',
          });
        }
      });
  };

  const handleDecline = async () => {
    CampaignAPI.disapproveSubmissionForCampaign(
      data.influencer.campaignInfluencerPerformances[0].campaignId,
      {
        influencerIds: [data.influencerId],
      }
    )
      .then(() => {
        push('Sucessfully declined submission!', {
          variant: 'success',
        });
        reload();
      })
      .catch((err) => {
        const error = err as AxiosError<any>;
        if (
          error.isAxiosError &&
          error.response!.status >= 400 &&
          error.response!.status < 500
        ) {
          push(error.response!.data.message[0], {
            variant: 'error',
          });
        }

        if (error.isAxiosError && error.response!.status >= 500) {
          push('Something went wrong on the server!', {
            variant: 'error',
          });
        }
      });
  };

  const handleBulkInfluencerConfirmMatch = async () => {
    if (campaignId) {
      if (data.status !== ProductOrderInfluencerStatus.Matching) {
        push('Influencer must have a status of matching to be confirmed!', {
          variant: 'warning',
        });
        handleMenu();
        return;
      }

      openConfirmMatchModal();
    } else {
      push('Please select influencers you want to confirm.', {
        variant: 'warning',
      });
      return;
    }

    if (campaignId) {
      CampaignAPI.confirmMatchingInfluencer(campaignId, [data.id])
        .then(() => {
          push('Succesfully confirmed matching influencers in a campaign.', {
            variant: 'success',
          });

          reload();
        })
        .catch((error) => console.log('error', error));
    }
  };

  useEffect(() => {
    setInfluencerActions((prevState) =>
      prevState.filter((action) => {
        if (action.label === 'Approve' || action.label === 'Decline') {
          const allowedStatuses = [
            ProductOrderInfluencerStatus.ToBeApproved,
            ProductOrderInfluencerStatus.NotApproved,
          ];
          return allowedStatuses.includes(data.status);
        }

        if (action.label === 'Invite') {
          const allowedStatuses = [ProductOrderInfluencerStatus.Added];
          return (
            allowedStatuses.includes(data.status) &&
            (role === 'SUPERADMIN' || role === 'ADMIN')
          );
        }

        if (action.label === 'Remove') {
          const allowedStatuses = [ProductOrderInfluencerStatus.Removed];
          return !allowedStatuses.includes(data.status);
        }
        if (action.label === 'Confirm') {
          const allowedStatuses = [ProductOrderInfluencerStatus.Matching];
          return allowedStatuses.includes(data.status);
        }
        return true; // Include other actions by default
      })
    );
  }, [data.status]);

  return (
    <DiscoverActionsMain {...props}>
      {influencerActions.length ? (
        <ISpan
          onClick={() => {
            handleMenu();
          }}
          ref={buttonRef}
        >
          <VerticalDotsIcon />
        </ISpan>
      ) : undefined}
      {open && (
        <DiscoverActionsMenu
          position={position}
          items={influencerActions}
          ref={menu}
        />
      )}

      {asModal && (
        <PromptModal
          type="approve"
          onClose={() => {
            closeAsModal();
          }}
          handleAction={handleApprove}
        />
      )}
      {iModal && (
        <PromptModal
          plural
          type="invite"
          target="influencer"
          handleAction={handleBulkInfluencerInvitations}
          onClose={() => {
            closeIModal();
          }}
        />
      )}
      {removeBulkInfModal && (
        <PromptModal
          plural
          onClose={() => {
            closeRemoveBulkInfModal();
          }}
          handleAction={handleBulkInfluencerRemoval}
        />
      )}
      {dsModal && (
        <PromptModal
          type="decline"
          onClose={() => {
            closeDsModal();
          }}
          handleAction={handleDecline}
        />
      )}
      {confirmMatchModal && (
        <PromptModal
          plural
          type="match"
          target="influencer"
          handleAction={handleBulkInfluencerConfirmMatch}
          onClose={() => {
            closeConfirmMatchModal();
          }}
        />
      )}
    </DiscoverActionsMain>
  );
};

export default IndividualActions;
