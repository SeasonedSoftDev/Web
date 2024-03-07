import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TAddSmlModalProps } from 'features/sml/role/admin/elements/create-sml-modal/types';
import { AddSmlModalMain } from 'features/sml/role/admin/elements/create-sml-modal/styles';
import { Button, Input } from 'components/ui';
import { useModal } from 'hooks';
import { CreateSmlFinal } from 'features/sml/role/admin/elements';

const AddSmlModal = ({ onClose, ...props }: TAddSmlModalProps) => {
  const [state, setState] = useState({
    diseaseArea: null,
    language: null,
    platform: null,
    timeframe: null,
  });

  const [csfModal, openCsfModal, closeCsfModal] = useModal(false);

  return (
    <Modal
      size="medium"
      title="Create SML Report"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => {
            openCsfModal();
          }}
        >
          Create
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <AddSmlModalMain columns={2}>
        <Input
          type="select"
          label="Disease Area"
          placeholder="Please Select"
          value={state.diseaseArea}
          onValue={(diseaseArea) => setState({ ...state, diseaseArea })}
          isFilterActive
        />
        <Input
          type="select"
          label="Language"
          placeholder="Please Select"
          value={state.language}
          onValue={(language) => setState({ ...state, language })}
        />
        <Input
          type="select"
          label="Platform"
          placeholder="Please Select"
          value={state.platform}
          onValue={(platform) => setState({ ...state, platform })}
        />
        <Input
          type="select"
          label="Timeframe"
          placeholder="Please Select"
          value={state.timeframe}
          onValue={(timeframe) => setState({ ...state, timeframe })}
        />
      </AddSmlModalMain>
      {csfModal && <CreateSmlFinal onClose={closeCsfModal} />}
    </Modal>
  );
};

export default AddSmlModal;
