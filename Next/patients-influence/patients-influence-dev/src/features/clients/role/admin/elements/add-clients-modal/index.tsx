import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TAddClientsModalProps } from 'features/clients/role/admin/elements/add-clients-modal/types';
import { AddClientsModalMain } from 'features/clients/role/admin/elements/add-clients-modal/styles';
import { Button, Input } from 'components/ui';

const AddClientsModal = ({ onClose, ...props }: TAddClientsModalProps) => {
  const [state, setState] = useState({
    clientName: '',
    email: '',
    role: '',
    phone: '',
    company: '',
    product: '',
    industry: null,
    diseaseArea: null,
    location: null,
    market: null,
  });

  return (
    <Modal
      size="medium"
      title="Add Client"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Add
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <AddClientsModalMain columns={2}>
        <Input
          type="text"
          label="Client Name"
          placeholder="Please Enter"
          value={state.clientName}
          onValue={(clientName) => setState({ ...state, clientName })}
        />
        <Input
          type="text"
          label="Email"
          placeholder="Please Enter"
          value={state.email}
          onValue={(email) => setState({ ...state, email })}
        />
        <Input
          type="text"
          label="Role"
          placeholder="Please Enter"
          value={state.role}
          onValue={(role) => setState({ ...state, role })}
        />
        <Input
          type="text"
          label="Phone Number"
          placeholder="Please Enter"
          value={state.phone}
          onValue={(phone) => setState({ ...state, phone })}
        />
        <Input
          type="text"
          label="Company"
          placeholder="Please Select"
          value={state.company}
          onValue={(company) => setState({ ...state, company })}
        />
        <Input
          type="text"
          label="Product"
          placeholder="Please Select"
          value={state.product}
          onValue={(product) => setState({ ...state, product })}
        />
        <Input
          type="select"
          label="Industry"
          placeholder="Please Select"
          value={state.industry}
          onValue={(industry) => setState({ ...state, industry })}
        />
        <Input
          type="select"
          label="Disease Area"
          placeholder="Please Enter"
          value={state.diseaseArea}
          onValue={(diseaseArea) => setState({ ...state, diseaseArea })}
          isFilterActive
        />
        <Input
          type="select"
          label="Location"
          placeholder="Please Enter"
          value={state.location}
          onValue={(location) => setState({ ...state, location })}
        />
        <Input
          type="select"
          label="Market"
          placeholder="Please Enter"
          value={state.market}
          onValue={(market) => setState({ ...state, market })}
        />
      </AddClientsModalMain>
    </Modal>
  );
};

export default AddClientsModal;
