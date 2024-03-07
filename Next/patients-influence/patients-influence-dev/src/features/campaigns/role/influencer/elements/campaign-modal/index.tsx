/* eslint-disable no-shadow */
import React, { useCallback, useEffect, useState } from 'react';
import { Chat, Modal, Tabs } from 'components/custom';
import { AddCampaignsModalMain } from 'features/campaigns/role/client/elements/created-campaign-modal/styles';
import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { CampaignAPI, FileManagerApi } from 'api';
import { useModal, useSnackbar } from 'hooks';
import { ImageUploadMainContainer } from 'features/campaigns/role/client/elements/add-campaign-modal/styles';
import { TCampaignPhoto } from 'features/campaigns/role/client/elements/add-campaign-modal/types';
import { ProductOrderInfluencerStatus } from 'api/platformProduct/enums';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { hasEndDatePassed } from 'utilities/calendar';
import Chip from 'components/ui/chip';
import { useAppContext } from 'context';
import ChatIO from 'api/chat';
import { CampaignsTitle } from './styles';
import { TCampaignsModalProps, TState } from './types';
import SubmitLinkPrompt from '../submit-link-prompt';

const CampaignModal = ({
  onClose,
  reload,
  data,
  ...props
}: TCampaignsModalProps) => {
  const [state, setState] = useState<TState>({
    campaignName: '',
    companyName: '',
    productName: '',
    amount: '',
    socialMedia: '',
    postType: '',
    startDate: '',
    endDate: '',
    status: '',
    instructionsInfo: '',
    submissionLink:
      data.campaignInfluencerPerformances &&
      data.campaignInfluencerPerformances.length &&
      data.campaignInfluencerPerformances[0].submissionLink
        ? data.campaignInfluencerPerformances[0].submissionLink
        : '',
  });

  const [chatRoom, setChatRoom] = useState({ value: '' });

  const [tab, setTab] = useState(0);

  const [isDisabled, setIsDisabled] = useState(true);

  const [confirmSubmitModal, openConfirmSubmitModal, closeConfirmSubmitModal] =
    useModal(false);

  const { push } = useSnackbar();
  const [photos, setPhotos] = useState<TCampaignPhoto[]>([]);

  const handleSubmissionLink = async () => {
    if (
      data.platformProductOrder.platformProductOrderInfluencers[0].status ===
        ProductOrderInfluencerStatus.ToBeSubmitted ||
      (data.dateEnd &&
        !hasEndDatePassed(data.dateEnd) &&
        data.platformProductOrder.platformProductOrderInfluencers[0].status ===
          ProductOrderInfluencerStatus.NotApproved) ||
      (!data.dateEnd &&
        data.platformProductOrder.platformProductOrderInfluencers[0].status ===
          ProductOrderInfluencerStatus.NotApproved)
    ) {
      CampaignAPI.submitInfluencerDataToCampaign(data.id, {
        submissionLink: state.submissionLink,
      })
        .then(() => {
          push('Sucessfully submitted a link, wait for admin to review it', {
            variant: 'success',
          });
          reload();
          onClose();
        })
        .catch((err) => {
          const error = err as AxiosError<any>;
          if (
            error.isAxiosError &&
            error.response?.status === 403 &&
            error.response?.data.message !==
              'You cannot submit the link because the campaign has not started.'
          ) {
            push('Influencer status is not adequate for link submission!', {
              variant: 'error',
            });
            onClose();
          }

          if (error.isAxiosError && error.response?.status === 403) {
            push(error.response?.data.message, {
              variant: 'error',
            });
            onClose();
          }

          if (error.isAxiosError && error.response?.status === 400) {
            push(error.response.data.message[0], {
              variant: 'error',
            });
            onClose();
          }
        });
    } else {
      if (hasEndDatePassed(data.dateEnd)) {
        push('The campaign has ended, you cannot submit the link.', {
          variant: 'error',
        });
        onClose();
        return;
      }
      push('You need to have a To Be Submitted or Not Approved status.', {
        variant: 'error',
      });
      onClose();
    }
  };

  const handleSubmitLinkModal = () => {
    if (
      [
        ProductOrderInfluencerStatus.ToBeSubmitted,
        ProductOrderInfluencerStatus.NotApproved,
      ].includes(
        data.platformProductOrder.platformProductOrderInfluencers[0].status
      )
    ) {
      openConfirmSubmitModal();
    } else {
      push('You need to have a To Be Submitted or Not Approved status.', {
        variant: 'warning',
      });
      onClose();
    }
  };

  const emitRoomByUserId = () => {
    ChatIO.findChatRoomsByUserId(data.platformProductOrderId, () => {});
  };

  const subscribeToRoom = useCallback(() => {
    ChatIO.subscribeToFindChatRoom((response) => {
      setChatRoom({ value: response[0].id });
    });
  }, [state, setState]);

  useEffect(() => {
    ChatIO.connect();

    emitRoomByUserId();
    subscribeToRoom();

    return () => {
      ChatIO.disconnect();
    };
  }, []);

  useEffect(() => {
    const newState = { ...state };

    if (newState) {
      newState.campaignName = data.name;
      newState.startDate = data.dateStart;
      newState.endDate = data.dateEnd;
      newState.companyName = data.platformProductOrder.client.company.name;
      newState.productName = data.products
        .map((product) => product.product.name)
        .join(', ');
      newState.amount = `CHF ${data.platformProductOrder.platformProductOrderInfluencers[0].agreedAmount}`;
      newState.instructionsInfo = data.instructions || '';
      newState.postType = data.postType ? data.postType.name : '';
      newState.socialMedia = data.socialPlatformId === 1 ? 'Instagram' : '';

      const array = data.exampleImages.map(async (x: any) => {
        const key = x.imageUrl.split('/').slice(3).join('/');
        const file = await FileManagerApi.fileDownload(key);
        const parts = x.imageUrl.split('.');
        const fileExtension = parts.pop();

        return {
          presignedUrl: file.data,
          name: x.imageUrl.split('/').slice(4).join('/'),
          type: fileExtension === 'pdf' ? 'application/pdf' : 'image/png',
          id: x.id,
          url: x.imageUrl,
        };
      });
      if (array.length) {
        Promise.all(array).then((data) => setPhotos([...data]));
      }

      switch (
        data.platformProductOrder.platformProductOrderInfluencers[0].status
      ) {
        case ProductOrderInfluencerStatus.Added:
          newState.status = 'Added';
          break;
        case ProductOrderInfluencerStatus.Invited:
          newState.status = 'Invited';
          break;
        case ProductOrderInfluencerStatus.Matching:
          newState.status = 'Matching';
          break;
        case ProductOrderInfluencerStatus.NotSelected:
          newState.status = 'Not Selected';
          break;
        case ProductOrderInfluencerStatus.Withdrawn:
          newState.status = 'Left';
          break;
        case ProductOrderInfluencerStatus.Declined:
          newState.status = 'Declined';
          break;
        case ProductOrderInfluencerStatus.ToBeSubmitted:
          newState.status = 'To Be Submitted';
          break;
        case ProductOrderInfluencerStatus.ToBeApproved:
          newState.status = 'To Be Approved';
          break;
        case ProductOrderInfluencerStatus.Approved:
          newState.status = 'Approved';
          break;
        case ProductOrderInfluencerStatus.NotApproved:
          newState.status = 'Not Approved';
          break;
        case ProductOrderInfluencerStatus.Removed:
          newState.status = 'Removed';
          break;
        case ProductOrderInfluencerStatus.ToBeAnswered:
          newState.status = 'To Be Answered';
          break;
        default:
          newState.status = '';
      }

      setState(newState);
    }
  }, [data]);

  useEffect(() => {
    if (
      (data.campaignInfluencerPerformances &&
        data.campaignInfluencerPerformances.length &&
        state.submissionLink !==
          data.campaignInfluencerPerformances[0].submissionLink) ||
      (data.campaignInfluencerPerformances &&
        !data.campaignInfluencerPerformances.length &&
        state.submissionLink.length)
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [state.submissionLink]);

  return (
    <Modal
      size="medium"
      title={
        <CampaignsTitle>{data && data?.name ? data.name : ''}</CampaignsTitle>
      }
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => (!isDisabled ? handleSubmitLinkModal() : onClose())}
          // onClick={onClose}
        >
          {isDisabled ? `Close` : `Update`}
          {/* Close */}
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack
        // style={{ height: '500px', overflowY: 'scroll', paddingRight: '10px' }}
        style={{ height: '500px', paddingRight: '10px' }}
      >
        {/* 'Admin Chat', 'Chat' */}
        <Tabs
          tabs={['Info', 'Instructions', 'Chat']}
          value={tab}
          onValue={setTab}
        />
        {tab === 0 && (
          <AddCampaignsModalMain columns={2}>
            <Input
              type="text"
              label="Campaign Name"
              disabled
              value={state.campaignName}
              onValue={(campaignName) => setState({ ...state, campaignName })}
            />

            <Input
              type="text"
              label="Company Name"
              disabled
              value={state.companyName}
              onValue={(input) => setState({ ...state, companyName: input })}
            />
            <Input
              type="text"
              label="Product Name"
              value={state.productName}
              disabled
              onValue={(input) => setState({ ...state, productName: input })}
            />

            {/* <Input
              type="text"
              label="Status"
              disabled
              value={state.status}
              onValue={(input) => setState({ ...state, status: input })}
            /> */}
            <Input
              type="text"
              label="Amount"
              disabled
              value={state.amount}
              onValue={(input) => setState({ ...state, amount: input })}
            />
            <Input
              type="text"
              label="Social Media"
              disabled
              value={state.socialMedia}
              onValue={(input) => setState({ ...state, socialMedia: input })}
            />
            <Input
              type="text"
              label="Post Type"
              disabled
              value={state.postType}
              onValue={(input) => setState({ ...state, postType: input })}
            />
            <Input
              label="Start Date"
              type="date"
              disabled
              placeholder="From"
              value={state.startDate}
              onValue={(input) => setState({ ...state, startDate: input })}
            />
            <Input
              label="Finish Date"
              type="date"
              disabled
              placeholder="To"
              value={state.endDate}
              onValue={(input) => setState({ ...state, endDate: input })}
            />
          </AddCampaignsModalMain>
        )}

        {tab === 1 && (
          <AddCampaignsModalMain columns={2}>
            <GridCell columnSpan={1}>
              <ImageUploadMainContainer>
                {photos && photos.length
                  ? photos.map((item: TCampaignPhoto, idx: number) => {
                      const { presignedUrl, name, type, id } = item;
                      return type !== 'application/pdf' && presignedUrl ? (
                        <Image
                          key={id}
                          src={presignedUrl}
                          alt={name}
                          width={350}
                          height={350}
                          quality={100}
                          style={{
                            borderRadius: '12px',
                            objectFit: 'cover',
                          }}
                        />
                      ) : undefined;
                    })
                  : undefined}
              </ImageUploadMainContainer>
            </GridCell>

            <GridCell columnSpan={1}>
              <Input
                multiline
                rows={8}
                type="text"
                placeholder="Instructions"
                disabled
                value={state.instructionsInfo}
                onValue={(instructionsInfo) =>
                  setState({ ...state, instructionsInfo })
                }
              />
            </GridCell>
          </AddCampaignsModalMain>
        )}
        {tab === 2 && (
          <AddCampaignsModalMain columns={2}>
            <Input
              type="text"
              label="Submission"
              placeholder="www.instagram.com/link123"
              value={state.submissionLink}
              onValue={(submissionLink) =>
                setState({ ...state, submissionLink })
              }
            />
            <span style={{ marginTop: 'auto', marginBottom: '3px' }}>
              <Chip type="lightblue" size="small" label={state.status} />
            </span>
            <GridCell columnSpan={2}>
              {chatRoom ? (
                <Chat chatRoomId={chatRoom} isPingActive />
              ) : (
                <span />
              )}
            </GridCell>
          </AddCampaignsModalMain>
        )}
      </Stack>
      {confirmSubmitModal ? (
        <SubmitLinkPrompt
          handleAction={handleSubmissionLink}
          onClose={() => {
            closeConfirmSubmitModal();
          }}
        />
      ) : undefined}
    </Modal>
  );
};

export default CampaignModal;
