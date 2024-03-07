import React from 'react';
import { Modal } from 'components/custom';
import { TDeleteInfluencerModalProps } from 'features/discover-influencers/role/admin/elements/delete-influencer-modal/types';
import { DeleteInfluencerModalMain } from 'features/discover-influencers/role/admin/elements/delete-influencer-modal/styles';
import { Button } from 'components/ui';
import { InfluencerAPI } from 'api';
import { useSnackbar } from 'hooks';
import { useRouter } from 'next/router';

const DeleteInfluencerModal = ({
  onClose,
  id,
  ...props
}: TDeleteInfluencerModalProps) => {
  const { push } = useSnackbar();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await InfluencerAPI.deleteInfluencer(id);
      router.push(window.location.pathname);
      push('Influencer successfully deleted!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  return (
    <Modal
      size="small"
      title="Delete Influencer"
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
      <DeleteInfluencerModalMain>
        Are you sure that you want to remove influencer? <br /> Operation cannot
        be undone.
      </DeleteInfluencerModalMain>
    </Modal>
  );
};

export default DeleteInfluencerModal;
