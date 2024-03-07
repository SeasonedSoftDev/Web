import React from 'react';
import { Modal } from 'components/custom';
import { Button } from 'components/ui';
import { CampaignAPI } from 'api';
import { useSnackbar } from 'hooks';
import { TDeleteReportModalProps } from './types';
import { DeleteReportModalMain } from './styles';

const DeleteReportModal = ({
  onClose,
  id,
  reload,
  ...props
}: TDeleteReportModalProps) => {
  const { push } = useSnackbar();

  const handleDelete = async () => {
    try {
      await CampaignAPI.deleteReport(id).then(() => {
        push('Report successfully deleted!', { variant: 'success' });
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
      <DeleteReportModalMain>
        Are you sure that you want to remove this report? <br /> Operation
        cannot be undone.
      </DeleteReportModalMain>
    </Modal>
  );
};

export default DeleteReportModal;
