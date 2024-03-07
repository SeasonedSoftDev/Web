import React, { useState } from 'react';
import { Modal, Tabs } from 'components/custom';
import { TClientsProfileModalProps } from 'features/discover-clients/role/admin/elements/clients-profile/types';
import {
  ClientsProfileModalMain,
  ClientTitle,
} from 'features/discover-clients/role/admin/elements/clients-profile/style';
import { Button, Input } from 'components/ui';
import { Stack } from 'components/system';
import { EditIcon } from 'components/svg';
import {
  ClientAPI,
  CompanyAPI,
  DiseaseAreaAPI,
  EnumsApi,
  IndustryApi,
  LocationAPI,
  ProductApi,
} from 'api';
import { useDebounce, useSnackbar } from 'hooks';
import { ISingleClientResponse } from 'api/client/types';

const ClientsProfile = ({
  onClose,
  clientUserId,
  reload,
  ...props
}: TClientsProfileModalProps) => {
  const [client, setClient] = useState<ISingleClientResponse>();
  const [clientState, setClientState] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    company: null,
    role: null,
    product: [],
    industry: null,
    diseaseAreas: [],
    location: null,
    market: [],

    onPlatformSince: '',
    status: null,
    // Status Change is currently not supported on the BE side
    // statusChange: '',
  });

  const [tab, setTab] = useState(0);

  const [disabled, setDisabled] = useState(true);

  const handleDisabled = () => {
    setDisabled(!disabled);
  };

  const [diseaseArea, setDiseaseArea] = useState<any>([]);

  const [companies, setCompanies] = useState<any>();
  const [titles, setTitles] = useState<any>([]);
  const [locations, setLocations] = useState([]);
  const [markets, setMarkets] = useState<any>([]);
  const [industry, setIndustry] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [statuses, setStatuses] = useState<any>([]);

  const [loading, setLoading] = useState(false);

  const { push } = useSnackbar();

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setClientState({
        ...clientState,
        company: { value: clientState.company, label: event.target.value },
      });
      event.target.blur();
    }
  };

  const handleNewMarketTag = (v: any) => {
    setClientState({ ...clientState, markets: [...clientState.markets, v] });
  };

  const addProducts = async (v: any) => {
    await ProductApi.createProduct(v);
  };

  const handleNewProductTag = async (v: any) => {
    addProducts({
      name: v.label,
    });
    setClientState({
      ...clientState,
      product: [...clientState.product, { value: v.label, label: v.label }],
    });
  };

  const handleNewDiseaseTag = (v: any) => {
    setClientState({
      ...clientState,
      diseaseAreas: [...clientState.diseaseAreas, v],
    });
  };

  const getClient = async (userId: number) => {
    const data = await ClientAPI.getSingleClient(userId);
    setClient(data);
  };

  const getCompanies = async (s: string = '') => {
    setLoading(true);
    const { result } = await CompanyAPI.getAll(s);

    setCompanies(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
    setLoading(false);
  };

  const getTitles = async (s: string = '') => {
    const { result } = await CompanyAPI.getAllTitles(s);

    setTitles(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getDiseaseArea = async (s: string = '') => {
    setLoading(true);
    const { result } = await DiseaseAreaAPI.getAll(s);

    setDiseaseArea(
      result.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    );
    setLoading(false);
  };

  const getLocations = async (searchTerm: string = '') => {
    setLoading(true);
    const { result } = await LocationAPI.getAll(searchTerm);
    setLocations(
      result.map((data: any) => {
        const checkNotInitial = data.countryId
          ? `${data.name}, ${data.country.name}`
          : data.name;
        const label = !searchTerm.length
          ? `${data.name}, ${data.country.name}`
          : checkNotInitial;

        return {
          value: data.id,
          label,
        };
      })
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

    setProducts(result.map((x: any) => ({ value: x.id, label: x.name })));
  };

  const getUserStatuses = async () => {
    const result = await EnumsApi.getUserStatuses();

    setStatuses(
      result
        .filter(
          (obj: any) =>
            obj.name !== 'Identified' &&
            obj.name !== 'Contacted' &&
            obj.name !== 'ToBeApproved' &&
            obj.name !== 'Approved' &&
            obj.name !== 'DoNotContact'
        )
        .map((x: any) => ({
          value: x.value,
          label: x.name,
        }))
    );
  };

  const debounceCompanies = useDebounce(getCompanies, 300);
  const debounceTitles = useDebounce(getTitles, 300);
  const debouncedLocation = useDebounce(getLocations, 300);
  const debouncedDisease = useDebounce(getDiseaseArea, 300);
  const debouncedMarkets = useDebounce(getMarkets, 300);
  const debouncedProducts = useDebounce(getProducts, 300);
  const debouncedIndustry = useDebounce(getIndustry, 300);

  React.useEffect(() => {
    getClient(clientUserId);
    getUserStatuses();
    getLocations();
    getDiseaseArea();
    getCompanies();
    getTitles();
    getProducts();
    getIndustry();
    getMarkets();
  }, []);

  React.useEffect(() => {
    if (client && statuses.length) {
      // eslint-disable-next-line arrow-body-style
      setClientState((prevState: any) => {
        let location;
        let clientMarkets;
        let industries;
        let clientProducts;
        let onPlatformSince;

        const status = statuses.find(
          (statusVal: any) => statusVal.value === client.status
        );

        if (client.location) {
          const label =
            client.location.countryId && client.location.country
              ? `${client.location.name}, ${client.location.country.name}`
              : client.location.name;

          location = {
            label,
            value: client.location.id,
          };
        }

        const diseaseAreas = client.client.clientDiseaseAreas
          ? client.client.clientDiseaseAreas.map((area) => {
              const label = area.diseaseArea.name;
              const value = area.diseaseArea.id;
              return {
                label,
                value,
              };
            })
          : [];

        if (client.client.industry) {
          industries = {
            value: client.client.industry.id,
            label: client.client.industry.name,
          };
        } else {
          industries = null;
        }

        if (client.client.clientMarkets) {
          clientMarkets = client.client.clientMarkets.map((x: any) => ({
            value: x.location.id,
            label:
              client.location.countryId && client.location.country
                ? `${x.location.name}, ${x.location.country.name}}`
                : x.location.name,
          }));
        }

        if (client.client.clientProducts) {
          clientProducts = client.client.clientProducts.map((x: any) => ({
            value: x.product.id,
            label: x.product.name,
          }));
        }

        if (client.client.createdAt) {
          onPlatformSince = new Date(client.client.createdAt);
        }

        return {
          ...prevState,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          company: {
            label: client.client.company.name,
            value: client.client.company.id,
          },
          role: {
            label: client.client.companyTitle.name,
            value: client.client.companyTitle.id,
          },
          location: location || null,
          diseaseAreas,
          industry: industries,
          market: clientMarkets,
          product: clientProducts,
          onPlatformSince,
          status,
        };
      });
    }
  }, [client, statuses]);

  const formatedProducts = clientState.product.map(
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

  const updateClient = async () => {
    if (client && Object.keys(client).length > 0)
      try {
        const formData = {
          email: clientState.email,

          company: {
            name: clientState.company ? clientState.company.label : undefined,
            companyId:
              clientState.company && clientState.company.value
                ? clientState.company.value
                : undefined,
          },
          companyTitleId: clientState.role ? clientState.role.value : undefined,
          clientProducts: clientState.product ? formatedProducts : undefined,
          industryId: clientState.industry
            ? clientState.industry.value
            : undefined,
          locationId: clientState.location
            ? clientState.location.value
            : undefined,
          marketIds: clientState.market
            ? clientState.market.map((x: any) => x.value)
            : undefined,
          diseaseAreaIds: clientState.diseaseAreas
            ? clientState.diseaseAreas.map((x: any) => x.value)
            : undefined,
          status: clientState.status.value || undefined,
        };
        await ClientAPI.updateClient(formData, clientUserId).then(() => {
          onClose();
          reload();
        });

        push('User successfully updated.', { variant: 'success' });
      } catch {
        push('User update failed.', { variant: 'error' });
      }
  };

  return (
    <Modal
      size="medium"
      title={
        <ClientTitle>
          {clientState.firstName} {clientState.lastName}
          <EditIcon
            style={
              disabled
                ? { cursor: 'pointer', color: '#7E839F' }
                : { cursor: 'pointer', color: '#448DC9' }
            }
            onClick={handleDisabled}
          />
        </ClientTitle>
      }
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => (disabled ? onClose() : updateClient())}
          // onClick={onClose}
        >
          {disabled ? 'Close' : 'Edit'}
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack style={{ height: '500px' }}>
        {/* <Tabs tabs={['Info', 'Management']} value={tab} onValue={setTab} /> */}
        <Tabs tabs={['Info']} value={tab} onValue={setTab} />
        {tab === 0 && (
          <ClientsProfileModalMain columns={2}>
            <Input
              type="text"
              label="Email"
              disabled={disabled}
              placeholder="Please Enter"
              value={clientState.email}
              onValue={(email) => setClientState({ ...clientState, email })}
            />
            <Input
              type="select"
              label="Company"
              disabled={disabled}
              placeholder="Please Enter"
              value={clientState.company}
              onSearch={debounceCompanies}
              onValue={(company) => setClientState({ ...clientState, company })}
              options={companies}
              onKeyDown={handleKeyDown}
              loading={loading}
            />
            <Input
              type="select"
              label="Role"
              disabled={disabled}
              placeholder="Please Enter"
              value={clientState.role}
              onSearch={debounceTitles}
              onValue={(role) => setClientState({ ...clientState, role })}
              options={titles}
            />
            <Input
              type="multiselect"
              label="Product"
              disabled={disabled}
              placeholder="Please Enter"
              value={clientState.product}
              onValue={(product) => setClientState({ ...clientState, product })}
              options={products}
              onSearch={debouncedProducts}
              onNewTag={handleNewProductTag}
              loading={loading}
              noOptionsText="Please Enter to Add Your Product"
            />
            <Input
              type="select"
              label="Industry"
              disabled={disabled}
              placeholder="Please Enter"
              value={clientState.industry}
              onValue={(industryVal) =>
                setClientState({ ...clientState, industry: industryVal })
              }
              options={industry}
              loading={loading}
              onSearch={debouncedIndustry}
            />
            <Input
              type="multiselect"
              label="Disease Area"
              placeholder="Please Enter"
              disabled={disabled}
              value={clientState.diseaseAreas}
              onSearch={debouncedDisease}
              onValue={(input) => {
                setClientState({ ...clientState, diseaseAreas: input });
              }}
              onNewTag={handleNewDiseaseTag}
              loading={loading}
              options={diseaseArea}
              isFilterActive
            />
            <Input
              type="select"
              label="Location"
              disabled={disabled}
              placeholder="Please Enter"
              value={clientState.location}
              onSearch={debouncedLocation}
              loading={loading}
              options={locations}
              onValue={(location) =>
                setClientState({ ...clientState, location })
              }
            />
            <Input
              type="multiselect"
              label="Markets"
              disabled={disabled}
              placeholder="Please Enter"
              value={clientState.market}
              onValue={(market) => setClientState({ ...clientState, market })}
              loading={loading}
              onSearch={debouncedMarkets}
              onNewTag={handleNewMarketTag}
              options={markets}
            />
            <Input
              type="date"
              label="On Platform Since"
              placeholder="Please Enter"
              disabled
              value={clientState.onPlatformSince}
              onValue={(onPlatformSince) =>
                setClientState({ ...clientState, onPlatformSince })
              }
            />
            <Input
              type="select"
              label="Status"
              disabled={disabled}
              placeholder="Please Enter"
              value={clientState.status}
              onValue={(status) => setClientState({ ...clientState, status })}
              options={statuses}
            />
          </ClientsProfileModalMain>
        )}
        {/* Saving for future reference */}
        {/* {tab === 1 && (
          <ClientsProfileModalMain columns={2}>
            <Input
              type="date"
              label="On Platform Since"
              placeholder="Please Enter"
              disabled={disabled}
              value={clientState.onPlatformSince}
              onValue={(onPlatformSince) =>
                setClientState({ ...clientState, onPlatformSince })
              }
            />
            <Input
              type="select"
              label="Status"
              disabled={disabled}
              placeholder="Please Enter"
              value={clientState.status}
              onValue={(status) => setClientState({ ...clientState, status })}
              options={statuses}
            />
            // <Input
            //   type="date"
            //   label="Status Change"
            //   disabled
            //   placeholder="Please Enter"
            //   value={clientState.statusChange}
            //   onValue={(statusChange) =>
            //     setClientState({ ...clientState, statusChange })
            //   }
            // />
          </ClientsProfileModalMain>
        )} */}
      </Stack>
    </Modal>
  );
};

export default ClientsProfile;
