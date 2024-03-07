/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import {
  DiscoverClientsPageMain,
  DiscoverClientsPageCharts,
  DiscoverClientsPageFilter,
  DiscoverClientsPageFilterActions,
} from 'features/discover-clients/styles';
import {
  CardWithChart,
  CardWithText,
  Menu,
  CheckboxTable,
  Tabs,
  NewCheckboxTable,
} from 'components/custom';
import {
  ClientContactedIcon,
  ClientIdentifiedIcon,
  ClientRegisteredIcon,
  ClientScheduledIcon,
  ContactIcon,
  DailyIcon,
  DeleteIcon,
  EditIcon,
  MonthlyIcon,
  ScheduleIcon,
  SlidersHorizontalIcon,
  UserIcon,
  VerticalDotsIcon,
  WeeklyIcon,
  YearlyIcon,
} from 'components/svg';
import { faker } from '@faker-js/faker';
import { Button, Input, InputGroup, Pagination } from 'components/ui';
import { Grid, Stack } from 'components/system';
import { Collapse, Tooltip } from '@mui/material';
import {
  DClientsHeadContacted,
  DClientsHeadIdentified,
  DClientsHeadRegistered,
  DClientsHeadScheduled,
  // DGenerateDiscoverClientsFilter,
} from 'features/discover-clients/data';
import {
  AddClientsModal,
  ContactClientsModal,
  DeleteClientsModal,
  ExportClientsModal,
  ClientsProfile,
  NoteClients,
  NotificationsSettingsModal,
  ScheduleClientsModal,
} from 'features/discover-clients/role/admin/elements';
import {
  useDebounce,
  useMenu,
  useModal,
  usePagination,
  useSnackbar,
} from 'hooks';
import { TTableRenderItemObject } from 'components/custom/table/types';
import {
  AmbassadorAPI,
  ClientAPI,
  CompanyAPI,
  DiseaseAreaAPI,
  EnumsApi,
  IndustryApi,
  LocationAPI,
  ProductApi,
} from 'api';
import { IDiscoverClient } from 'api/client/types';
import UsersAPI from 'api/users';
import { BackupTableRounded } from '@mui/icons-material';
import { formatLongString } from 'utilities/string-converter';
import {
  getDiseasesAsCommaSeparatedString,
  getMarketsAsCommaSeparatedString,
} from 'features/discover-influencers/role/admin/helpers';
import { fetchAndCacheData } from 'utilities/local-storage';
import {
  ISpan,
  ToBeApprovedActionsMenu as CustomActionsMenu,
  DiscoverClientProfileAction,
  TableTooltip,
  CardWrapper,
} from './styles';
import DiscoverActions from './elements/discover-actions';
import PromptModal from './elements/prompt-modal';

interface ISelectedField {
  label: string;
  value: string;
}
interface IFilterProps {
  search?: string;
  role: ISelectedField[];
  market: ISelectedField[];
  industry: ISelectedField[];
  product: ISelectedField[];
  ambassador: ISelectedField[];
  company: ISelectedField[];
  diseaseArea: ISelectedField[];
  location: ISelectedField | null;
  joinedFrom: Date | null;
  joinedTo: Date | null;
}

