import React, { useState } from 'react';
import { CheckboxTable, Modal } from 'components/custom';
import { TClientListAmbassadorModalProps } from 'features/ambassadors/role/admin/elements/client-list-ambassador-modal/types';
import { ClientListAmbassadorModalMain } from 'features/ambassadors/role/admin/elements/client-list-ambassador-modal/styles';
import { DClientListHead } from 'features/ambassadors/role/admin/elements/client-list-ambassador-modal/data';
import { Button } from 'components/ui';
import { TTableRenderItemObject } from 'components/custom/table/types';

const ClientListAmbassadorModal = ({
  onClose,
  ...props
}: TClientListAmbassadorModalProps) => {
  const [state, setState] = useState({
    clientList: [],
  });

  const renderItem = ({ cell }: TTableRenderItemObject) => '';

  return (
    <Modal
      size="large"
      title="Client List"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Close
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <ClientListAmbassadorModalMain>
        <CheckboxTable
          head={DClientListHead}
          items={[]}
          renderItem={renderItem}
        />
      </ClientListAmbassadorModalMain>
    </Modal>
  );
};

export default ClientListAmbassadorModal;
