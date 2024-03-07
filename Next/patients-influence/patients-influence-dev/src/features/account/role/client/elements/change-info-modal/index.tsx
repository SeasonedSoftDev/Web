import React, { useEffect, useState } from 'react';
import { Modal } from 'components/custom';
import { TChangeInfoModalProps } from 'features/account/role/client/elements/change-info-modal/types';
import { ChangeInfoModalMain } from 'features/account/role/client/elements/change-info-modal/styles';
import { Button, Input } from 'components/ui';
import { Stack } from 'components/system';
import {
  ClientAPI,
  CompanyAPI,
  DiseaseAreaAPI,
  IndustryApi,
  LocationAPI,
  ProductApi,
} from 'api';
import { useAppContext } from 'context';
import { useSnackbar } from 'hooks';

const ChangeInfoModal = ({
  onClose,
  data,
  refresh,
  ...props
}: TChangeInfoModalProps) => {
  const [state, setState] = useState<any>({
    company: data.company,
    role: data.role,
    diseaseArea: data.diseaseArea,
    location: data.location,
    industry: data.industry,
    markets: data.markets,
    product: data.product,
  });

  const { user } = useAppContext();

  const [id, setId] = useState(user.id);

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleNewTag = (v: any) => {
    setState({ ...state, diseaseArea: [...state.diseaseArea, v] });
  };

  const handleNewMarketTag = (v: any) => {
    setState({ ...state, markets: [...state.markets, v] });
  };

  const addProducts = async (v: any) => {
    await ProductApi.createProduct(v);
  };

  const handleNewProductTag = async (v: any) => {
    addProducts({
      name: v.label,
    });
    setState({
      ...state,
      product: [...state.product, { value: v.label, label: v.label }],
    });
  };

  const [company, setCompany] = useState<any>();
  const [role, setRole] = useState<any>();
  const [diseaseAreas, setDiseaseAreas] = useState<any>();
  const [location, setLocation] = useState<any>();
  const [industry, setIndustry] = useState<any>();
  const [markets, setMarkets] = useState<any>();
  const [product, setProduct] = useState<any>();
  const [loading, setLoading] = useState(false);

  const getCompanies = async (s: string = '') => {
    setLoading(true);
    const { result } = await CompanyAPI.getAll(s);

    setCompany(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
    setLoading(false);
  };
  const getTitles = async (s: string = '') => {
    const { result } = await CompanyAPI.getAllTitles(s);

    setRole(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };
  const getDiseaseAreas = async (s: string = '') => {
    setLoading(true);
    const { result } = await DiseaseAreaAPI.getAll(s);

    setDiseaseAreas(
      result.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    );
    setLoading(false);
  };

  const getLocations = async (s: string = '') => {
    setLoading(true);
    const { result } = await LocationAPI.getAll(s);
    setLocation(
      result.map((x: any) => ({
        value: x.id,
        label: x.country ? `${x.name}, ${x.country.name}` : x.name,
      }))
    );
    setLoading(false);
  };

  const getMarkets = async (s: string = '') => {
    setLoading(true);
    const { result } = await LocationAPI.getAll(s);
    setMarkets(
      result.map((x: any) => ({
        value: x.id,
        label: x.country ? `${x.name}, ${x.country.name}` : x.name,
      }))
    );
    setLoading(false);
  };

  const getIndustry = async (s: string = '') => {
    const { result } = await IndustryApi.getIndustries(s);

    setIndustry(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getProducts = async (s: string = '') => {
    const { result } = await ProductApi.getProducts(s);

    setProduct(result.map((x: any) => ({ value: x.id, label: x.name })));
  };

  useEffect(() => {
    getCompanies();
    getTitles();
    getDiseaseAreas();
    getLocations();
    getProducts();
    getMarkets();
    getIndustry();
  }, []);

  const { push } = useSnackbar();

  const formatedProducts = state.product.map(
    (item: { value: number | string; label: string }) => {
      if (typeof item.value === 'string') {
        return {
          name: item.value,
        };
      }
      return {
        productId: item.value,
      };
    }
  );

  const handleUpdate = async () => {
    try {
      await ClientAPI.updateClient(
        {
          company: {
            name: state.company ? state.company.label : undefined,
            companyId: state.company ? state.company.value : undefined,
          },
          companyTitleId: state.role ? state.role.value : undefined,
          clientProducts: state.product ? formatedProducts : undefined,
          industryId: state.industry ? state.industry.value : undefined,
          locationId: state.location ? state.location.value : undefined,
          marketIds: state.markets
            ? state.markets.map((x: any) => x.value)
            : undefined,
          diseaseAreaIds: state.diseaseArea
            ? state.diseaseArea.map((x: any) => x.value)
            : undefined,
        },
        id
      );

      push('User successfully updated.', { variant: 'success' });
    } catch {
      push('User update failed.', { variant: 'error' });
    }
  };

  return (
    <Modal
      size="medium"
      title="Do you want to change info?"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => {
            handleUpdate();
            // refresh();
            setTimeout(onClose, 250);
          }}
        >
          Change info
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <ChangeInfoModalMain columns={2}>
          <Input
            type="select"
            label="Company"
            placeholder="Please Select"
            value={state.company}
            onValue={(input) => setState({ ...state, company: input })}
            onSearch={debounce(getCompanies, 250)}
            options={company}
            loading={loading}
          />
          <Input
            type="select"
            label="Role"
            placeholder="Please Select"
            value={state.role}
            onValue={(input) => setState({ ...state, role: input })}
            onSearch={debounce(getTitles, 250)}
            options={role}
            loading={loading}
          />
          <Input
            type="select"
            label="Location"
            placeholder="Please Select"
            value={state.location}
            onValue={(input) => setState({ ...state, location: input })}
            onSearch={debounce(getLocations, 250)}
            loading={loading}
            options={location}
          />
          <Input
            type="select"
            label="Industry"
            placeholder="Please Select"
            value={state.industry}
            onValue={(input) => setState({ ...state, industry: input })}
            options={industry}
            onSearch={debounce(getIndustry, 250)}
            loading={loading}
          />
          <Input
            type="multiselect"
            label="Disease Areas"
            placeholder="Please Select"
            value={state.diseaseArea}
            onValue={(diseaseArea) => setState({ ...state, diseaseArea })}
            onSearch={debounce(getDiseaseAreas, 250)}
            onNewTag={handleNewTag}
            loading={loading}
            options={diseaseAreas}
            isFilterActive
          />
          <Input
            type="multiselect"
            label="Markets"
            placeholder="Please Select"
            value={state.markets}
            onValue={(input) => setState({ ...state, markets: input })}
            onSearch={debounce(getMarkets, 250)}
            loading={loading}
            onNewTag={handleNewMarketTag}
            options={markets}
          />
          <Input
            type="multiselect"
            label="Product"
            placeholder="Please Select"
            value={state.product}
            onValue={(input) => setState({ ...state, product: input })}
            options={product}
            onSearch={debounce(getProducts, 250)}
            onNewTag={handleNewProductTag}
            loading={loading}
            noOptionsText="Press Enter to Add Yours"
          />
        </ChangeInfoModalMain>
      </Stack>
    </Modal>
  );
};

export default ChangeInfoModal;
