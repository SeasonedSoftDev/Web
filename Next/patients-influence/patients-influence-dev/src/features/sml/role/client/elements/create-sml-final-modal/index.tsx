import React from 'react';
import { Modal } from 'components/custom';
import { TCreateSmlFinalProps } from 'features/sml/role/client/elements/create-sml-final-modal/types';
import { Button } from 'components/ui';
import { SMLApi } from 'api';
import { useSnackbar } from 'hooks';

const CreateSmlFinal = ({ onClose, data, ...props }: TCreateSmlFinalProps) => {
  const { push } = useSnackbar();

  const createSML = async () => {
    try {
      await SMLApi.createSML(data);
      push('Successfully added SML report', { variant: 'success' });
    } catch {
      push('Something went wrong.', { variant: 'error' });
    }
  };

  return (
    <Modal
      size="small"
      title="Are you sure?"
      actions={[
        <Button
          color="default"
          size="large"
          variant="contained"
          onClick={onClose}
        >
          No
        </Button>,
        <Button
          color="primary"
          size="large"
          variant="contained"
          onClick={() => {
            createSML();
            onClose();
          }}
        >
          Yes
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      SML report hasn&apos;t been created yet. Are you sure you want to create
      it? Operation cannot be undone.
    </Modal>
  );
};

export default CreateSmlFinal;
