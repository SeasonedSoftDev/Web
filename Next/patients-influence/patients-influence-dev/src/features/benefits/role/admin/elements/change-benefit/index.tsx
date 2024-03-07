import React, { useEffect, useState } from 'react';
import { Modal } from 'components/custom';
import { TChangeBenefitModalProps } from 'features/benefits/role/admin/elements/change-benefit/types';
import { ChangeBenefitModalMain } from 'features/benefits/role/admin/elements/change-benefit/styles';
import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { BenefitsAPI, LocationAPI } from 'api';
import { EditIcon } from 'components/svg';
import { useDebounce, useModal, useSnackbar } from 'hooks';
import { TAddBenefit } from 'api/benefits/types';
import ConfirmChangeBenefitModal from '../confirm-change-benefit-modal';

const ChangeBenefitModal = ({
  onClose,
  reload,
  data,
  ...props
}: TChangeBenefitModalProps) => {
  const [state, setState] = useState<any>({
    benefitPartnership: {
      value: undefined,
      label: '',
    },
    benefitCompanyLink: '',
    description: '',
    benefitCategory: {
      value: undefined,
      label: '',
    },
    benefitLocations: [],
  });

  useEffect(() => {
    const benefitFormatted = {
      benefitPartnership: {
        value: data.benefitPartnership.id,
        label: data.benefitPartnership.name,
      },
      benefitCompanyLink: data.benefitCompanyLink,
      description: data.description,
      benefitCategory: {
        value: data.benefitCategory.id,
        label: data.benefitCategory.name,
      },
      benefitLocations: data.benefitLocations
        ? data.benefitLocations.map((x: any) => ({
            value: x.location.id,
            label: x.location.country
              ? `${x.location.name}, ${x.location.country.name}`
              : x.location.name,
          }))
        : [],
    };
    setState({
      ...state,
      ...benefitFormatted,
    });
  }, [data]);

  const [companies, setCompanies] = useState<any>([]);

  const getCompanies = async () => {
    const { result } = await BenefitsAPI.getBenefitsPartnerships();

    setCompanies(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const [locations, setLocations] = useState<any>([]);

  const getLocations = async (s: string = '') => {
    const { result } = await LocationAPI.getAll(s);

    setLocations(
      result.map((x: any) => ({
        value: x.id,
        label: x.country ? `${x.name}, ${x.country.name}` : x.name,
      }))
    );
  };

  const handleNewTag = (v: any) => {
    setState({ ...state, benefitLocations: [...state.benefitLocations, v] });
  };
  const [categories, setCategories] = useState<any>([]);

  const getCategories = async () => {
    const result = await BenefitsAPI.getBenefitsCategories();

    setCategories(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const [disabled, setDisabled] = useState(true);

  const handleDisabled = () => {
    setDisabled(!disabled);
  };

  const { push } = useSnackbar();

  const handleUpdate = async () => {
    const formattedBody: TAddBenefit = {
      ...state,
      benefitCategoryId: state.benefitCategory.value || undefined,
      benefitPartnership: state.benefitPartnership.label
        ? {
            name: state.benefitPartnership.label,
            id: state.benefitPartnership.value,
          }
        : undefined,
      benefitLocations:
        state.benefitLocations && state.benefitLocations.length
          ? state.benefitLocations.map(
              (location: { value: number; location: string }) => location.value
            )
          : undefined,
    };
    try {
      await BenefitsAPI.updateBenefit(data.id, formattedBody).then(() => {
        reload();
        onClose();
      });
      push('Benefit successfully changed.', { variant: 'success' });
    } catch {
      push("Benefit couldn't be changed.", { variant: 'error' });
    }
  };

  const debouncedLocation = useDebounce(getLocations, 250);

  useEffect(() => {
    getCompanies();
    getLocations();
    getCategories();
  }, []);

  const [ccbModal, openCcbModal, closeCcbModal] = useModal(false);

  return (
    <Modal
      size="medium"
      title={
        <div>
          Benefit{' '}
          {data.benefitPartnership
            ? `${data.benefitPartnership.name} (#${data.id})`
            : `#${data.id}`}
          <EditIcon
            style={
              disabled
                ? { cursor: 'pointer', color: '#7E839F', marginLeft: '5px' }
                : { cursor: 'pointer', color: '#448DC9', marginLeft: '5px' }
            }
            onClick={handleDisabled}
          />
        </div>
      }
      actions={[
        disabled ? (
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={onClose}
          >
            Close
          </Button>
        ) : (
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={openCcbModal}
          >
            Confirm
          </Button>
        ),
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <ChangeBenefitModalMain columns={2}>
          <Input
            disabled={disabled}
            type="select"
            label="Company Name"
            placeholder="Please Enter"
            value={state.benefitPartnership || ''}
            onValue={({ value }) =>
              setState({ ...state, benefitPartnership: value })
            }
            options={companies}
          />
          <Input
            disabled={disabled}
            type="text"
            label="Company website"
            placeholder="Please Enter"
            value={state.benefitCompanyLink}
            onValue={(benefitCompanyLink) =>
              setState({ ...state, benefitCompanyLink })
            }
          />
          <Input
            disabled={disabled}
            type="select"
            label="Category"
            placeholder="Please Select"
            value={state.benefitCategory}
            onValue={({ value }) =>
              setState({ ...state, benefitCategory: value })
            }
            options={categories}
          />
          <Input
            disabled={disabled}
            type="multiselect"
            label="Location"
            onSearch={debouncedLocation}
            placeholder="Please Select"
            value={state.benefitLocations}
            onValue={(value) => setState({ ...state, benefitLocations: value })}
            onNewTag={handleNewTag}
            options={locations}
          />
          <GridCell columnSpan={2}>
            <Input
              disabled={disabled}
              multiline
              rows={3}
              type="text"
              label="Benefit"
              placeholder="Please Enter"
              value={state.description}
              onValue={(description) => setState({ ...state, description })}
            />
          </GridCell>
        </ChangeBenefitModalMain>
      </Stack>
      {ccbModal && (
        <ConfirmChangeBenefitModal
          handleAction={handleUpdate}
          onClose={closeCcbModal}
        />
      )}
    </Modal>
  );
};

export default ChangeBenefitModal;
