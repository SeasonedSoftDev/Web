import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TSuggestionInfoModalProps } from 'features/benefits/role/admin/elements/suggestion-info/types';
import {
  ModalTitle,
  SuggestionInfoModalMain,
} from 'features/benefits/role/admin/elements/suggestion-info/styles';
import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { BenefitsAPI } from 'api';
import { useSnackbar } from 'hooks';
import { AxiosError } from 'axios';
import { EditIcon } from 'components/svg';

const SuggestionInfoModal = ({
  onClose,
  reload,
  data,
  ...props
}: TSuggestionInfoModalProps) => {
  const [state, setState] = useState({
    partnershipName: data.partnershipName,
    partnershipLink: data.partnershipLink,
    argumentDescription: data.argumentDescription,
    outcomeDescription: data.outcomeDescription,
    statusDescription: data.statusDescription || '',
  });

  const [edit, setEdit] = useState(false);

  const handleEdit = () => {
    setEdit(!edit);
  };

  const { push } = useSnackbar();

  const handleUpdateSuggestion = async () => {
    if (
      !state.partnershipLink.length ||
      !state.partnershipLink.length ||
      !state.argumentDescription.length ||
      !state.outcomeDescription.length
    ) {
      push('Please fill out the required fields');
      return;
    }
    await BenefitsAPI.updateSuggestion(data.id, state)
      .then(() => {
        push('Sucessfully edited.', { variant: 'success' });
        reload();
      })
      .catch((err) => {
        const error = err as AxiosError<any>;
        if (error.isAxiosError) {
          push('Something went wrong', { variant: 'error' });
        }
      });
    onClose();
  };

  return (
    <Modal
      size="medium"
      title={
        <ModalTitle>
          Suggestion by{' '}
          {data.author?.influencer &&
          data.author.influencer?.stakeholders?.length
            ? data.author.influencer?.stakeholders[0].socialPlatformUsername
            : `${data.author?.firstName} ${data.author.lastName}`}
          <EditIcon
            style={
              edit
                ? { cursor: 'pointer', color: '#448DC9' }
                : { cursor: 'pointer', color: '#7E839F' }
            }
            onClick={handleEdit}
          />
        </ModalTitle>
      }
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => (edit ? handleUpdateSuggestion() : onClose())}
        >
          {edit ? 'Update' : 'Close'}
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <SuggestionInfoModalMain columns={2}>
          <Input
            required
            type="text"
            label="Company Name"
            placeholder="Please Enter"
            value={state.partnershipName}
            disabled={!edit}
            onValue={(partnershipName) =>
              setState({ ...state, partnershipName })
            }
          />
          <Input
            required
            type="text"
            label="Company website"
            placeholder="Please Enter"
            value={state.partnershipLink}
            disabled={!edit}
            onValue={(partnershipLink) =>
              setState({ ...state, partnershipLink })
            }
          />
          <Input
            required
            multiline
            rows={3}
            type="text"
            label="Argument"
            value={state.argumentDescription}
            disabled={!edit}
            onValue={(argumentDescription) =>
              setState({ ...state, argumentDescription })
            }
          />
          <Input
            required
            multiline
            rows={3}
            type="text"
            label="Desired Outcome"
            value={state.outcomeDescription}
            disabled={!edit}
            onValue={(outcomeDescription) =>
              setState({ ...state, outcomeDescription })
            }
          />
          <GridCell columnSpan={2}>
            <Input
              multiline
              rows={3}
              type="text"
              label="Status Description"
              value={state.statusDescription}
              disabled={!edit}
              onValue={(statusDescription) =>
                setState({ ...state, statusDescription })
              }
            />
          </GridCell>
        </SuggestionInfoModalMain>
      </Stack>
    </Modal>
  );
};

export default SuggestionInfoModal;
