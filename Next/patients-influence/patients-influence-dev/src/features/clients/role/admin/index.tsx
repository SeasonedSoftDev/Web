import React, { useEffect, useState } from 'react';
import {
  ClientsPageMain,
  ClientsPageCharts,
  ClientsPageFilter,
  ClientsPageFilterActions,
} from 'features/clients/styles';
import {
  CardWithChart,
  CardWithText,
  Menu,
  CheckboxTable,
  Title,
  NewCheckboxTable,
} from 'components/custom';
import {
  ContactedIcon,
  ContactIcon,
  DeleteIcon,
  EditIcon,
  HospitalIcon,
  IdentifiedIcon,
  RegisteredIcon,
  ScheduleIcon,
  SlidersHorizontalIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { faker } from '@faker-js/faker';
import { Button, Input, InputGroup, Pagination } from 'components/ui';
import { Grid, Stack } from 'components/system';
import { Collapse, Tooltip } from '@mui/material';
import { DClientsHead, DGenerateClientsFilter } from 'features/clients/data';
import { TTableRenderItemObject } from 'components/custom/table/types';
import {
  useDebounce,
  useMenu,
  useModal,
  usePagination,
  useSnackbar,
} from 'hooks';
import {
  ContactClientsModal,
  DeleteClientsModal,
  ExportClientsModal,
  ClientsProfile,
  NoteClients,
  NotificationsSettingsModal,
  ScheduleClientsModal,
  ClientActions,
} from 'features/clients/role/admin/elements';
import {
  AmbassadorAPI,
  ClientAPI,
  CompanyAPI,
  DiseaseAreaAPI,
  IndustryApi,
  LocationAPI,
  ProductApi,
} from 'api';
import { IPaginatedClients } from 'api/client/types';
import UsersAPI from 'api/users';
import { formatLongString } from 'utilities/string-converter';
import { BackupTableRounded } from '@mui/icons-material';
import { fetchAndCacheData } from 'utilities/local-storage';
import {
  ISpan,
  ActionsMenu as CustomActionsMenu,
  ClientProfileAction,
  TableTooltip,
  CardWrapper,
} from './styles';
import PromptModal from './elements/prompt-modal';
import {
  getDiseasesAsCommaSeparatedString,
  getMarketsAsCommaSeparatedString,
} from './helpers';

interface ISelectedField {
  label: string;
  value: string;
}

interface IMinMaxField {
  min: string;
  max: string;
}

interface IFilterProps {
  search?: string;
  industry: ISelectedField[];
  company: ISelectedField[];
  role: ISelectedField[];
  product: ISelectedField[];
  ambassador: ISelectedField[];
  diseaseArea: ISelectedField[];
  location: ISelectedField[];
  market: ISelectedField[];
  projectStatus: ISelectedField | null;
  // status: number | null;
  joinedFrom: Date | null;
  joinedTo: Date | null;
  project: ISelectedField | null;
  totalProject: IMinMaxField;
  projectLast30Days: IMinMaxField;
  budget: IMinMaxField;
}

const ClientsPage = () => {
  const initialFilters: IFilterProps = {
    search: '',
    industry: [],
    company: [],
    role: [],
    product: [],
    ambassador: [],
    diseaseArea: [],
    location: [],
    market: [],
    projectStatus: null,
    joinedFrom: null,
    joinedTo: null,
    project: null,
    totalProject: {
      min: '',
      max: '',
    },
    projectLast30Days: {
      min: '',
      max: '',
    },
    budget: {
      min: '',
      max: '',
    },
  };

  const [filter, setFilter] = useState<IFilterProps>(initialFilters);

  const [filterOpen, setFilterOpen] = useState(false);

  const [filterCleared, setFilterCleared] = useState(false);

  const [clients, setClients] = useState<IPaginatedClients[]>([]);
  const [checkedClients, setCheckedClients] = useState<number[]>([]);
  const [currentClientId, setCurrentClientId] = useState<any>();
  const [currentClient, setCurrentClient] = useState<IPaginatedClients>();

  const { push } = useSnackbar();

  const getCurrentClientId = (value: any) => {
    setCurrentClientId(value);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const [menu, open, setOpen, buttonRegRef, position] = useMenu(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const [eModal, openEModal, closeEModal] = useModal(false);
  const [diModal, openDiModal, closeDiModal] = useModal(false);
  const [ciModal, openCiModal, closeCiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [nsModal, openNsModal, closeNsModal] = useModal(false);
  const [ipModal, openIpModal, closeIpModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);

  const [tRegModal, openTRegModal, closeTRegModal] = useModal(false);

  const [
    removeBulkClientsModal,
    openRemoveBulkClientsModal,
    closeRemoveBulkClientsModal,
  ] = useModal(false);

  const [filterParams, setFilterParams] = useState({});

  const [clientsOverTime1, setClientsOverTimeData1] = useState<any>([]);
  const [clientsOverTime2, setClientsOverTimeData2] = useState<any>([]);
  const [clientsOverTime3, setClientsOverTimeData3] = useState<any>([]);
  const [clientsOverTime4, setClientsOverTimeData4] = useState<any>([]);

  const getStateValueAsNumArray = (stateValue: ISelectedField[]): number[] =>
    stateValue && stateValue.length
      ? stateValue.map((item) => +item.value)
      : [];

  const { pagesCount, page, setTotalResults, handlePageChange, reload } =
    usePagination({
      limit: 10,
      page: 1,
      onChange: async (params, setPage) => {
        const formattedFilterParams = {
          search: filter.search,
          industryIds: filter.industry.length
            ? getStateValueAsNumArray(filter.industry)
            : undefined,
          companyIds: filter.company.length
            ? getStateValueAsNumArray(filter.company)
            : undefined,
          roleIds: filter.role.length
            ? getStateValueAsNumArray(filter.role)
            : undefined,
          productIds: filter.product.length
            ? getStateValueAsNumArray(filter.product)
            : undefined,
          ambassadorIds: filter.ambassador.length
            ? getStateValueAsNumArray(filter.ambassador)
            : undefined,
          diseaseAreaIds: filter.diseaseArea.length
            ? getStateValueAsNumArray(filter.diseaseArea)
            : undefined,
          // locationIds: filter.location ? [filter.location.value] : undefined,
          marketIds: filter.market.length
            ? getStateValueAsNumArray(filter.market)
            : undefined,
          locationIds: filter.location.length
            ? getStateValueAsNumArray(filter.location)
            : undefined,
          projectStatus: filter.projectStatus
            ? filter.projectStatus?.value
            : undefined,
          project: filter.project ? filter.project.value : undefined,
          budgetMin:
            filter.budget && filter.budget.min.length
              ? +filter.budget.min
              : undefined,
          budgetMax:
            filter.budget && filter.budget.max.length
              ? +filter.budget.max
              : undefined,
          totalProjectsMin:
            filter.totalProject && filter.totalProject.min.length
              ? +filter.totalProject.min
              : undefined,
          totalProjectsMax:
            filter.totalProject && filter.totalProject.max.length
              ? +filter.totalProject.max
              : undefined,
          projectsLast30DaysMin:
            filter.projectLast30Days && filter.projectLast30Days.min.length
              ? +filter.projectLast30Days.min
              : undefined,
          projectsLast30DaysMax:
            filter.projectLast30Days && filter.projectLast30Days.max.length
              ? +filter.projectLast30Days.max
              : undefined,
          joinedFrom: filter.joinedFrom || undefined,
          joinedTo: filter.joinedTo || undefined,
        };

        const { dataFormatted, pagination } = await ClientAPI.getClientsTable({
          limit: params.limit,
          skip: params.skip,
          ...formattedFilterParams,
        });

        setPage(params.page);

        setClients(dataFormatted);
        setTotalResults(pagination.totalFilteredItems);
      },
    });

  const handleBulkClientsRemoval = async () => {
    try {
      await UsersAPI.deleteManyUsers({
        userIds: checkedClients,
      });
      reload();
      setCheckedClients([]);

      push('Influencers successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const toggleClient = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedClients([...checkedClients, rowId]);
    } else {
      setCheckedClients(checkedClients.filter((id) => id !== rowId));
    }
  };

  const toggleAllCheckedClients = (checked: boolean) => {
    if (checked) {
      const currentPageIds = clients.map((row) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedClients, ...currentPageIds])
      );
      setCheckedClients(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = clients.map((row) => row.id);
      const newSelectedRows = checkedClients.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedClients(newSelectedRows);
    }
  };

  const bulkActions = [
    {
      icon: <ContactIcon />,
      label: 'Contact',
      action: () => {
        handleMenu();
      },
    },
    {
      icon: <EditIcon />,
      label: 'Note',
      action: () => {
        handleMenu();
      },
    },
    {
      icon: <ScheduleIcon />,
      label: 'Schedule',
      action: () => {
        handleMenu();
      },
    },
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openTRegModal();
        handleMenu();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        openRemoveBulkClientsModal();
        handleMenu();
      },
    },
  ];
  const getClientsOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response = await ClientAPI.getClientsOverTimeData({
        ...filterParams,
        ...queryParams,
      });

      if (response.data) {
        return response;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      throw new Error('Error: Failed to fetch data!');
    }
  };

  const calculateRelativeGrowth = (
    data: { timestamp: string; value: number }[]
  ) => {
    const newData = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        const currentValue = data[i].value;
        const currentTimestamp = data[i].timestamp;
        newData.push({ timestamp: currentTimestamp, value: currentValue });
      } else {
        const previousValue = i !== 0 ? data[i - 1].value : data[0].value;
        const currentValue = data[i].value;
        const currentTimestamp = data[i].timestamp;
        const dailyGrowth = currentValue - previousValue;
        // data[i].value = dailyGrowth;
        newData.push({ timestamp: currentTimestamp, value: dailyGrowth });
      }
    }

    return newData;
  };

  const getClientGraphDataAsync =
    (
      industryId: number,
      setDataFunction: (data: any) => void,
      key: string,
      reformatToAbsoluteGraphData: boolean = false,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getClientsOverTimeData({
            industryId,
            useStrictPeriod: false,
            numberOfPoints: 30,
            graphType: 'cumulative',
            includeData: ['changePercentageMonth'],
          }),
        key,
        forceUpdate
      );

      if (reformatToAbsoluteGraphData) {
        result.data = calculateRelativeGrowth(result.data);
      }

      setDataFunction(result);
    };

  const [products, setProducts] = useState<any>([]);
  const [diseaseAreas, setDiseaseAreas] = useState<any[]>([]);
  const [locations, setLocations] = useState<any>();
  const [markets, setMarkets] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [titles, setTitles] = useState<any[]>([]);
  const [ambassadors, setAmbassadors] = useState<any[]>([]);

  const getProducts = async (s: string = '') => {
    const { result } = await ProductApi.getProducts(s);

    setProducts(
      result.map((data: any) => ({
        value: data.id,
        label: data.name,
      }))
    );
  };

  const getDiseaseAreas = async (s: string = '') => {
    const { result } = await DiseaseAreaAPI.getAll(s);

    setDiseaseAreas(
      result.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    );
  };

  const getLocations = async (s: string = '') => {
    const { result } = await LocationAPI.getAll(s);
    setLocations(
      result.map((data: any) => ({
        value: data.id,
        label: data.country ? `${data.name}, ${data.country.name}` : data.name,
      }))
    );
  };

  const getMarkets = async (s: string = '') => {
    const { result } = await LocationAPI.getAll(s);
    setMarkets(
      result.map((x: any) => ({
        value: x.id,
        label: x.country ? `${x.name}, ${x.country.name}` : x.name,
      }))
    );
  };

  const getIndustries = async (s: string = '') => {
    const { result } = await IndustryApi.getIndustries(s);

    setIndustries(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getCompanies = async (s: string = '') => {
    const { result } = await CompanyAPI.getAll(s);

    setCompanies(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
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

  const getAmbassadors = async (s: string = '') => {
    const { result } = await AmbassadorAPI.getAmbassadorSearch(s);

    setAmbassadors(
      result.map((x: any) => ({
        value: x.id,
        label: `${x.firstName} ${x.lastName}`,
      }))
    );
  };

  const debouncedProducts = useDebounce(getProducts, 250);
  const debouncedDiseaseAreas = useDebounce(getDiseaseAreas, 250);
  const debouncedLocations = useDebounce(getLocations, 250);
  const debouncedMarkets = useDebounce(getMarkets, 250);
  const debouncedIndustries = useDebounce(getIndustries, 250);
  const debouncedCompanies = useDebounce(getCompanies, 250);
  const debouncedTitles = useDebounce(getTitles, 250);
  const debouncedAmbassadors = useDebounce(getAmbassadors, 250);

  useEffect(() => {
    getProducts();
    getDiseaseAreas();
    getLocations();
    getMarkets();
    getIndustries();
    getCompanies();
    getTitles();
    getAmbassadors();
    getClientGraphDataAsync(
      1,
      setClientsOverTimeData1,
      'setClientsOverTimeData1',
      true
    )();
    getClientGraphDataAsync(
      2,
      setClientsOverTimeData2,
      'setClientsOverTimeData2',
      true
    )();
    getClientGraphDataAsync(
      3,
      setClientsOverTimeData3,
      'setClientsOverTimeData3',
      true
    )();
    getClientGraphDataAsync(
      4,
      setClientsOverTimeData4,
      'setClientsOverTimeData4',
      true
    )();
  }, []);

  const last30daysValues = clientsOverTime1?.data?.slice(-30);

  const sumOfLast30DaysValues = last30daysValues?.reduce(
    (accumulator: number, currentValue: { value: number }) =>
      accumulator + currentValue.value,
    0
  );

  const last12WeeksValues = clientsOverTime2?.data?.slice(-84);

  const sumOfLast12WeeksValues = last12WeeksValues?.reduce(
    (accumulator: number, currentValue: { value: number }) =>
      accumulator + currentValue.value,
    0
  );

  const lastYearValues = clientsOverTime3?.data?.slice(-365);

  const sumOfLastYearValues = lastYearValues?.reduce(
    (accumulator: number, currentValue: { value: number }) =>
      accumulator + currentValue.value,
    0
  );

  const last6yearsdaysValues = clientsOverTime4?.data?.slice(-2191);

  const sumOfLast6yearsDaysValues = last6yearsdaysValues?.reduce(
    (accumulator: number, currentValue: { value: number }) =>
      accumulator + currentValue.value,
    0
  );

  const renderItem = ({
    headItem,
    cell,
    row,
    table,
  }: // eslint-disable-next-line arrow-body-style
  TTableRenderItemObject) => {
    const client: IPaginatedClients = row.data;
    if (headItem.reference === 'firstName') {
      return (
        <ClientProfileAction
          onClick={() => {
            getCurrentClientId(client.id);
            setCurrentClient(client);
            openIpModal();
          }}
        >
          {row.data.firstName}
        </ClientProfileAction>
      );
    }
    if (headItem.reference === 'lastName') {
      return client.lastName;
    }
    if (headItem.reference === 'company') {
      return client.company.name;
    }
    if (headItem.reference === 'email') {
      return client.email;
    }
    if (headItem.reference === 'registeredAt') {
      return client.registeredAt.slice(0, 10);
    }
    if (headItem.reference === 'ambassador') {
      if (client.ambassador) {
        return client.ambassador.user
          ? `${client.ambassador.user.firstName} ${client.ambassador.user.lastName}`
          : '';
      }
    }
    if (headItem.reference === 'industry') {
      if (!client.industry) {
        return '';
      }

      const { name } = client.industry;

      return name;
    }

    if (headItem.reference === 'updatedAt') {
      return client.updatedAt.slice(0, 10);
    }

    if (headItem.reference === 'location') {
      if (!client.location) {
        return '';
      }

      const { location } = client;
      const label = location.country
        ? `${location.name}, ${location.country.name}`
        : location.name;

      return label;
    }
    if (headItem.reference === 'role') {
      return client.role.name;
    }
    if (headItem.reference === 'product') {
      const productCommaSeparatedString = client.products
        .map((disease) => disease.name)
        .join(', ');
      const formattedElipsisString = formatLongString(
        productCommaSeparatedString,
        50
      );
      return (
        <Tooltip
          style={{ cursor: 'pointer' }}
          title={<TableTooltip>{productCommaSeparatedString}</TableTooltip>}
        >
          <span>{formattedElipsisString}</span>
        </Tooltip>
      );
    }

    if (headItem.reference === 'totalBudget') {
      return client.totalBudget ? `${client.totalBudget} CHF` : 'NA';
    }
    if (headItem.reference === 'totalBudgetLast30Days') {
      return client.totalBudgetLast30Days
        ? `CHF ${client.totalBudgetLast30Days}`
        : 'NA';
    }
    if (headItem.reference === 'totalProjects') {
      return client.totalProjects ? `${client.totalProjects}` : 'No Projects';
    }
    if (headItem.reference === 'totalProjectsLast30Days') {
      return client.totalProjectsLast30Days
        ? `${client.totalProjectsLast30Days}`
        : 'No Projects';
    }
    if (headItem.reference === 'averageCampaignBudget') {
      return client.averageCampaignBudget
        ? `CHF ${client.averageCampaignBudget}`
        : 'NA';
    }

    if (headItem.reference === 'totalCampaignBudget') {
      return client.totalCampaignBudget
        ? `CHF ${client.totalCampaignBudget}`
        : 'NA';
    }
    if (headItem.reference === 'totalCampaigns') {
      return `${client.totalCampaigns}`;
    }
    if (headItem.reference === 'totalCampaignsLast30Days') {
      return `${client.totalCampaignsLast30Days}`;
    }
    if (headItem.reference === 'totalCampaignBudgetLast30Days') {
      return client.totalCampaignBudgetLast30Days
        ? `CHF ${client.totalCampaignBudgetLast30Days}`
        : 'NA';
    }
    if (headItem.reference === 'averageSurveysBudget') {
      return client.averageSurveyBudget
        ? `CHF ${client.averageSurveyBudget}`
        : 'NA';
    }
    if (headItem.reference === 'totalSurveysBudget') {
      return client.totalSurveyBudget
        ? `CHF ${client.totalSurveyBudget}`
        : 'NA';
    }
    if (headItem.reference === 'totalSurveysBudgetLast30Days') {
      return client.totalSurveyBudgetLast30Days
        ? `CHF ${client.totalSurveyBudgetLast30Days}`
        : 'NA';
    }
    if (headItem.reference === 'totalSurveys') {
      return client.totalSurveys;
    }
    if (headItem.reference === 'totalSurveysLast30Days') {
      return client.totalSurveysLast30Days;
    }
    if (headItem.reference === 'averageSmlBudget') {
      return client.averageSMLBudget ? `CHF ${client.averageSMLBudget}` : 'NA';
    }
    if (headItem.reference === 'totalSmlBudget') {
      return client.totalSMLBudget ? `CHF ${client.totalSMLBudget}` : 'NA';
    }
    if (headItem.reference === 'totalSmlBudgetLast30Days') {
      return client.totalSMLBudgetLast30Days
        ? `CHF ${client.totalSMLBudgetLast30Days}`
        : 'NA';
    }

    if (headItem.reference === 'totalSml') {
      return client.totalSMLs;
    }
    if (headItem.reference === 'totalSmlLast30Days') {
      return client.totalSMLsLast30Days;
    }

    if (headItem.reference === 'market') {
      if (client.markets && client.markets.length) {
        const { markets: clientMarket } = client;
        const clientMarketsString =
          getMarketsAsCommaSeparatedString(clientMarket);
        const formattedElipsisString = formatLongString(
          clientMarketsString,
          50
        );
        return (
          <Tooltip
            style={{ cursor: 'pointer' }}
            title={<TableTooltip>{clientMarketsString}</TableTooltip>}
          >
            <span>{formattedElipsisString}</span>
          </Tooltip>
        );
      }
    }

    if (headItem.reference === 'diseaseArea') {
      if (client.diseaseAreas) {
        const formattedDiseases = getDiseasesAsCommaSeparatedString(
          client.diseaseAreas
        );

        const formattedElipsisString = formatLongString(formattedDiseases, 50);
        return (
          <Tooltip
            style={{ cursor: 'pointer' }}
            title={<TableTooltip>{formattedDiseases}</TableTooltip>}
          >
            <span>{formattedElipsisString}</span>
          </Tooltip>
        );
      }
    }

    if (headItem.reference === 'totalOngoingProjects') {
      return client.totalOngoingProjects;
    }
    if (headItem.reference === 'actions') {
      return <ClientActions data={client.id} reload={reload} />;
    }

    return '';
  };

  const handleReloadClient = () => {
    reload();
    handlePageChange(1);
  };

  const clearFilters = () => {
    setFilter(initialFilters);
    setFilterCleared(true);
  };

  useEffect(() => {
    if (filterCleared) {
      setFilterCleared(false);
      handlePageChange(1);
    }
  }, [filter, filterCleared]);

  return (
    <ClientsPageMain>
      <ClientsPageCharts>
        <CardWrapper>
          <CardWithChart
            title="Biotech"
            icon={<IdentifiedIcon />}
            percent={
              clientsOverTime1?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              clientsOverTime1?.data
                ? clientsOverTime1?.data[clientsOverTime1.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                clientsOverTime1?.data &&
                clientsOverTime1.data.map((element: any) => element.value),
              labels:
                clientsOverTime1?.data &&
                clientsOverTime1?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Healthtech"
            icon={<ContactedIcon />}
            percent={
              clientsOverTime2?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              clientsOverTime2?.data
                ? clientsOverTime2?.data[clientsOverTime2.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                clientsOverTime2?.data &&
                clientsOverTime2.data.map((element: any) => element.value),
              labels:
                clientsOverTime2?.data &&
                clientsOverTime2?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Medtech"
            icon={<RegisteredIcon />}
            percent={
              clientsOverTime3?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              clientsOverTime3?.data
                ? clientsOverTime3?.data[clientsOverTime3.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                clientsOverTime3?.data &&
                clientsOverTime3.data.map((element: any) => element.value),
              labels:
                clientsOverTime3?.data &&
                clientsOverTime3?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Hospitals"
            icon={<HospitalIcon />}
            percent={
              clientsOverTime4?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              clientsOverTime4?.data
                ? clientsOverTime4?.data[clientsOverTime4.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                clientsOverTime4?.data &&
                clientsOverTime4.data.map((element: any) => element.value),
              labels:
                clientsOverTime4?.data &&
                clientsOverTime4?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
      </ClientsPageCharts>
      <CardWithText
        title="Clients"
        actions={[
          <Button
            color={filterOpen ? 'secondary' : 'default'}
            variant="contained"
            onClick={toggleFilter}
            startIcon={<SlidersHorizontalIcon width="18" height="18" />}
          >
            Filters
          </Button>,
          <Button color="default" variant="contained" onClick={openEModal}>
            Export
          </Button>,
        ]}
      >
        <Stack>
          <Collapse in={filterOpen}>
            <ClientsPageFilter>
              <Grid columns={4}>
                <Input
                  type="text"
                  label="Search"
                  placeholder="Please Enter"
                  value={filter.search}
                  onValue={(search) => setFilter({ ...filter, search })}
                />
                <Input
                  type="multiselect"
                  label="Industry"
                  placeholder="Please Select"
                  value={filter.industry}
                  onValue={(industry) => setFilter({ ...filter, industry })}
                  options={industries}
                  onSearch={debouncedIndustries}
                />
                <Input
                  type="multiselect"
                  label="Company"
                  placeholder="Please Select"
                  value={filter.company}
                  onValue={(company) => setFilter({ ...filter, company })}
                  options={companies}
                  onSearch={debouncedCompanies}
                />
                <Input
                  type="multiselect"
                  label="Role"
                  placeholder="Please Select"
                  value={filter.role}
                  onValue={(role) => setFilter({ ...filter, role })}
                  options={titles}
                  onSearch={debouncedTitles}
                />
                <Input
                  type="multiselect"
                  label="Product"
                  placeholder="Please Select"
                  value={filter.product}
                  onValue={(product) => setFilter({ ...filter, product })}
                  options={products}
                  onSearch={debouncedProducts}
                />
                <Input
                  type="multiselect"
                  label="Ambassador"
                  placeholder="Please Select"
                  value={filter.ambassador}
                  onValue={(ambassador) => setFilter({ ...filter, ambassador })}
                  options={ambassadors}
                  onSearch={debouncedAmbassadors}
                />
                <Input
                  type="multiselect"
                  label="Disease Area"
                  placeholder="Please Select"
                  value={filter.diseaseArea}
                  onValue={(diseaseArea) =>
                    setFilter({ ...filter, diseaseArea })
                  }
                  options={diseaseAreas}
                  onSearch={debouncedDiseaseAreas}
                />
                <Input
                  type="multiselect"
                  label="Location"
                  placeholder="Please Select"
                  value={filter.location}
                  onValue={(location) => setFilter({ ...filter, location })}
                  options={locations}
                  onSearch={debouncedLocations}
                />
                <Input
                  type="multiselect"
                  label="Market"
                  placeholder="Please Select"
                  value={filter.market}
                  onValue={(market) => setFilter({ ...filter, market })}
                  options={markets}
                  onSearch={debouncedMarkets}
                />
                <Input
                  type="select"
                  label="Project Status"
                  placeholder="Please Select"
                  value={filter.projectStatus}
                  onValue={(projectStatus) =>
                    setFilter({ ...filter, projectStatus })
                  }
                  options={[
                    {
                      value: 0,
                      label: 'In Preparation',
                    },
                    {
                      value: 1,
                      label: 'Ongoing',
                    },
                    {
                      value: 2,
                      label: 'Finished',
                    },
                  ]}
                />
                <InputGroup
                  label="Date Joined"
                  inputRatio="1fr 1fr"
                  elements={[
                    {
                      value: filter.joinedFrom,
                      onValue: (joinedFrom) =>
                        setFilter({ ...filter, joinedFrom }),
                      type: 'date',
                      placeholder: 'From',
                    },
                    {
                      value: filter.joinedTo,
                      onValue: (joinedTo) => setFilter({ ...filter, joinedTo }),
                      type: 'date',
                      placeholder: 'To',
                    },
                  ]}
                />
                <Input
                  type="select"
                  label="Project"
                  placeholder="Please Select"
                  value={filter.project}
                  onValue={(project) => setFilter({ ...filter, project })}
                  options={[
                    {
                      value: 1,
                      label: 'Campaign',
                    },
                    {
                      value: 2,
                      label: 'Survey',
                    },
                  ]}
                />
                <Input
                  type="min-max"
                  label="Total Project"
                  value={filter.totalProject}
                  onValue={(totalProject) =>
                    setFilter({ ...filter, totalProject })
                  }
                />
                <Input
                  type="min-max"
                  label="Project Last 30 Days"
                  value={filter.projectLast30Days}
                  onValue={(projectLast30Days) =>
                    setFilter({ ...filter, projectLast30Days })
                  }
                />
                <Input
                  type="min-max"
                  label="Budget"
                  placeholder="Please Select"
                  value={filter.budget}
                  onValue={(budget) => {
                    setFilter({ ...filter, budget });
                  }}
                />
              </Grid>
              <ClientsPageFilterActions direction="horizontal">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    handleReloadClient();
                  }}
                >
                  Filter
                </Button>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={clearFilters}
                >
                  Clear filter
                </Button>
              </ClientsPageFilterActions>
            </ClientsPageFilter>
          </Collapse>
          <>
            <NewCheckboxTable
              head={DClientsHead}
              items={clients}
              renderItem={renderItem}
              checkedRows={checkedClients}
              onSingleSelect={toggleClient}
              onSelectAll={toggleAllCheckedClients}
              tableColModal={tRegModal}
              closeTableColModal={closeTRegModal}
              renderElements={
                <>
                  <ISpan onClick={handleMenu} ref={buttonRegRef}>
                    <VerticalDotsIcon />
                  </ISpan>
                  {open && (
                    <CustomActionsMenu
                      position={position}
                      items={bulkActions}
                      ref={menu}
                    />
                  )}
                </>
              }
            />
            <Pagination
              style={{ justifyContent: 'right' }}
              onChange={(_e, x) => handlePageChange(x)}
              page={page}
              count={pagesCount}
            />
          </>
          {/* {open && <Menu items={bulkActions} ref={menu} />} */}
        </Stack>
      </CardWithText>
      {eModal && (
        <ExportClientsModal
          onClose={closeEModal}
          checkedClients={checkedClients}
        />
      )}
      {removeBulkClientsModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkClientsModal()}
          handleAction={handleBulkClientsRemoval}
        />
      )}
      {ciModal && <ContactClientsModal onClose={closeCiModal} />}
      {siModal && <ScheduleClientsModal onClose={closeSiModal} />}
      {nsModal && <NotificationsSettingsModal onClose={closeNsModal} />}
      {ipModal && currentClient && (
        <ClientsProfile
          clientUserId={currentClientId}
          clientData={currentClient}
          onClose={closeIpModal}
          reload={reload}
        />
      )}
      {niModal && <NoteClients onClose={closeNiModal} />}
    </ClientsPageMain>
  );
};

export default ClientsPage;