const DiscoverClientsPage = () => {
  const initialFilters: IFilterProps = {
    search: '',
    role: [],
    market: [],
    industry: [],
    product: [],
    ambassador: [],
    company: [],
    diseaseArea: [],
    location: null,
    joinedFrom: null,
    joinedTo: null,
  };
  const [filter, setFilter] = useState<IFilterProps>(initialFilters);

  const [filterOpen, setFilterOpen] = useState(false);

  const [filterCleared, setFilterCleared] = useState(false);

  const [tabs, setTabs] = useState(0);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const [aiModal, openAiModal, closeAiModal] = useModal(false);
  const [eModal, openEModal, closeEModal] = useModal(false);
  const [ciModal, openCiModal, closeCiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [nsModal, openNsModal, closeNsModal] = useModal(false);
  const [ipModal, openIpModal, closeIpModal] = useModal(false);
  const [sipModal, openSIpModal, closeSIpModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);

  const renderItem = ({
    headItem,
    cell,
    row,
    table,
  }: TTableRenderItemObject) => {};

  const [clientsRegistered, setClientsRegistered] = useState<IDiscoverClient[]>(
    []
  );
  const [clientsScheduled, setClientsScheduled] = useState<IDiscoverClient[]>(
    []
  );
  // const [clientsIdentified, setClientsIdentified] = useState<any>([]);
  // const [clientsContacted, setClientsContacted] = useState<any>([]);
  const [clientsRegisteredDaily, setClientsRegisteredDaily] = useState<any>([]);
  const [clientsRegisteredWeekly, setClientsRegisteredWeekly] = useState<any>(
    []
  );
  const [clientsRegisteredMonthly, setClientsRegisteredMonthly] = useState<any>(
    []
  );
  const [clientsRegisteredYearly, setClientsRegisteredYearly] = useState<any>(
    []
  );

  const [filterRParams, setFilterRParams] = useState({});
  const [filterSParams, setFilterSParams] = useState({});

  // Collects ids that represent user ids not clients id's
  const [checkedRegClients, setCheckedRegClients] = useState<number[]>([]);
  const [checkedSchedClients, setCheckedSchedClients] = useState<number[]>([]);

  // Current Entities

  const [currentClient, setCurrentClient] = useState<any>();
  const [currentSchedClient, setCurrentSchedClient] = useState<any>();

  const { push } = useSnackbar();

  const getCurrentClient = (value: any) => {
    setCurrentClient(value);
  };

  const getCurrentSchedClient = (value: any) => {
    setCurrentSchedClient(value);
  };

  // This was commented out before, keep for future possibilities
  // const {
  //   pagesCount: pageCountI,
  //   page: pageI,
  //   setTotalResults: setTotalResultsI,
  //   handlePageChange: handlePageChangeI,
  //   reload: reloadI,
  // } = usePagination({
  //   limit: 10,
  //   page: 1,
  //   onChange: async (params, setPage) => {
  //     const { data, pagination } = await ClientAPI.getDClientsIdentified({
  //       limit: params.limit,
  //       skip: params.skip,
  //       ...filterIParams,
  //     });

  //     setPage(params.page);

  //     setClientsIdentified(data);
  //     setTotalResultsI(pagination.totalFilteredItems);
  //   },
  // });

  // const {
  //   pagesCount: pageCountC,
  //   page: pageC,
  //   setTotalResults: setTotalResultsC,
  //   handlePageChange: handlePageChangeC,
  //   reload: reloadC,
  // } = usePagination({
  //   limit: 10,
  //   page: 1,
  //   onChange: async (params, setPage) => {
  //     const { data, pagination } = await ClientAPI.getDClientsContacted({
  //       limit: params.limit,
  //       skip: params.skip,
  //       ...filterCParams,
  //     });

  //     setPage(params.page);

  //     setClientsContacted(data);
  //     setTotalResultsC(pagination.totalFilteredItems);
  //   },
  // });

  const getAllRegisteredClients = async (queryParams: any): Promise<any> => {
    try {
      const response = await ClientAPI.getClientsOverTimeData({
        ...filterRParams,
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
      const previousIncome = i !== 0 ? data[i - 1].value : data[0].value;
      const currentIncome = data[i].value;
      const currentTimestamp = data[i].timestamp;
      const dailyGrowth = currentIncome - previousIncome;
      // data[i].value = dailyGrowth;
      newData.push({ timestamp: currentTimestamp, value: dailyGrowth });
    }

    return newData;
  };

  const getDiscoverClientGraphDataAsync =
    (
      graphPeriod: string,
      setDataFunction: (data: any) => void,
      key: string,
      reformatToAbsoluteGraphData: boolean = false,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getAllRegisteredClients({
            useStrictPeriod: true,
            graphPeriod,
            graphType: 'cumulative',
            roundDateToDay: true,
            includeOngoingPeriod: true,
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
    getDiscoverClientGraphDataAsync(
      'daily',
      setClientsRegisteredDaily,
      'setClientsRegisteredDaily',
      true
    )();
    getDiscoverClientGraphDataAsync(
      'weekly',
      setClientsRegisteredWeekly,
      'setClientsRegisteredWeekly',
      true
    )();
    getDiscoverClientGraphDataAsync(
      'monthly',
      setClientsRegisteredMonthly,
      'setClientsRegisteredMonthly',
      true
    )();
    getDiscoverClientGraphDataAsync(
      'yearly',
      setClientsRegisteredYearly,
      'setClientsRegisteredYearly',
      true
    )();
  }, []);

  const getStateValueAsNumArray = (stateValue: ISelectedField[]): number[] =>
    stateValue && stateValue.length
      ? stateValue.map((item) => +item.value)
      : [];

  const {
    pagesCount: pageCountR,
    page: pageR,
    setTotalResults: setTotalResultsR,
    handlePageChange: handlePageChangeR,
    reload: reloadR,
  } = usePagination({
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
        locationIds: filter.location ? [filter.location.value] : undefined,
        joinedFrom: filter.joinedFrom || undefined,
        joinedTo: filter.joinedTo || undefined,
      };

      const { data, pagination } = await ClientAPI.getDClientsRegistered({
        limit: params.limit,
        skip: params.skip,
        ...formattedFilterParams,
      });

      setPage(params.page);

      setClientsRegistered(data);
      setTotalResultsR(pagination.totalFilteredItems);
    },
  });

  const {
    pagesCount: pageCountS,
    page: pageS,
    setTotalResults: setTotalResultsS,
    handlePageChange: handlePageChangeS,
    reload: reloadS,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const { data, pagination } = await ClientAPI.getDClientsScheduled({
        limit: params.limit,
        skip: params.skip,
        ...filterSParams,
      });

      setPage(params.page);

      setClientsScheduled(data);
      setTotalResultsS(pagination.totalFilteredItems);
    },
  });

  const toggleRegClient = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedRegClients([...checkedRegClients, rowId]);
    } else {
      setCheckedRegClients(checkedRegClients.filter((id) => id !== rowId));
    }
  };

  const toggleAllCheckedRegClients = (checked: boolean) => {
    if (checked) {
      const currentPageIds = clientsRegistered.map((row) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedRegClients, ...currentPageIds])
      );
      setCheckedRegClients(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = clientsRegistered.map((row) => row.id);
      const newSelectedRows = checkedRegClients.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedRegClients(newSelectedRows);
    }
  };

  const toggleSchedClient = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedSchedClients([...checkedSchedClients, rowId]);
    } else {
      setCheckedSchedClients(checkedSchedClients.filter((id) => id !== rowId));
    }
  };

  const toggleAllCheckedSchedClients = (checked: boolean) => {
    if (checked) {
      const currentPageIds = clientsScheduled.map((row) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedSchedClients, ...currentPageIds])
      );
      setCheckedSchedClients(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = clientsScheduled.map((row) => row.id);
      const newSelectedRows = checkedSchedClients.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedSchedClients(newSelectedRows);
    }
  };

  // const renderIdentifiedItem = ({ headItem, row }: TTableRenderItemObject) => {
  //   if (headItem.reference === 'firstName') {
  //     return row.data.firstName;
  //   }
  //   if (headItem.reference === 'lastName') {
  //     return row.data.lastName;
  //   }
  //   if (headItem.reference === 'company') {
  //     return row.data.company.name;
  //   }
  //   if (headItem.reference === 'product') {
  //     return '';
  //   }
  //   if (headItem.reference === 'actions') {
  //     return '';
  //   }

  //   return '';
  // };

  // const renderContactedItem = ({ headItem, row }: TTableRenderItemObject) => {
  //   if (headItem.reference === 'firstName') {
  //     return row.data.firstName;
  //   }
  //   if (headItem.reference === 'lastName') {
  //     return row.data.lastName;
  //   }
  //   if (headItem.reference === 'company') {
  //     return row.data.company.name;
  //   }
  //   if (headItem.reference === 'product') {
  //     return '';
  //   }
  //   if (headItem.reference === 'contactedAt') {
  //     return row.data.contactedAt;
  //   }
  //   if (headItem.reference === 'actions') {
  //     return '';
  //   }
  //   return '';
  // };

  // Table New Checkbox Modal controlls
  const [tRegModal, openTRegModal, closeTRegModal] = useModal(false);
  const [tSchedModal, openTSchedModal, closeTSchedModal] = useModal(false);

  // Table Menu List Modal
  const [menu, open, setOpen, buttonRegRef, position] = useMenu(false);
  const [schedMenu, openSched, setSchedOpen, buttonSchedRef, schedPosition] =
    useMenu(false);

  // Menu Handler
  const handleMenu = () => {
    setOpen(!open);
  };

  const handleSchedMenu = () => {
    setSchedOpen(!openSched);
  };

  const handleReloadTables = async () => {
    reloadR();
    reloadS();
  };

  // Modal calls for bulk actions
  const [
    removeBulkRegClientsModal,
    openRemoveBulkRegClientsModal,
    closeRemoveBulkRegClientsModal,
  ] = useModal(false);

  const [
    removeBulkSchedClientsModal,
    openRemoveBulkSchedClientsModal,
    closeRemoveBulkSchedClientsModal,
  ] = useModal(false);

  const registeredBulkActions: any[] = [
    // {
    //   icon: <ContactIcon />,
    //   label: 'Contact',
    //   action: () => {
    //     handleMenu();
    //   },
    // },
    // {
    //   icon: <EditIcon />,
    //   label: 'Note',
    //   action: () => {
    //     handleMenu();
    //   },
    // },
    // {
    //   icon: <ScheduleIcon />,
    //   label: 'Schedule',
    //   action: () => {
    //     handleMenu();
    //   },
    // },
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
        openRemoveBulkRegClientsModal();
        handleMenu();
      },
    },
  ];

  const scheduledBulkActions: any[] = [
    // {
    //   icon: <ContactIcon />,
    //   label: 'Contact',
    //   action: () => {
    //     handleSchedMenu();
    //   },
    // },
    // {
    //   icon: <EditIcon />,
    //   label: 'Note',
    //   action: () => {
    //     handleSchedMenu();
    //   },
    // },
    // {
    //   icon: <ScheduleIcon />,
    //   label: 'Schedule',
    //   action: () => {
    //     handleSchedMenu();
    //   },
    // },
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openTSchedModal();
        handleSchedMenu();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        openRemoveBulkSchedClientsModal();
        handleSchedMenu();
      },
    },
  ];

  // Removal

  const handleBulkRegClientsRemoval = async () => {
    try {
      await UsersAPI.deleteManyUsers({
        userIds: checkedRegClients,
      });
      reloadR();
      setCheckedRegClients([]);

      push('Influencers successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleBulkSchedClientsRemoval = async () => {
    try {
      await UsersAPI.deleteManyUsers({
        userIds: checkedSchedClients,
      });
      reloadS();
      setCheckedSchedClients([]);

      push('Influencers successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const renderRegisteredItem = ({ headItem, row }: TTableRenderItemObject) => {
    if (headItem.reference === 'firstName') {
      return (
        <DiscoverClientProfileAction
          onClick={() => {
            getCurrentClient(row.data._client.user.id);
            openIpModal();
          }}
        >
          {row.data.firstName}
        </DiscoverClientProfileAction>
      );
    }
    if (headItem.reference === 'lastName') {
      return row.data.lastName;
    }
    if (headItem.reference === 'company') {
      return row.data.company.name;
    }
    if (headItem.reference === 'role') {
      return row.data.companyTitle.name;
    }
    if (headItem.reference === 'email') {
      return row.data.email;
    }
    if (headItem.reference === 'location') {
      if (!row.data.location) {
        return '';
      }

      const { location } = row.data;
      const label = location.country
        ? `${location.name}, ${location.country.name}`
        : location.name;

      return label;
    }

    if (headItem.reference === 'industry') {
      if (!row.data.industry) {
        return '';
      }

      const { name } = row.data.industry;

      return name;
    }

    if (headItem.reference === 'diseaseAreas') {
      if (row.data._client.clientDiseaseAreas) {
        const formattedDiseases = getDiseasesAsCommaSeparatedString(
          row.data._client.clientDiseaseAreas
        );

        const formattedElipsisString = formatLongString(formattedDiseases, 50);
        return (
          <Tooltip title={<TableTooltip>{formattedDiseases}</TableTooltip>}>
            <span>{formattedElipsisString}</span>
          </Tooltip>
        );
      }
    }
    if (headItem.reference === 'status') {
      switch (row.data.status) {
        case 0:
          return 'Identified';
        case 1:
          return 'Contacted';
        case 2:
          return 'Unconfirmed';
        case 3:
          return 'Confirmed';
        case 4:
          return 'To Be Approved';
        case 5:
          return 'Approved';
        case 6:
          return 'Do Not Contact';
        case 7:
          return 'Scheduled';
        default:
          return '';
      }
    }

    if (headItem.reference === 'ambassador') {
      if (row.data._client.ambassador) {
        return `${row.data._client.ambassador.user.firstName} ${row.data._client.ambassador.user.lastName}`;
      }
    }
    if (headItem.reference === 'market') {
      if (
        row.data._client.clientMarkets &&
        row.data._client.clientMarkets.length
      ) {
        const { clientMarkets } = row.data._client;
        const clientMarketsString =
          getMarketsAsCommaSeparatedString(clientMarkets);
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
    if (headItem.reference === 'registeredAt') {
      return row.data.createdAt.slice(0, 10);
    }

    if (headItem.reference === 'updatedAt') {
      return row.data._client.updatedAt.slice(0, 10);
    }
    if (headItem.reference === 'actions') {
      return (
        <DiscoverActions data={row.data._client.user.id} reload={reloadR} />
      );
    }
    return '';
  };

  const renderScheduledItem = ({ headItem, row }: TTableRenderItemObject) => {
    if (headItem.reference === 'firstName') {
      return (
        <DiscoverClientProfileAction
          onClick={() => {
            getCurrentSchedClient(row.data._client.user.id);
            openSIpModal();
          }}
        >
          {row.data.firstName}
        </DiscoverClientProfileAction>
      );
    }
    if (headItem.reference === 'lastName') {
      return row.data.lastName;
    }
    if (headItem.reference === 'company') {
      return row.data.company.name;
    }
    if (headItem.reference === 'role') {
      return row.data.companyTitle.name;
    }
    if (headItem.reference === 'email') {
      return row.data.email;
    }
    if (headItem.reference === 'location') {
      if (!row.data.location) {
        return '';
      }

      const { location } = row.data;
      const label = location.country
        ? `${location.name}, ${location.country.name}`
        : location.name;

      return label;
    }

    if (headItem.reference === 'industry') {
      if (!row.data.industry) {
        return '';
      }

      const { name } = row.data.industry;

      return name;
    }

    if (headItem.reference === 'diseaseAreas') {
      if (row.data._client.clientDiseaseAreas) {
        const formattedDiseases = getDiseasesAsCommaSeparatedString(
          row.data._client.clientDiseaseAreas
        );

        const formattedElipsisString = formatLongString(formattedDiseases, 50);
        return (
          <Tooltip title={<TableTooltip>{formattedDiseases}</TableTooltip>}>
            <span>{formattedElipsisString}</span>
          </Tooltip>
        );
      }
    }
    if (headItem.reference === 'status') {
      switch (row.data.status) {
        case 0:
          return 'Identified';
        case 1:
          return 'Contacted';
        case 2:
          return 'Unconfirmed';
        case 3:
          return 'Confirmed';
        case 4:
          return 'To Be Approved';
        case 5:
          return 'Approved';
        case 6:
          return 'Do Not Contact';
        case 7:
          return 'Scheduled';
        default:
          return '';
      }
    }

    if (headItem.reference === 'ambassador') {
      if (row.data._client.ambassador) {
        return `${row.data._client.ambassador.user.firstName} ${row.data._client.ambassador.user.lastName}`;
      }
    }
    if (headItem.reference === 'market') {
      if (
        row.data._client.clientMarkets &&
        row.data._client.clientMarkets.length
      ) {
        const { clientMarkets } = row.data._client;
        const clientMarketsString =
          getMarketsAsCommaSeparatedString(clientMarkets);
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
    if (headItem.reference === 'registeredAt') {
      return row.data.createdAt.slice(0, 10);
    }
    if (headItem.reference === 'updatedAt') {
      return row.data._client.updatedAt.slice(0, 10);
    }
    if (headItem.reference === 'actions') {
      return (
        <DiscoverActions data={row.data._client.user.id} reload={reloadS} />
      );
    }
    return '';
  };

  const getPercentage = (last: number, preLast: number) => {
    if (last === 0 && preLast === 0) {
      const preLastIsZero = last * 100;
      return Number(preLastIsZero).toFixed(2);
    }

    if (last !== 0 && preLast === 0) {
      const preLastIsZero = 100;
      return Number(preLastIsZero).toFixed(2);
    }
    const difference = last - preLast;

    const growthRate = (difference / preLast) * 100;

    return Number(growthRate.toFixed(2));
  };

  const clearFilters = () => {
    setFilter(initialFilters);
    setFilterCleared(true);
  };

  useEffect(() => {
    if (filterCleared) {
      handleReloadTables();
      setFilterCleared(false);
      handlePageChangeR(1);
      handlePageChangeS(1);
    }
  }, [filter, filterCleared]);

  return (
    <DiscoverClientsPageMain>
      <DiscoverClientsPageCharts>
        <CardWrapper>
          <CardWithChart
            title="Daily"
            icon={<DailyIcon />}
            percent={
              clientsRegisteredDaily.data &&
              getPercentage(
                clientsRegisteredDaily?.data[
                  clientsRegisteredDaily.data.length - 1
                ].value,
                clientsRegisteredDaily?.data[
                  clientsRegisteredDaily.data.length - 2
                ].value
              )
            }
            count={
              clientsRegisteredDaily?.data
                ? clientsRegisteredDaily?.data[
                    clientsRegisteredDaily.data.length - 1
                  ].value
                : 0
            }
            chartData={{
              values:
                clientsRegisteredDaily?.data &&
                clientsRegisteredDaily.data.map(
                  (element: any) => element.value
                ),
              labels:
                clientsRegisteredDaily?.data &&
                clientsRegisteredDaily?.data.map(
                  (element: any) => element.value
                ),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Weekly"
            icon={<WeeklyIcon />}
            percent={
              clientsRegisteredWeekly.data &&
              getPercentage(
                clientsRegisteredWeekly?.data[
                  clientsRegisteredWeekly.data.length - 1
                ].value,
                clientsRegisteredWeekly?.data[
                  clientsRegisteredWeekly.data.length - 2
                ].value
              )
            }
            count={
              clientsRegisteredWeekly?.data
                ? clientsRegisteredWeekly?.data[
                    clientsRegisteredWeekly.data.length - 1
                  ].value
                : 0
            }
            chartData={{
              values:
                clientsRegisteredWeekly?.data &&
                clientsRegisteredWeekly.data.map(
                  (element: any) => element.value
                ),
              labels:
                clientsRegisteredWeekly?.data &&
                clientsRegisteredWeekly?.data.map(
                  (element: any) => element.value
                ),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Monthly"
            icon={<MonthlyIcon />}
            percent={
              clientsRegisteredMonthly.data &&
              getPercentage(
                clientsRegisteredMonthly?.data[
                  clientsRegisteredMonthly.data.length - 1
                ].value,
                clientsRegisteredMonthly?.data[
                  clientsRegisteredMonthly.data.length - 2
                ].value
              )
            }
            count={
              clientsRegisteredMonthly?.data
                ? clientsRegisteredMonthly?.data[
                    clientsRegisteredMonthly.data.length - 1
                  ].value
                : 0
            }
            chartData={{
              values:
                clientsRegisteredMonthly?.data &&
                clientsRegisteredMonthly.data.map(
                  (element: any) => element.value
                ),
              labels:
                clientsRegisteredMonthly?.data &&
                clientsRegisteredMonthly?.data.map(
                  (element: any) => element.value
                ),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Yearly"
            icon={<YearlyIcon />}
            percent={
              clientsRegisteredYearly.data &&
              getPercentage(
                clientsRegisteredYearly?.data[
                  clientsRegisteredYearly.data.length - 1
                ].value,
                clientsRegisteredYearly?.data[
                  clientsRegisteredYearly.data.length - 2
                ].value
              )
            }
            count={
              clientsRegisteredYearly?.data
                ? clientsRegisteredYearly?.data[
                    clientsRegisteredYearly.data.length - 1
                  ].value
                : 0
            }
            chartData={{
              values:
                clientsRegisteredYearly?.data &&
                clientsRegisteredYearly.data.map(
                  (element: any) => element.value
                ),
              labels:
                clientsRegisteredYearly?.data &&
                clientsRegisteredYearly?.data.map(
                  (element: any) => element.value
                ),
            }}
          />
        </CardWrapper>
      </DiscoverClientsPageCharts>
      <CardWithText
        title="Discovered Clients"
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
            <DiscoverClientsPageFilter>
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
                  type="select"
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
                <InputGroup
                  label="Joined"
                  inputRatio="1fr 1fr"
                  elements={[
                    {
                      type: 'date',
                      placeholder: 'From',
                      value: filter.joinedFrom,
                      onValue: (joinedFrom) =>
                        setFilter({ ...filter, joinedFrom }),
                    },
                    {
                      type: 'date',
                      placeholder: 'To',
                      value: filter.joinedTo,
                      onValue: (joinedTo) => setFilter({ ...filter, joinedTo }),
                    },
                  ]}
                />
              </Grid>
              <DiscoverClientsPageFilterActions direction="horizontal">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    handleReloadTables();
                    handlePageChangeR(1);
                    handlePageChangeS(1);
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
              </DiscoverClientsPageFilterActions>
            </DiscoverClientsPageFilter>
          </Collapse>
          <Tabs
            value={tabs}
            onValue={setTabs}
            tabs={['Registered', 'Scheduled']}
          />
          {/* {tabs === 0 && (
            <>
              <CheckboxTable
                head={DClientsHeadIdentified}
                items={clientsIdentified}
                renderItem={renderIdentifiedItem}
              />
              <Pagination
                onChange={(_e, x) => handlePageChangeI(x)}
                page={pageI}
                count={pageCountI}
              />
            </>
          )}
          {tabs === 1 && (
            <>
              <CheckboxTable
                head={DClientsHeadContacted}
                items={clientsContacted}
                renderItem={renderContactedItem}
              />
              <Pagination
                onChange={(_e, x) => handlePageChangeC(x)}
                page={pageC}
                count={pageCountC}
              />
            </>
          )} */}
          {tabs === 0 && (
            <>
              <NewCheckboxTable
                head={DClientsHeadRegistered}
                items={clientsRegistered}
                renderItem={renderRegisteredItem}
                checkedRows={checkedRegClients}
                onSingleSelect={toggleRegClient}
                onSelectAll={toggleAllCheckedRegClients}
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
                        items={registeredBulkActions}
                        ref={menu}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handlePageChangeR(x)}
                page={pageR}
                count={pageCountR}
              />
            </>
          )}
          {tabs === 1 && (
            <>
              <NewCheckboxTable
                head={DClientsHeadScheduled}
                items={clientsScheduled}
                renderItem={renderScheduledItem}
                checkedRows={checkedSchedClients}
                onSingleSelect={toggleSchedClient}
                onSelectAll={toggleAllCheckedSchedClients}
                tableColModal={tSchedModal}
                closeTableColModal={closeTSchedModal}
                renderElements={
                  <>
                    <ISpan onClick={handleSchedMenu} ref={buttonSchedRef}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openSched && (
                      <CustomActionsMenu
                        position={schedPosition}
                        items={scheduledBulkActions}
                        ref={schedMenu}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handlePageChangeS(x)}
                page={pageS}
                count={pageCountS}
              />
            </>
          )}
        </Stack>
      </CardWithText>
      {aiModal && <AddClientsModal onClose={closeAiModal} />}
      {eModal && (
        <ExportClientsModal
          onClose={closeEModal}
          checkedRegClients={checkedRegClients}
          checkedSchedClients={checkedSchedClients}
        />
      )}
      {ciModal && <ContactClientsModal onClose={closeCiModal} />}
      {siModal && <ScheduleClientsModal onClose={closeSiModal} />}
      {niModal && <NoteClients onClose={closeNiModal} />}
      {nsModal && <NotificationsSettingsModal onClose={closeNsModal} />}
      {ipModal && (
        <ClientsProfile
          clientUserId={currentClient}
          onClose={closeIpModal}
          reload={handleReloadTables}
        />
      )}
      {sipModal && (
        <ClientsProfile
          clientUserId={currentSchedClient}
          onClose={closeSIpModal}
          reload={handleReloadTables}
        />
      )}
      {removeBulkRegClientsModal && (
        <PromptModal
          plural
          onClose={() => {
            closeRemoveBulkRegClientsModal();
          }}
          handleAction={handleBulkRegClientsRemoval}
        />
      )}
      {removeBulkSchedClientsModal && (
        <PromptModal
          plural
          onClose={() => {
            closeRemoveBulkSchedClientsModal();
          }}
          handleAction={handleBulkSchedClientsRemoval}
        />
      )}
    </DiscoverClientsPageMain>
  );
};

export default DiscoverClientsPage;
