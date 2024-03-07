import React from 'react';
import { Modal } from 'components/custom';
import { Button } from 'components/ui';
import { SurveyAPI } from 'api';
import { useSnackbar } from 'hooks';
import { useRouter } from 'next/router';
import { TDeleteSurveyModalProps } from './types';
import { DeleteSurveyModalMain } from './styles';

const DeleteSurveyModal = ({
  onClose,
  id,
  reload,
  ...props
}: TDeleteSurveyModalProps) => {
  const { push } = useSnackbar();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await SurveyAPI.deleteSurvey(id).then(() => {
        router.push(window.location.pathname);
        push('Survey successfully deleted!', { variant: 'success' });
        reload();
      });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  return (
    <Modal
      size="small"
      title="Delete Survey"
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
      <DeleteSurveyModalMain>
        Are you sure that you want to remove this Survey? <br /> Operation
        cannot be undone.
      </DeleteSurveyModalMain>
    </Modal>
  );
};

export default DeleteSurveyModal;
