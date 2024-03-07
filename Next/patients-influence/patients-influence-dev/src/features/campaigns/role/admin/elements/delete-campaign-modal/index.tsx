import React from 'react';
import { Modal } from 'components/custom';
import { Button } from 'components/ui';
import { CampaignAPI } from 'api';
import { useSnackbar } from 'hooks';
import { useRouter } from 'next/router';
import { TDeleteCampaignModalProps } from './types';
import { DeleteCampaignModalMain } from './styles';

const DeleteCampaignModal = ({
  onClose,
  id,
  reload,
  ...props
}: TDeleteCampaignModalProps) => {
  const { push } = useSnackbar();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await CampaignAPI.deleteCampaign(id).then(() => {
        router.push(window.location.pathname);
        push('Campaign successfully deleted!', { variant: 'success' });
        reload();
      });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  return (
    <Modal
      size="small"
      title="Delete Campaign"
      actions={[
        <Button
          color="default"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          No
        </Button>,
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => {
            handleDelete();
            onClose();
          }}
        >
          Yes
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <DeleteCampaignModalMain>
        Are you sure that you want to remove this campaign? <br /> Operation
        cannot be undone.
      </DeleteCampaignModalMain>
    </Modal>
  );
};

export default DeleteCampaignModal;
