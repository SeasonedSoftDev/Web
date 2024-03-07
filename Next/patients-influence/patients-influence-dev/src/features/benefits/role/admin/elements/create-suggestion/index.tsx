import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TCreateSuggestionModalProps } from 'features/benefits/role/admin/elements/create-suggestion/types';
import { CreateSuggestionModalMain } from 'features/benefits/role/admin/elements/create-suggestion/styles';
import { Button, Input } from 'components/ui';
import { Stack } from 'components/system';
import { BenefitsAPI } from 'api';
import { useSnackbar } from 'hooks';
import { useAppContext } from 'context';

const CreateSuggestion = ({
  onClose,
  reload,
  ...props
}: TCreateSuggestionModalProps) => {
  const { user } = useAppContext();
  const [state, setState] = useState({
    partnershipName: '',
    partnershipLink: '',
    argumentDescription: '',
    outcomeDescription: '',
  });

  const { push } = useSnackbar();

  const handleAddSuggestion = async () => {
    try {
      await BenefitsAPI.addSuggestion(state).then(() => reload());
      push('Suggestion successfully added.', { variant: 'success' });
    } catch {
      push("Suggestion couldn't be added.", { variant: 'error' });
    }
  };

  return (
    <Modal
      size="medium"
      title={<div>Suggestion by {`${user.firstName} ${user.lastName}`}</div>}
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={async () => {
            handleAddSuggestion();
            onClose();
          }}
        >
          Confirm
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <CreateSuggestionModalMain columns={2}>
          <Input
            type="text"
            label="Company Name"
            placeholder="Please Enter"
            value={state.partnershipName}
            onValue={(partnershipName) =>
              setState({ ...state, partnershipName })
            }
          />
          <Input
            type="text"
            label="Company website"
            placeholder="Please Enter"
            value={state.partnershipLink}
            onValue={(partnershipLink) =>
              setState({ ...state, partnershipLink })
            }
          />
          <Input
            multiline
            rows={3}
            type="text"
            label="Argument"
            value={state.argumentDescription}
            onValue={(argumentDescription) =>
              setState({ ...state, argumentDescription })
            }
          />
          <Input
            multiline
            rows={3}
            type="text"
            label="Desired Outcome"
            value={state.outcomeDescription}
            onValue={(outcomeDescription) =>
              setState({ ...state, outcomeDescription })
            }
          />
        </CreateSuggestionModalMain>
      </Stack>
    </Modal>
  );
};

export default CreateSuggestion;
