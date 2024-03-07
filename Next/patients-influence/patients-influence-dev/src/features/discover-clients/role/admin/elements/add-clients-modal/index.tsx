import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TAddClientsModalProps } from 'features/discover-clients/role/admin/elements/add-clients-modal/types';
import { AddClientsModalMain } from 'features/discover-clients/role/admin/elements/add-clients-modal/styles';
import { Button, Input } from 'components/ui';

const AddClientsModal = ({ onClose, ...props }: TAddClientsModalProps) => {
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: [],
    role: [],
    product: [],
    industry: [],
    diseaseArea: [],
    location: [],
    market: [],
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
          Create
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <AddClientsModalMain columns={2}>
        <Input
          type="text"
          label="First Name"
          placeholder="Please Enter"
          value={state.firstName}
          onValue={(firstName) => setState({ ...state, firstName })}
        />
        <Input
          type="text"
          label="Last Name"
          placeholder="Please Enter"
          value={state.lastName}
          onValue={(lastName) => setState({ ...state, lastName })}
        />
        <Input
          type="text"
          label="Email"
          placeholder="Please Enter"
          value={state.email}
          onValue={(email) => setState({ ...state, email })}
        />
        <Input
          type="multiselect"
          label="Company"
          placeholder="Please Select"
          value={state.company}
          onValue={(company) => setState({ ...state, company })}
        />
        <Input
          type="multiselect"
          label="Role"
          placeholder="Please Enter"
          value={state.role}
          onValue={(role) => setState({ ...state, role })}
        />
        <Input
          type="multiselect"
          label="Product"
          placeholder="Please Select"
          value={state.product}
          onValue={(product) => setState({ ...state, product })}
        />
        <Input
          type="multiselect"
          label="Industry"
          placeholder="Please Select"
          value={state.industry}
          onValue={(industry) => setState({ ...state, industry })}
        />
        <Input
          type="multiselect"
          label="Disease Area"
          placeholder="Please Enter"
          value={state.diseaseArea}
          onValue={(diseaseArea) => setState({ ...state, diseaseArea })}
          isFilterActive
        />
        <Input
          type="multiselect"
          label="Location"
          placeholder="Please Enter"
          value={state.location}
          onValue={(location) => setState({ ...state, location })}
        />
        <Input
          type="multiselect"
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
