import React, { useEffect, useState } from 'react';
import { Modal } from 'components/custom';
import { TAddBenefitModalProps } from 'features/benefits/role/admin/elements/add-benefit/types';
import { AddBenefitModalMain } from 'features/benefits/role/admin/elements/add-benefit/styles';
import { Button, Input } from 'components/ui';
import { GridCell, Stack } from 'components/system';
import { ConfirmAddBenefitModal } from 'features/benefits/role/admin/elements';
import { useDebounce, useModal, useSnackbar } from 'hooks';
import { BenefitsAPI, LocationAPI } from 'api';
import { TAddBenefit } from 'api/benefits/types';

const AddBenefitModal = ({
  onClose,
  reload,
  ...props
}: TAddBenefitModalProps) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<any>({
    benefitPartnership: {
      value: undefined,
      label: '',
    },
    benefitCompanyLink: '',
    description: '',
    benefitCategoryId: null,
    benefitLocations: [],
  });

  const [cabModal, openCabModal, closeCabModal] = useModal(false);

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

  const getLocations = async (searchTerm: string = '') => {
    const { result } = await LocationAPI.getAll(searchTerm);

    setLocations(
      result.map((x: any) => ({
        value: x.id,
        label: x.country ? `${x.name}, ${x.country.name}` : x.name,
      }))
    );
  };

  const handlePartnershipKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setState({
        ...state,
        benefitPartnership: {
          ...state.benefitPartnership,
          label: event.target.value,
        },
      });
      event.target.blur();
    }
  };

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleNewTag = (v: any) => {
    setState({ ...state, benefitLocations: [...state.benefitLocations, v] });
  };

  const { push } = useSnackbar();

  const handleAddBenefit = async () => {
    const formattedBody: TAddBenefit = {
      ...state,
      benefitCategoryId: state.benefitCategoryId.value || undefined,
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
      await BenefitsAPI.addBenefit(formattedBody).then(() => {
        reload();
        onClose();
        push('Benefit successfully added.', { variant: 'success' });
      });
    } catch {
      push("Benefit couldn't be added.", { variant: 'error' });
    }
  };

  const debouncedLocation = useDebounce(getLocations, 250);

  useEffect(() => {
    getCompanies();
    getCategories();
    getLocations();
  }, []);

  return (
    <Modal
      size="medium"
      title="Add Benefit"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={openCabModal}
        >
          Confirm
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <AddBenefitModalMain columns={2}>
          <Input
            type="select"
            label="Company Name"
            placeholder="Please Enter"
            value={state.benefitPartnership || ''}
            onSearch={debounce(getCompanies, 250)}
            onValue={(value) =>
              setState({ ...state, benefitPartnership: value })
            }
            onKeyDown={handlePartnershipKeyDown}
            noOptionsText="Press Enter to Add Yours"
            options={companies}
            loading={loading}
          />
          <Input
            type="text"
            label="Company website"
            placeholder="Please Enter"
            value={state.benefitCompanyLink}
            onValue={(value) =>
              setState({ ...state, benefitCompanyLink: value })
            }
          />
          <Input
            type="select"
            label="Category"
            placeholder="Please Select"
            value={state.benefitCategoryId}
            onSearch={debounce(getCategories, 250)}
            onValue={(value) =>
              setState({ ...state, benefitCategoryId: value })
            }
            options={categories}
            loading={loading}
          />
          <Input
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
              multiline
              rows={3}
              type="text"
              label="Benefit"
              placeholder="Please Enter"
              value={state.description}
              onValue={(description) => setState({ ...state, description })}
            />
          </GridCell>
        </AddBenefitModalMain>
      </Stack>
      {cabModal && (
        <ConfirmAddBenefitModal
          handleAction={handleAddBenefit}
          onClose={() => {
            closeCabModal();
          }}
        />
      )}
    </Modal>
  );
};

export default AddBenefitModal;
