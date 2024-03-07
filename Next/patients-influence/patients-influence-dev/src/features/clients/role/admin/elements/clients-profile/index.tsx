import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { Modal, Tabs } from 'components/custom';
import { TClientsProfileModalProps } from 'features/clients/role/admin/elements/clients-profile/types';
import {
  ClientsProfileModalMain,
  ClientTitle,
} from 'features/clients/role/admin/elements/clients-profile/style';
import { Button, Input } from 'components/ui';
import { Stack } from 'components/system';
import { EditIcon } from 'components/svg';
import { ISingleClientResponse } from 'api/client/types';
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

const ClientsProfile = ({
  clientUserId,
  onClose,
  clientData,
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

    totalCampaigns: '',
    campaignsLastMonth: '',
    totalReports: '',
    reportsLastMonth: '',
    totalSMLReports: '',
    smlLastMonth: '',
    totalSurveys: '',
    surveysLastMonth: '',
    totalRevenue: '',
    revenueLastMonth: '',

    comments: [],
    labels: [],
    meetings: [],
    reminders: [],
    tasks: [],

    onPlatformSince: '',
    status: '',
  });

  const [tab, setTab] = useState(0);

  const [disabled, setDisabled] = useState(true);

  const [diseaseArea, setDiseaseArea] = useState<any[]>([]);

  const [companies, setCompanies] = useState<any>();
  const [titles, setTitles] = useState<any[]>([]);
  const [locations, setLocations] = useState([]);
  const [markets, setMarkets] = useState<any>([]);
  const [industry, setIndustry] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [statuses, setStatuses] = useState<any>([]);

  const [loading, setLoading] = useState(false);

  const { push } = useSnackbar();

  const handleEdit = () => {
    setDisabled((prev) => !prev);
  };

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
      result.map((x: any) => ({
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

  useEffect(() => {
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

  useEffect(() => {
    if (client && statuses.length) {
      setClientState((prevState: any) => {
        let location;
        let clientMarkets;
        let industries;
        let clientProducts;
        let onPlatformSince;
        let statusName;

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

        const status = statuses.find(
          (statusVal: any) => statusVal.value === client.status
        );

        switch (status.label) {
          case 'DoNotContact':
            statusName = 'Do Not Contact';
            break;
          case 'ToBeApproved':
            statusName = 'To Be Approved';
            break;
          default:
            statusName = status.label;
            break;
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
            // eslint-disable-next-line no-nested-ternary
            label: x.location.name
              ? x.location.country
                ? `${x.location.name}, ${x.location.country.name}}`
                : `${x.location.name}`
              : x.location.country.name,
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
          totalCampaigns: clientData.totalCampaigns,
          campaignsLastMonth: clientData.totalCampaignsLast30Days,
          totalReports: '',
          reportsLastMonth: '',
          totalSMLReports: clientData.totalSMLs,
          smlLastMonth: clientData.totalSMLsLast30Days,
          totalSurveys: clientData.totalSurveys,
          surveysLastMonth: clientData.totalSurveysLast30Days,
          totalRevenue: clientData.totalBudget,
          revenueLastMonth: clientData.totalBudgetLast30Days,
          status: statusName,
        };
      });
    }
  }, [client, clientData, statuses]);

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
    if (client && Object.keys(client).length > 0) {
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
        };

        await ClientAPI.updateClient(formData, clientUserId).then(() => {
          onClose();
          reload();
        });

        push('User successfully updated.', { variant: 'success' });
      } catch (err) {
        const error = err as AxiosError<any>;
        if (
          error.name === 'AxiosError' &&
          error.response &&
          error.response.data.message.length &&
          error.response.data.message.includes(
            'company.name should not be empty'
          )
        ) {
          const notificationMessage =
            'Company name cannot be empty. Please provide a valid company name.';
          push(notificationMessage, { variant: 'error' });
        } else {
          push('User update failed.', { variant: 'error' });
        }
      }
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
            onClick={handleEdit}
          />
        </ClientTitle>
      }
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => (disabled ? onClose() : updateClient())}
        >
          {disabled ? 'Close' : 'Edit'}
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack style={{ height: '500px' }}>
        <Tabs
          // tabs={['Info', 'Projects', 'Management']}
          tabs={['Info', 'Projects']}
          value={tab}
          onValue={setTab}
        />
        {tab === 0 && (
          <ClientsProfileModalMain columns={2}>
            <Input
              disabled={disabled}
              type="text"
              label="Email"
              placeholder="Please Enter"
              value={clientState.email}
              onValue={(email) => setClientState({ ...clientState, email })}
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
              isFilterActive
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
              type="text"
              label="Status"
              disabled
              placeholder="Please Enter"
              value={clientState.status}
              onValue={(status) => setClientState({ ...clientState, status })}
            />
          </ClientsProfileModalMain>
        )}
        {tab === 1 && (
          <ClientsProfileModalMain columns={1}>
            <Stack direction="horizontal">
              <Input
                disabled
                type="text"
                label="Total Campaigns"
                placeholder="Please Enter"
                value={clientState.totalCampaigns}
                onValue={(totalCampaigns) =>
                  setClientState({ ...clientState, totalCampaigns })
                }
              />
              <Input
                disabled
                type="text"
                label="Campaigns in Last 30 Days"
                placeholder="Please Enter"
                value={clientState.campaignsLastMonth}
                onValue={(campaignsLastMonth) =>
                  setClientState({ ...clientState, campaignsLastMonth })
                }
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                disabled
                type="text"
                label="Total Reports"
                placeholder="Please Enter"
                value={clientState.totalReports}
                onValue={(totalReports) =>
                  setClientState({ ...clientState, totalReports })
                }
              />
              <Input
                disabled
                type="text"
                label="Reports in Last 30 Days"
                placeholder="Please Enter"
                value={clientState.reportsLastMonth}
                onValue={(reportsLastMonth) =>
                  setClientState({ ...clientState, reportsLastMonth })
                }
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                disabled
                type="text"
                label="Total SML Reports"
                placeholder="Please Enter"
                value={clientState.totalSMLReports}
                onValue={(totalSMLReports) =>
                  setClientState({ ...clientState, totalSMLReports })
                }
              />
              <Input
                disabled
                type="text"
                label="SML Reports in Last 30 Days"
                placeholder="Please Enter"
                value={clientState.smlLastMonth}
                onValue={(smlLastMonth) =>
                  setClientState({ ...clientState, smlLastMonth })
                }
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                disabled
                type="text"
                label="Total Surveys"
                placeholder="Please Enter"
                value={clientState.totalSurveys}
                onValue={(totalSurveys) =>
                  setClientState({ ...clientState, totalSurveys })
                }
              />
              <Input
                disabled
                type="text"
                label="Surveys in Last 30 Days"
                placeholder="Please Enter"
                value={clientState.surveysLastMonth}
                onValue={(surveysLastMonth) =>
                  setClientState({ ...clientState, surveysLastMonth })
                }
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                disabled
                type="text"
                label="Total Revenue"
                placeholder="Please Enter"
                value={clientState.totalRevenue}
                onValue={(totalRevenue) =>
                  setClientState({ ...clientState, totalRevenue })
                }
              />
              <Input
                disabled
                type="text"
                label="Revenue in Last 30 Days"
                placeholder="Please Enter"
                value={clientState.revenueLastMonth}
                onValue={(revenueLastMonth) =>
                  setClientState({ ...clientState, revenueLastMonth })
                }
              />
            </Stack>
          </ClientsProfileModalMain>
        )}
        {/* Saving for future reference */}
        {/* {tab === 2 && (
          <ClientsProfileModalMain columns={1}>
            <Stack direction="horizontal">
              <Input
                disabled={disabled}
                type="multiselect"
                label="Comments"
                placeholder="Please Enter"
                value={clientState.comments}
                onValue={(comments) =>
                  setClientState({ ...clientState, comments })
                }
              />

              // <Input
              //   disabled={disabled}
              //   type="multiselect"
              //   label="Labels"
              //   placeholder="Please Enter"
              //   value={clientState.labels}
              //   onValue={(labels) => setClientState({ ...clientState, labels })}
              // /> 
            </Stack>
            <Stack direction="horizontal">
              <Input
                disabled={disabled}
                type="multiselect"
                label="Meetings"
                placeholder="Please Enter"
                value={clientState.meetings}
                onValue={(meetings) =>
                  setClientState({ ...clientState, meetings })
                }
              />
              <Input
                disabled={disabled}
                type="multiselect"
                label="Reminders"
                placeholder="Please Enter"
                value={clientState.reminders}
                onValue={(reminders) =>
                  setClientState({ ...clientState, reminders })
                }
              />
            </Stack>
            <Stack direction="horizontal">
              <Input
                disabled={disabled}
                type="multiselect"
                label="Tasks"
                placeholder="Please Enter"
                value={clientState.tasks}
                onValue={(tasks) => setClientState({ ...clientState, tasks })}
              />
            </Stack>
          </ClientsProfileModalMain>
        )} */}
      </Stack>
    </Modal>
  );
};

export default ClientsProfile;
