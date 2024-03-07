import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  FinancePageMain,
  FinancePageCharts,
  FinancePageFilter,
  FinancePageFilterActions,
} from 'features/finance/styles';
import {
  DFinanceHead,
  DFinanceHead2,
  DFinanceHead3,
  DFinanceHeadC1,
  DGenerateFinanceAdminFilter,
  IAdminFinanceFilterData,
} from 'features/finance/data';
import {
  CardWithChart,
  CardWithText,
  Menu,
  Tabs,
  NewCheckboxTable,
} from 'components/custom';
import {
  ApproveIcon,
  ContactIcon,
  CostIcon,
  DeclineIcon,
  DeleteIcon,
  EditIcon,
  FinanceSmallIcon,
  MarginIcon,
  ProfitIcon,
  ReceivedIcon,
  RevenueIcon,
  ScheduleIcon,
  SlidersHorizontalIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { Button, Input, InputGroup, Pagination } from 'components/ui';
import { Grid, Stack, Collapse } from 'components/system';
import { TTableRenderItemObject } from 'components/custom/table/types';
import {
  useDebounce,
  useMenu,
  useModal,
  usePagination,
  useSnackbar,
} from 'hooks';
import {
  CreateFinanceModal,
  ExportFinanceModal,
  ApproveFinanceModal,
  CostInfoModal,
  RevenueInfoModal,
} from 'features/finance/role/admin/elements';
import { PlatformProductOrderAPI } from 'api/platform-product-order';
import { ISpan } from 'features/campaigns/role/admin/styles';
import { ActionsMenu } from 'features/clients/role/admin/styles';
import FinanceAPI from 'api/finance';
import moment from 'moment';
import {
  AmbassadorAPI,
  CampaignAPI,
  ClientAPI,
  CompanyAPI,
  InfluencerAPI,
  SurveyAPI,
} from 'api';
import { getStateValueAsNumArray } from 'utilities/converters';
import PendingActions from './elements/pending-actions';
import PromptModal from './elements/prompt-modal';
import PaymentActions from './elements/payment-actions';
import WithdrawActions from './elements/withdraw-actions';
import { CardWrapper } from './styles';

const FinancePage = () => {
  const [cfModal, openCfModal, closeCfModal] = useModal(false);
  const [efModal, openEfModal, closeEfModal] = useModal(false);
  const [afModal, openAfModal, closeAfModal] = useModal(false);
  const [riModal, openRiModal, closeRiModal] = useModal(false);
  const [ciModal, openCiModal, closeCiModal] = useModal(false);
  const [c1Modal, openC1Modal, closeC1Modal] = useModal(false);
  const [wModal, openWModal, closeWModal] = useModal(false);

  const [filter, setFilter] = useState<IAdminFinanceFilterData>(
    DGenerateFinanceAdminFilter()
  );

  const [pendingRevenues, setPendingRevenues] = useState<any[]>([]);
  const [receivedRevenues, setReceivedRevenues] = useState<any[]>([]);
  const [costs, setCosts] = useState<any[]>([]);
  const [withdraws, setWithdraws] = useState<any[]>([]);
  const [custom1, setCustom1] = useState<any[]>([]);

  const [checkePendingd, setCheckedRevenues] = useState<number[]>([]);
  const [checkedPayments, setCheckedPayments] = useState<number[]>([]);
  const [checkedWithdraws, setCheckedWithdraws] = useState<number[]>([]);
  const [checkedReceived, setCheckedReceived] = useState<number[]>([]);
  const [checkedCustom1, setCheckedCustom1] = useState<number[]>([]);

  const [filterOpen, setFilterOpen] = useState(false);

  const [tabs, setTabs] = useState(0);
  const [tab, setTab] = useState(0);
  const [filterTabs, setFilterTabs] = useState(0);

  const [tableModal, openTableModal, closeTableModal] = useModal(false);
  const [tableModal2, openTableModal2, closeTableModal2] = useModal(false);
  const [tableModal3, openTableModal3, closeTableModal3] = useModal(false);
  const [tableModal4, openTableModal4, closeTableModal4] = useModal(false);
  const [tableModal5, openTableModal5, closeTableModal5] = useModal(false);
  const [menu, open, setOpen, buttonRegRef, position] = useMenu(false);
  const [menu2, open2, setOpen2, buttonRegRef2, position2] = useMenu(false);
  const [menu3, open3, setOpen3, buttonRegRef3, position3] = useMenu(false);
  const [menu4, open4, setOpen4, buttonRegRef4, position4] = useMenu(false);

  const [filterParams, _setFilterParams] = useState({});

  const [financeOverTime1, setFinanceOverTimeData1] = useState<any>([]);
  const [financeOverTime2, setFinanceOverTimeData2] = useState<any>([]);
  const [financeOverTime3, setFinanceOverTimeData3] = useState<any>([]);
  const [financeOverTime4, setFinanceOverTimeData4] = useState<any>([]);

  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [clientOptions, setClientOptions] = useState<any[]>([]);
  const [influencerOptions, setInfluencerOptions] = useState<any[]>([]);
  const [ambassadorsOptions, setAmbassadorsOptions] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);

  const getCompanies = async (s: string = '') => {
    const { result } = await CompanyAPI.getAll(s);

    setCompanyOptions(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getClients = async (s: string = '') => {
    const { result } = await ClientAPI.getClients(s);

    setClientOptions(
      result.map((data: any) => ({
        value: data.id,
        label: `${data.firstName} ${data.lastName}`,
      }))
    );
  };

  const getInfluencers = async (s: string = '') => {
    const { result } = await InfluencerAPI.getInfluencersSearch(s, 'finance');

    setInfluencerOptions(
      result.map((data: any) => ({
        value: data.id,
        label: `${data.firstName} ${data.lastName}`,
      }))
    );
  };

  const getAmbassadors = async (s: string = '') => {
    const { result } = await AmbassadorAPI.getAmbassadorSearch(s);

    setAmbassadorsOptions(
      result.map((x: any) => ({
        value: x.id,
        label: `${x.firstName} ${x.lastName}`,
      }))
    );
  };

  const getCampaigns = async (s: string = '') => {
    const { result } = await CampaignAPI.getCampaigns({
      skip: 0,
      limit: 10,
      search: s.length ? s : undefined,
      status: [0, 1, 2],
    });

    setCampaigns(
      result.map((data: any) => ({
        value: data.id,
        label: `${data.name}`,
      }))
    );
  };

  const getSurveys = async (s: string = '') => {
    const { result } = await SurveyAPI.getSurveys({
      skip: 0,
      limit: 10,
      search: s.length ? s : undefined,
      status: [0, 1, 2],
    });

    setSurveys(
      result.map((data: any) => ({
        value: data.id,
        label: `${data.name}`,
      }))
    );
  };

  const debounceCompanies = useDebounce(getCompanies, 250);
  const debounceClients = useDebounce(getClients, 250);
  const debounceInfluencers = useDebounce(getInfluencers, 250);
  const debounceAmbassadors = useDebounce(getAmbassadors, 250);
  const debounceCampaigns = useDebounce(getCampaigns, 250);
  const debounceSurveys = useDebounce(getSurveys, 250);

  const getFinanceRevenueOverTimeData = async (
    queryParams: any
    // eslint-disable-next-line consistent-return
  ): Promise<any> => {
    try {
      const response = await FinanceAPI.getFinanceRevenueOverTimeData({
        ...filterParams,
        ...queryParams,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.error(error);
    }
  };

  const getFinanceCostOverTimeData = async (
    queryParams: any
    // eslint-disable-next-line consistent-return
  ): Promise<any> => {
    try {
      const response = await FinanceAPI.getFinanceCostOverTimeData({
        ...filterParams,
        ...queryParams,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.error(error);
    }
  };

  const getFinanceProfitOverTimeData = async (
    queryParams: any
    // eslint-disable-next-line consistent-return
  ): Promise<any> => {
    try {
      const response = await FinanceAPI.getFinanceProfitOverTimeData({
        ...filterParams,
        ...queryParams,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.error(error);
    }
  };

  const getFinanceMarginOverTimeData = async (
    queryParams: any
    // eslint-disable-next-line consistent-return
  ): Promise<any> => {
    try {
      const response = await FinanceAPI.getFinanceMarginOverTimeData({
        ...filterParams,
        ...queryParams,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFinanceRevenueOverTimeData({
      useStrictPeriod: false,
      numberOfPoints: 30,
      graphType: 'cumulative',
      includeData: ['changePercentageMonth'],
    })
      .then((data) => setFinanceOverTimeData1(data))
      .catch((error) => console.log('error', error));
    getFinanceCostOverTimeData({
      useStrictPeriod: false,
      numberOfPoints: 30,
      graphType: 'cumulative',
      includeData: ['changePercentageMonth'],
    })
      .then((data) => setFinanceOverTimeData2(data))
      .catch((error) => console.log('error', error));
    getFinanceProfitOverTimeData({
      useStrictPeriod: false,
      numberOfPoints: 30,
      graphType: 'cumulative',
      includeData: ['changePercentageMonth'],
    })
      .then((data) => setFinanceOverTimeData3(data))
      .catch((error) => console.log('error', error));
    getFinanceMarginOverTimeData({
      useStrictPeriod: false,
      numberOfPoints: 30,
      graphType: 'cumulative',
      includeData: ['changePercentageMonth'],
    })
      .then((data) => setFinanceOverTimeData4(data))
      .catch((error) => console.log('error', error));

    getCompanies();
    getClients();
    getInfluencers();
    getAmbassadors();
    getCampaigns();
    getSurveys();
  }, []);

  const [action, setAction] = useState<'approve' | 'remove' | 'decline'>(
    'approve'
  );
  const [plural, setPlural] = useState<boolean>(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const handleMenu2 = () => {
    setOpen2(!open2);
  };

  const handleMenu3 = () => {
    setOpen3(!open3);
  };

  const handleMenu4 = () => {
    setOpen4(!open4);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(DGenerateFinanceAdminFilter());
  };

  const toggleRevenue = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedRevenues([...checkePendingd, rowId]);
    } else {
      setCheckedRevenues(checkePendingd.filter((id) => id !== rowId));
    }
  };

  const toggleReceived = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedReceived([...checkePendingd, rowId]);
    } else {
      setCheckedReceived(checkePendingd.filter((id) => id !== rowId));
    }
  };

  const togglePayments = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedPayments([...checkedPayments, rowId]);
    } else {
      setCheckedPayments(checkedPayments.filter((id) => id !== rowId));
    }
  };

  const toggleWithdraws = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedWithdraws([...checkedWithdraws, rowId]);
    } else {
      setCheckedWithdraws(checkedWithdraws.filter((id) => id !== rowId));
    }
  };

  const toggleCustom1 = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedCustom1([...checkedCustom1, rowId]);
    } else {
      setCheckedCustom1(checkedCustom1.filter((id) => id !== rowId));
    }
  };

  const toggleAllCheckedPendings = (checked: boolean) => {
    if (checked) {
      const currentPageIds = pendingRevenues.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkePendingd, ...currentPageIds])
      );
      setCheckedRevenues(newSelectedRows);
    } else {
      const currentPageIds = pendingRevenues.map((row: any) => row.id);
      const newSelectedRows = checkePendingd.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedRevenues(newSelectedRows);
    }
  };

  const toggleAllCheckedPayments = (checked: boolean) => {
    if (checked) {
      const currentPageIds = costs.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedPayments, ...currentPageIds])
      );
      setCheckedPayments(newSelectedRows);
    } else {
      const currentPageIds = costs.map((row: any) => row.id);
      const newSelectedRows = checkedPayments.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedPayments(newSelectedRows);
    }
  };

  const toggleAllCheckedWithdraws = (checked: boolean) => {
    if (checked) {
      const currentPageIds = withdraws.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedWithdraws, ...currentPageIds])
      );
      setCheckedWithdraws(newSelectedRows);
    } else {
      const currentPageIds = withdraws.map((row: any) => row.id);
      const newSelectedRows = checkedWithdraws.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedWithdraws(newSelectedRows);
    }
  };

  const toggleAllCheckedCustom1 = (checked: boolean) => {
    if (checked) {
      const currentPageIds = custom1.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedCustom1, ...currentPageIds])
      );
      setCheckedCustom1(newSelectedRows);
    } else {
      const currentPageIds = custom1.map((row: any) => row.id);
      const newSelectedRows = checkedCustom1.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedCustom1(newSelectedRows);
    }
  };

  const toggleAllCheckedReceived = (checked: boolean) => {
    if (checked) {
      const currentPageIds = withdraws.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedWithdraws, ...currentPageIds])
      );
      setCheckedReceived(newSelectedRows);
    } else {
      const currentPageIds = withdraws.map((row: any) => row.id);
      const newSelectedRows = checkedWithdraws.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedReceived(newSelectedRows);
    }
  };

  const {
    pagesCount: pagesCountP,
    page: pageP,
    setTotalResults: setTotalResultsP,
    handlePageChange: handlePageChangeP,
    reload: reloadP,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const formattedFilters = {
        startDate: filter.startDate?.toDate().toLocaleString() || undefined,
        endDate: filter.endDate?.toDate().toLocaleString() || undefined,
        budgetMin: filter.budget.min.length ? filter.budget.min : undefined,
        budgetMax: filter.budget.max.length ? filter.budget.max : undefined,

        companyIds: filter.company.length
          ? getStateValueAsNumArray(filter.company)
          : undefined,
        clientIds: filter.client.length
          ? getStateValueAsNumArray(filter.client)
          : undefined,

        ambassadorIds: filter.ambassador.length
          ? getStateValueAsNumArray(filter.ambassador)
          : undefined,

        campaignIds: filter.campaign.length
          ? getStateValueAsNumArray(filter.campaign)
          : undefined,
        surveyIds: filter.survey.length
          ? getStateValueAsNumArray(filter.survey)
          : undefined,
      };
      const { result, meta } = await PlatformProductOrderAPI.getRevenues({
        limit: params.limit,
        skip: params.skip,
        financeStatus: 0,
        sortBy: '-updatedAt',
        ...formattedFilters,
      });
      setPage(params.page);

      setPendingRevenues(result);
      setTotalResultsP(meta.countFiltered);
    },
  });

  const {
    pagesCount: pagesCountR,
    page: pageR,
    setTotalResults: setTotalResultsR,
    handlePageChange: handlePageChangeR,
    reload: reloadR,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const formattedFilters = {
        startDate: filter.startDate?.toDate().toLocaleString() || undefined,
        endDate: filter.endDate?.toDate().toLocaleString() || undefined,
        budgetMin: filter.budget.min.length ? filter.budget.min : undefined,
        budgetMax: filter.budget.max.length ? filter.budget.max : undefined,
        statusIds: filter.status.length
          ? getStateValueAsNumArray(filter.status)
          : undefined,
        companyIds: filter.company.length
          ? getStateValueAsNumArray(filter.company)
          : undefined,
        clientIds: filter.client.length
          ? getStateValueAsNumArray(filter.client)
          : undefined,
        influencerIds: filter.influencer.length
          ? getStateValueAsNumArray(filter.influencer)
          : undefined,
        ambassadorIds: filter.ambassador.length
          ? getStateValueAsNumArray(filter.ambassador)
          : undefined,
        campaignIds: filter.campaign.length
          ? getStateValueAsNumArray(filter.campaign)
          : undefined,
        surveyIds: filter.survey.length
          ? getStateValueAsNumArray(filter.survey)
          : undefined,
      };

      const { result, meta } = await PlatformProductOrderAPI.getRevenues({
        limit: params.limit,
        skip: params.skip,
        financeStatus: 1,
        sortBy: '-updatedAt',
        ...formattedFilters,
      });

      setPage(params.page);

      setReceivedRevenues(result);
      setTotalResultsR(meta.countFiltered);
    },
  });

  const {
    pagesCount: pagesCountC,
    page: pageC,
    setTotalResults: setTotalResultsC,
    handlePageChange: handlePageChangeC,
    reload: reloadC,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const formattedFilters = {
        startDate: filter.startDate?.toDate().toLocaleString() || undefined,
        endDate: filter.endDate?.toDate().toLocaleString() || undefined,
        budgetMin: filter.budget.min.length ? filter.budget.min : undefined,
        budgetMax: filter.budget.max.length ? filter.budget.max : undefined,
        statusIds: filter.status.length
          ? getStateValueAsNumArray(filter.status)
          : undefined,
        companyIds: filter.company.length
          ? getStateValueAsNumArray(filter.company)
          : undefined,
        clientIds: filter.client.length
          ? getStateValueAsNumArray(filter.client)
          : undefined,
        influencerIds: filter.influencer.length
          ? getStateValueAsNumArray(filter.influencer)
          : undefined,
        ambassadorIds: filter.ambassador.length
          ? getStateValueAsNumArray(filter.ambassador)
          : undefined,
        campaignIds: filter.campaign.length
          ? getStateValueAsNumArray(filter.campaign)
          : undefined,
        surveyIds: filter.survey.length
          ? getStateValueAsNumArray(filter.survey)
          : undefined,
      };

      const { result, meta } = await FinanceAPI.getAllCosts({
        limit: params.limit,
        skip: params.skip,
        ...formattedFilters,
      });

      setPage(params.page);

      setCosts(result);
      setTotalResultsC(meta.countFiltered);
    },
  });

  const {
    pagesCount: pagesCountW,
    page: pageW,
    setTotalResults: setTotalResultsW,
    handlePageChange: handlePageChangeW,
    reload: reloadW,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const formattedFilters = {
        startDate: filter.startDate?.toDate().toLocaleString() || undefined,
        endDate: filter.endDate?.toDate().toLocaleString() || undefined,
        amountMin: filter.budget.min.length ? filter.budget.min : undefined,
        amountMax: filter.budget.max.length ? filter.budget.max : undefined,
        statusIds: filter.status.length
          ? getStateValueAsNumArray(filter.status)
          : undefined,
        influencerIds: filter.influencer.length
          ? getStateValueAsNumArray(filter.influencer)
          : undefined,
      };

      const { result, meta } = await FinanceAPI.getAllWithdrawRequests({
        limit: params.limit,
        skip: params.skip,
        ...formattedFilters,
      });
      setPage(params.page);

      setWithdraws(result);
      setTotalResultsW(meta.countFiltered);
    },
  });

  const {
    pagesCount: pagesCountC1,
    page: pageC1,
    setTotalResults: setTotalResultsC1,
    handlePageChange: handlePageChangeC1,
    reload: reloadC1,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const formattedFilters = {
        startDate: filter.startDate?.toDate().toLocaleString() || undefined,
        endDate: filter.endDate?.toDate().toLocaleString() || undefined,
        budgetMin: filter.budget.min.length ? filter.budget.min : undefined,
        budgetMax: filter.budget.max.length ? filter.budget.max : undefined,
        typeIds: filter.types.length
          ? getStateValueAsNumArray(filter.types)
          : undefined,
        statusIds: filter.status.length
          ? getStateValueAsNumArray(filter.status)
          : undefined,
        companyIds: filter.company.length
          ? getStateValueAsNumArray(filter.company)
          : undefined,
        clientIds: filter.client.length
          ? getStateValueAsNumArray(filter.client)
          : undefined,
        influencerIds: filter.influencer.length
          ? getStateValueAsNumArray(filter.influencer)
          : undefined,
        ambassadorIds: filter.ambassador.length
          ? getStateValueAsNumArray(filter.ambassador)
          : undefined,
        campaignIds: filter.campaign.length
          ? getStateValueAsNumArray(filter.campaign)
          : undefined,
        surveyIds: filter.survey.length
          ? getStateValueAsNumArray(filter.survey)
          : undefined,
      };

      const { result, meta } = await FinanceAPI.getAllCustomFinanceStatements({
        limit: params.limit,
        skip: params.skip,
        type: 0,
        ...formattedFilters,
      });

      setPage(params.page);

      setCustom1(result);
      setTotalResultsC1(meta.countFiltered);
    },
  });

  const renderCustom1 = ({ headItem, row }: TTableRenderItemObject) => {
    if (headItem.reference === 'name') {
      if (row.data.statementName) {
        return row.data.statementName;
      }
    }

    if (headItem.reference === 'date') {
      if (row.data.updatedAt) {
        return moment.utc(row.data.updatedAt, true).format('DD/MM/YYYY');
      }
    }

    if (headItem.reference === 'subject') {
      if (row.data.user) {
        const fullName = `${row.data.user.firstName} ${row.data.user.lastName}`;

        switch (row.data.user.role) {
          case 2:
            return `${fullName} (Ambassador)`;
          case 4:
            return `${fullName} (Influencer)`;
          case 3:
            return `${fullName} (Client)`;
          default:
            return '';
        }
      }
    }

    if (headItem.reference === 'type') {
      if (row.data.transactionFlow && row.data.transactionFlow.type !== null) {
        switch (row.data.transactionFlow.type) {
          case 0:
            return 'Salary';
          case 2:
            return 'Donation';
          case 3:
            return 'Affiliate';
          case 4:
            return 'Comission';
          default:
            return '';
        }
      }
    }

    if (headItem.reference === 'email') {
      if (row.data.user) {
        return row.data.email;
      }
    }

    if (headItem.reference === 'balance_change') {
      return row.data.isBalanceChange ? 'Yes' : 'No';
    }

    if (headItem.reference === 'status') {
      if (
        row.data.transactionFlow &&
        row.data.transactionFlow.transactions &&
        row.data.transactionFlow.transactions.length > 0
      ) {
        if (
          row.data.transactionFlow.transactions[
            row.data.transactionFlow.transactions.length - 1
          ]
        ) {
          switch (
            row.data.transactionFlow.transactions[
              row.data.transactionFlow.transactions.length - 1
            ].status
          ) {
            case 0:
              return 'Pending';
            case 1:
              return 'Approved';
            case 2:
              return 'Declined';
            default:
              return '';
          }
        }
      }
    }

    if (headItem.reference === 'amount') {
      if (row.data.amount) {
        return `CHF ${row.data.amount}`;
      }
    }

    if (headItem.reference === 'vendor') {
      if (row.data.vendor) {
        return row.data.vendor;
      }
    }

    if (headItem.reference === 'project') {
      if (row.data.platformProductOrder.campaigns.length) {
        return row.data.platformProductOrder.campaigns[0].name;
      }

      if (row.data.platformProductOrder.surveys.length) {
        return row.data.platformProductOrder.surveys[0].name;
      }
    }

    if (headItem.reference === 'actions') {
      if (
        row.data.transactionFlow!?.transactions[
          row.data.transactionFlow.transactions.length - 1
        ]?.status === 0 &&
        row.data.isBalanceChange
      ) {
        return (
          <PaymentActions
            data={row.data.transactionFlow}
            reload={() => {
              reloadC();
              reloadC1();
            }}
          />
        );
      }
    }

    return '';
  };

  const renderWithdraw = ({ headItem, row }: TTableRenderItemObject) => {
    if (headItem.reference === 'subject') {
      if (row.data.user) {
        return `${row.data.user.firstName} ${row.data.user.lastName}`;
      }
    }

    if (headItem.reference === 'date') {
      if (row.data.updatedAt) {
        return moment(row.data.updatedAt).format('DD/MM/YYYY');
      }
    }

    if (headItem.reference === 'status') {
      if (row.data.transactions) {
        switch (
          row.data.transactions[row.data.transactions.length - 1]?.status
        ) {
          case 0:
            return 'Pending';
          case 1:
            return 'Approved';
          case 2:
            return 'Declined';
          default:
            return '';
        }
      }
    }

    if (headItem.reference === 'amount') {
      if (row.data.amount) {
        return `CHF ${row.data.amount}`;
      }
    }

    if (headItem.reference === 'actions') {
      if (
        row.data.transactions[row.data.transactions.length - 1]?.status === 0
      ) {
        return <WithdrawActions data={row.data} reload={reloadW} />;
      }
    }

    return '';
  };

  const renderCost = ({ headItem, row }: TTableRenderItemObject) => {
    if (headItem.reference === 'name') {
      if (row.data.productOrder) {
        const { productOrder } = row.data;
        if (productOrder.campaigns.length > 0) {
          return productOrder.campaigns[0].name;
        }
        if (productOrder.surveys.length > 0) {
          return productOrder.surveys[0].name;
        }
      }
    }

    if (headItem.reference === 'amount') {
      if (row.data.amount > 0) {
        return `CHF ${row.data.amount}`;
      }
    }

    if (headItem.reference === 'status') {
      switch (row.data.transactions[row.data.transactions.length - 1]?.status) {
        case 0:
          return 'Pending';
        case 1:
          return 'Approved';
        case 2:
          return 'Declined';
        default:
          return '';
      }
    }

    if (headItem.reference === 'date') {
      if (row.data.updatedAt) {
        return moment.utc(row.data.updatedAt).format('DD/MM/YYYY');
      }
    }

    if (headItem.reference === 'subject') {
      if (row.data.user) {
        return `${row.data.user.firstName} ${row.data.user.lastName}`;
      }
    }

    if (headItem.reference === 'actions') {
      if (
        row.data.transactions[row.data.transactions.length - 1]?.status === 0 &&
        row.data.productOrder.status === 2
      ) {
        return <PaymentActions data={row.data} reload={reloadC} />;
      }
    }

    return '';
  };

  const renderRevenue = ({ headItem, row }: TTableRenderItemObject) => {
    if (headItem.reference === 'project') {
      if (row.data.campaigns.length > 0) {
        return row.data.campaigns[0].name;
      }
      if (row.data.surveys.length > 0) {
        return row.data.surveys[0].name;
      }
    }

    if (headItem.reference === 'amount') {
      if (row.data.budget > 0 && row.data.currency && row.data.currency.code) {
        return `${row.data.currency.code} ${row.data.budget}`;
      }
    }

    if (headItem.reference === 'date') {
      if (row.data.updatedAt) {
        return moment(row.data.updatedAt).format('DD/MM/YYYY');
      }
    }

    if (headItem.reference === 'status') {
      switch (row.data.financeStatus) {
        case 0:
          return 'Pending';
        case 1:
          return 'Recevied';
        default:
          return '';
      }
    }

    if (headItem.reference === 'actions' && tabs === 0) {
      return (
        <PendingActions
          data={row.data}
          reload={() => {
            reloadP();
            reloadR();
          }}
        />
      );
    }

    return '';
  };

  const [menuRP, openRP, setOpenRP] = useMenu(false);
  const [menuRPa, openRPa, setOpenRPa] = useMenu(false);
  const [menuCP, openCP, setOpenCP] = useMenu(false);
  const [menuCW, openCW, setOpenCW] = useMenu(false);
  const [menuCPa, openCPa, setOpenCPa] = useMenu(false);

  // const handleMenuRP = () => {
  //   setOpenRP(!openRP);
  // };
  // const handleMenuRPa = () => {
  //   setOpenRPa(!openRPa);
  // };
  // const handleMenuCP = () => {
  //   setOpenCP(!openCP);
  // };
  // const handleMenuCW = () => {
  //   setOpenCW(!openCW);
  // };
  // const handleMenuCPa = () => {
  //   setOpenCPa(!openCPa);
  // };

  const [
    receivePendingRevenues,
    openReceivePendingRevenues,
    closeReceivePendingRevenues,
  ] = useModal(false);

  const { push } = useSnackbar();

  const handleBulkReceivePendingRevenues = useCallback(async () => {
    try {
      const response = await PlatformProductOrderAPI.receivePendingRevenues({
        productIds: checkePendingd,
      });

      if (response.status === 200) {
        reloadP();
        reloadR();
        setCheckedRevenues([]);
        push('Pending revenues received successfully.', { variant: 'success' });
      }
    } catch (error: any) {
      push('Pending revenues recevied failed', { variant: 'error' });
    }
  }, [checkePendingd]);

  const emptyFunction = async () => {};

  const bulkApproveTransactionFlows = useCallback(async () => {
    try {
      const response = await FinanceAPI.approveBulkTransactionFlows(
        checkedPayments
      );

      if (response.status === 201) {
        reloadC();
        reloadC1();
        setCheckedPayments([]);
        push(`Payments ${action}d successfully.`, { variant: 'success' });
      }
    } catch (error: any) {
      push(`Payments ${action}d failed`, { variant: 'error' });
    }
  }, [action, checkedPayments]);

  const bulkApproveTransactionFlowsC1 = useCallback(async () => {
    try {
      const response = await FinanceAPI.approveBulkTransactionFlows(
        checkedCustom1
      );

      if (response.status === 201) {
        reloadC();
        reloadC1();
        setCheckedCustom1([]);
        push(`Payments ${action}d successfully.`, { variant: 'success' });
      }
    } catch (error: any) {
      push(`Payments ${action}d failed`, { variant: 'error' });
    }
  }, [action, checkedCustom1]);

  const bulkDeclineTransactionFlows = useCallback(async () => {
    try {
      const response = await FinanceAPI.declineBulkTransactionFlows(
        checkedPayments
      );

      if (response.status === 201) {
        reloadC();
        reloadC1();
        setCheckedPayments([]);
        push(`Payments ${action}d successfully.`, { variant: 'success' });
      }
    } catch (error: any) {
      push(`Payments ${action}d failed`, { variant: 'error' });
    }
  }, [action, checkedPayments]);

  const bulkDeclineTransactionFlowsC1 = useCallback(async () => {
    try {
      const response = await FinanceAPI.declineBulkTransactionFlows(
        checkedCustom1
      );

      if (response.status === 201) {
        reloadC();
        reloadC1();
        setCheckedCustom1([]);
        push(`Payments ${action}d successfully.`, { variant: 'success' });
      }
    } catch (error: any) {
      push(`Payments ${action}d failed`, { variant: 'error' });
    }
  }, [action, checkedCustom1]);

  const handleBulkPaymentsAction = useCallback(async () => {
    if (action === 'approve') {
      return bulkApproveTransactionFlows();
    }
    if (action === 'decline') {
      return bulkDeclineTransactionFlows();
    }

    return emptyFunction();
  }, [action, checkedPayments]);

  const handleBulkPaymentsActionC1 = useCallback(async () => {
    if (action === 'approve') {
      return bulkApproveTransactionFlowsC1();
    }
    if (action === 'decline') {
      return bulkDeclineTransactionFlowsC1();
    }

    return emptyFunction();
  }, [action, checkedCustom1]);

  const approveWithdrawal = useCallback(async () => {
    try {
      await FinanceAPI.bulkApproveWithdrawRequest(checkedWithdraws).then(() => {
        push('Bulk approve withdrawal successfully.', {
          variant: 'success',
        });
        setCheckedWithdraws([]);
        reloadW();
      });
    } catch (error: any) {
      push('Bulk approve withdrawal failed.', { variant: 'error' });
    }
  }, [checkedWithdraws]);

  const declineWithdrawal = useCallback(async () => {
    try {
      FinanceAPI.bulkDeclineWithdrawRequest(checkedWithdraws).then(() => {
        push('Bulk decline withdrawal successfully.', { variant: 'success' });
        setCheckedWithdraws([]);
        reloadW();
      });
    } catch (error: any) {
      push('Bulk decline withdrawal failed.', { variant: 'error' });
    }
  }, [checkedWithdraws]);

  const handleBulkWithdrawAction = useCallback(async () => {
    if (action === 'approve') {
      return approveWithdrawal();
    }
    if (action === 'decline') {
      return declineWithdrawal();
    }

    return emptyFunction();
  }, [action, checkedWithdraws]);

  const handleFilters = () => {
    handlePageChangeC(1);
    handlePageChangeW(1);
    handlePageChangeC1(1);
    handlePageChangeP(1);
    handlePageChangeR(1);
  };

  return (
    <FinancePageMain>
      <FinancePageCharts>
        <CardWrapper>
          <CardWithChart
            title="Revenue"
            icon={<RevenueIcon />}
            smallIcon={<FinanceSmallIcon />}
            percent={
              financeOverTime1?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              financeOverTime1?.data
                ? financeOverTime1?.data[financeOverTime1.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                financeOverTime1?.data &&
                financeOverTime1?.data.map((element: any) => element.value),
              labels:
                financeOverTime1?.data &&
                financeOverTime1?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Cost"
            icon={<CostIcon />}
            smallIcon={<FinanceSmallIcon />}
            percent={
              financeOverTime2?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              financeOverTime2?.data
                ? financeOverTime2?.data[financeOverTime2.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                financeOverTime2?.data &&
                financeOverTime2?.data.map((element: any) => element.value),
              labels:
                financeOverTime2?.data &&
                financeOverTime2?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Profit"
            icon={<ProfitIcon />}
            smallIcon={<FinanceSmallIcon />}
            percent={financeOverTime3?.changePercentage || Number(0).toFixed(2)}
            count={
              financeOverTime3?.data
                ? financeOverTime3?.data[financeOverTime3.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                financeOverTime3?.data &&
                financeOverTime3?.data.map((element: any) => element.value),
              labels:
                financeOverTime3?.data &&
                financeOverTime3?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Margin"
            icon={<MarginIcon />}
            smallIcon={<FinanceSmallIcon />}
            percent={financeOverTime4?.changePercentage || Number(0).toFixed(2)}
            count={
              financeOverTime4?.data
                ? financeOverTime4?.data[financeOverTime4.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                financeOverTime4?.data &&
                financeOverTime4?.data.map((element: any) => element.value),
              labels:
                financeOverTime4?.data &&
                financeOverTime4?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
      </FinancePageCharts>

      {/* <FinancePageCharts>
        <CardWithProgress
          title="Industry"
          icon={<RedCrossIcon />}
          progressData={[
            {
              icon: <BusinessmanIcon />,
              percent: 100,
              title: 'Test',
            },
            {
              icon: <BusinessmanIcon />,
              percent: 38,
              title: 'Test',
            },
            {
              icon: <BusinessmanIcon />,
              percent: 75,
              title: 'Test',
            },
          ]}
        />
        <CardWithProgress
          title="Location"
          icon={<RedCrossIcon />}
          progressData={[
            {
              icon: <BusinessmanIcon />,
              percent: 100,
              title: 'Test',
            },
            {
              icon: <BusinessmanIcon />,
              percent: 38,
              title: 'Test',
            },
            {
              icon: <BusinessmanIcon />,
              percent: 75,
              title: 'Test',
            },
          ]}
        />
        <CardWithProgress
          title="Disease Area"
          icon={<RedCrossIcon />}
          progressData={[
            {
              icon: <BusinessmanIcon />,
              percent: 100,
              title: 'Test',
            },
            {
              icon: <BusinessmanIcon />,
              percent: 38,
              title: 'Test',
            },
            {
              icon: <BusinessmanIcon />,
              percent: 75,
              title: 'Test',
            },
          ]}
        />
        <CardWithProgress
          title="Platform"
          icon={<RedCrossIcon />}
          progressData={[
            {
              icon: <BusinessmanIcon />,
              percent: 100,
              title: 'Test',
            },
            {
              icon: <BusinessmanIcon />,
              percent: 38,
              title: 'Test',
            },
            {
              icon: <BusinessmanIcon />,
              percent: 75,
              title: 'Test',
            },
          ]}
        />
      </FinancePageCharts> */}
      <CardWithText
        title="Financial Statement"
        actions={[
          <Button
            color={filterOpen ? 'secondary' : 'default'}
            variant="contained"
            onClick={toggleFilter}
            startIcon={<SlidersHorizontalIcon width="18" height="18" />}
          >
            Filters
          </Button>,
          <Button color="default" variant="contained" onClick={openEfModal}>
            Export
          </Button>,
          <Button color="primary" variant="contained" onClick={openCfModal}>
            Add Statement
          </Button>,
        ]}
      >
        <Stack>
          <Collapse removeGap in={filterOpen}>
            <FinancePageFilter>
              <Tabs
                tabs={['Statement']}
                // tabs={['Statement', 'Subject']}
                value={filterTabs}
                onValue={setFilterTabs}
              />

              {filterTabs === 0 && (
                <Grid columns={4}>
                  {/* <Input
                    type="text"
                    label="Search"
                    placeholder="Please Enter"
                    value={filter.search}
                    onValue={(search) => setFilter({ ...filter, search })}
                  /> */}
                  <InputGroup
                    label="Date"
                    inputRatio="1fr 1fr"
                    elements={[
                      {
                        value: filter.startDate,
                        onValue: (startDate) =>
                          setFilter({ ...filter, startDate }),
                        type: 'date',
                        placeholder: 'From',
                      },
                      {
                        value: filter.endDate,
                        onValue: (endDate) => setFilter({ ...filter, endDate }),
                        type: 'date',
                        placeholder: 'To',
                      },
                    ]}
                  />
                  <Input
                    type="min-max"
                    label="Budget"
                    value={filter.budget}
                    onValue={(budget) => setFilter({ ...filter, budget })}
                  />
                  <Input
                    type="multiselect"
                    label="Type"
                    placeholder="Please Select"
                    value={filter.types}
                    onValue={(types) => setFilter({ ...filter, types })}
                    options={[
                      { value: 3, label: 'Affiliate' },
                      { value: 4, label: 'Comission' },
                      { value: 2, label: 'Donation' },
                      { value: 0, label: 'Salary' },
                    ]}
                  />
                  {/* <Input
                    type="select"
                    label="Location"
                    placeholder="Please Select"
                    value={filter.location}
                    onValue={(location) => setFilter({ ...filter, location })}
                  />
                  <Input
                    type="select"
                    label="Disease Area"
                    placeholder="Please Select"
                    value={filter.diseaseArea}
                    onValue={(diseaseArea) =>
                      setFilter({ ...filter, diseaseArea })
                    }
                  /> */}
                  <Input
                    type="multiselect"
                    label="Status"
                    placeholder="Please Select"
                    value={filter.status}
                    onValue={(status) => setFilter({ ...filter, status })}
                    options={[
                      { value: 1, label: 'Approved' },
                      { value: 2, label: 'Declined' },
                      { value: 0, label: 'Pending' },
                    ]}
                  />
                  {/* <Input
                    type="select"
                    label="Social Media Platform"
                    placeholder="Please Select"
                    value={filter.socialMediaPlatform}
                    onValue={(socialMediaPlatform) =>
                      setFilter({ ...filter, socialMediaPlatform })
                    }
                  /> */}
                  <Input
                    type="multiselect"
                    label="Company"
                    placeholder="Please Select"
                    value={filter.company}
                    onValue={(company) => setFilter({ ...filter, company })}
                    options={companyOptions}
                    onSearch={debounceCompanies}
                  />
                  <Input
                    type="multiselect"
                    label="Client"
                    placeholder="Please Select"
                    value={filter.client}
                    onValue={(client) => setFilter({ ...filter, client })}
                    options={clientOptions}
                    onSearch={debounceClients}
                  />
                  <Input
                    type="multiselect"
                    label="Influencer"
                    placeholder="Please Select"
                    value={filter.influencer}
                    onValue={(influencer) =>
                      setFilter({ ...filter, influencer })
                    }
                    options={influencerOptions}
                    onSearch={debounceInfluencers}
                  />
                  <Input
                    type="multiselect"
                    label="Ambassador"
                    placeholder="Please Select"
                    value={filter.ambassador}
                    onValue={(ambassador) =>
                      setFilter({ ...filter, ambassador })
                    }
                    options={ambassadorsOptions}
                    onSearch={debounceAmbassadors}
                  />
                  <Input
                    type="multiselect"
                    label="Campaign"
                    placeholder="Please Select"
                    value={filter.campaign}
                    onValue={(campaign) => setFilter({ ...filter, campaign })}
                    options={campaigns}
                    onSearch={debounceCampaigns}
                  />
                  <Input
                    type="multiselect"
                    label="Survey"
                    placeholder="Please Select"
                    value={filter.survey}
                    onValue={(survey) => setFilter({ ...filter, survey })}
                    options={surveys}
                    onSearch={debounceSurveys}
                  />
                </Grid>
              )}

              {/* {filterTabs === 1 && (
                <Grid columns={4}>
                  <Input
                    type="select"
                    label="Company"
                    placeholder="Please Select"
                    value={filter.company}
                    onValue={(company) => setFilter({ ...filter, company })}
                  />
                  <Input
                    type="select"
                    label="Client"
                    placeholder="Please Select"
                    value={filter.client}
                    onValue={(client) => setFilter({ ...filter, client })}
                  />
                  <Input
                    type="select"
                    label="Influencer"
                    placeholder="Please Select"
                    value={filter.influencer}
                    onValue={(influencer) =>
                      setFilter({ ...filter, influencer })
                    }
                  />
                  <Input
                    type="select"
                    label="Ambassador"
                    placeholder="Please Select"
                    value={filter.ambassador}
                    onValue={(ambassador) =>
                      setFilter({ ...filter, ambassador })
                    }
                  />
                  <Input
                    type="select"
                    label="Vendor"
                    placeholder="Please Select"
                    value={filter.vendor}
                    onValue={(vendor) => setFilter({ ...filter, vendor })}
                  />
                  <Input
                    type="select"
                    label="Campaign"
                    placeholder="Please Select"
                    value={filter.campaign}
                    onValue={(campaign) => setFilter({ ...filter, campaign })}
                  />
                  <Input
                    type="select"
                    label="Report"
                    placeholder="Please Select"
                    value={filter.report}
                    onValue={(report) => setFilter({ ...filter, report })}
                  />
                  <Input
                    type="select"
                    label="Social Media Listening"
                    placeholder="Please Select"
                    value={filter.socialMediaListening}
                    onValue={(socialMediaListening) =>
                      setFilter({ ...filter, socialMediaListening })
                    }
                  />
                  <Input
                    type="select"
                    label="Survey"
                    placeholder="Please Select"
                    value={filter.survey}
                    onValue={(survey) => setFilter({ ...filter, survey })}
                  />
                  <Input
                    type="select"
                    label="Product"
                    placeholder="Please Select"
                    value={filter.product}
                    onValue={(product) => setFilter({ ...filter, product })}
                  />
                </Grid>
              )} */}
              <FinancePageFilterActions direction="horizontal">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => handleFilters()}
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
              </FinancePageFilterActions>
            </FinancePageFilter>
          </Collapse>
        </Stack>
      </CardWithText>
      <CardWithText
        title="Cost"
        // actions={[
        //   <Button color="default" variant="contained" onClick={openAfModal}>
        //     Approve
        //   </Button>,
        // ]}
      >
        <Stack>
          <Tabs
            value={tab}
            onValue={setTab}
            tabs={['Payments', 'Withdrawals', 'Custom']}
          />
          {tab === 0 && (
            <>
              <NewCheckboxTable
                head={DFinanceHead}
                items={costs}
                renderItem={renderCost}
                checkedRows={checkedPayments}
                onSingleSelect={togglePayments}
                onSelectAll={toggleAllCheckedPayments}
                tableColModal={tableModal2}
                renderElements={
                  <>
                    <ISpan onClick={handleMenu2} ref={buttonRegRef2}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {open2 && (
                      <ActionsMenu
                        ref={menu2}
                        position={position2}
                        items={[
                          {
                            icon: <ApproveIcon />,
                            label: 'Approve',
                            action: () => {
                              setAction('approve');
                              setPlural(true);
                              openAfModal();
                              handleMenu2();
                            },
                          },
                          {
                            icon: <DeclineIcon />,
                            label: 'Decline',
                            action: () => {
                              setAction('decline');
                              setPlural(true);
                              openAfModal();
                              handleMenu2();
                            },
                          },
                          // {
                          //   icon: <DeleteIcon />,
                          //   label: 'Delete',
                          //   action: () => {
                          //     setAction('remove');
                          //     setPlural(true);
                          //     openAfModal();
                          //     handleMenu2();
                          //   },
                          // },
                        ]}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                page={pageC}
                count={pagesCountC}
                onChange={(_e, x) => handlePageChangeC(x)}
              />
            </>
          )}
          {tab === 1 && (
            <>
              <NewCheckboxTable
                head={DFinanceHead2}
                items={withdraws}
                renderItem={renderWithdraw}
                checkedRows={checkedWithdraws}
                onSingleSelect={toggleWithdraws}
                onSelectAll={toggleAllCheckedWithdraws}
                tableColModal={tableModal3}
                renderElements={
                  <>
                    <ISpan onClick={handleMenu3} ref={buttonRegRef3}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {open3 && (
                      <ActionsMenu
                        ref={menu3}
                        position={position3}
                        items={[
                          {
                            icon: <ApproveIcon />,
                            label: 'Approve',
                            action: () => {
                              setAction('approve');
                              setPlural(true);
                              openWModal();
                              handleMenu3();
                            },
                          },
                          {
                            icon: <DeclineIcon />,
                            label: 'Decline',
                            action: () => {
                              setAction('decline');
                              setPlural(true);
                              openWModal();
                              handleMenu3();
                            },
                          },
                        ]}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                page={pageW}
                count={pagesCountW}
                onChange={(_e, x) => handlePageChangeW(x)}
              />
            </>
          )}
          {tab === 2 && (
            <>
              <NewCheckboxTable
                head={DFinanceHeadC1}
                items={custom1}
                renderItem={renderCustom1}
                checkedRows={checkedCustom1}
                onSingleSelect={toggleCustom1}
                onSelectAll={toggleAllCheckedCustom1}
                tableColModal={tableModal5}
                renderElements={
                  <>
                    <ISpan onClick={handleMenu4} ref={buttonRegRef4}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {open4 && (
                      <ActionsMenu
                        ref={menu4}
                        position={position4}
                        items={[
                          {
                            icon: <ApproveIcon />,
                            label: 'Approve',
                            action: () => {
                              setAction('approve');
                              setPlural(true);
                              openC1Modal();
                              handleMenu3();
                            },
                          },
                          {
                            icon: <DeclineIcon />,
                            label: 'Decline',
                            action: () => {
                              setAction('decline');
                              setPlural(true);
                              openC1Modal();
                              handleMenu4();
                            },
                          },
                        ]}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                page={pageC1}
                count={pagesCountC1}
                onChange={(_e, x) => handlePageChangeC1(x)}
              />
            </>
          )}
        </Stack>
      </CardWithText>
      <CardWithText
        title="Revenue"
        // actions={[
        //   <Button color="default" variant="contained">
        //     Received
        //   </Button>,
        // ]}
      >
        <Stack>
          <Tabs
            value={tabs}
            onValue={setTabs}
            tabs={['Pending', 'Received', 'Custom']}
          />
          {tabs === 0 && (
            <>
              <NewCheckboxTable
                head={DFinanceHead3}
                items={pendingRevenues}
                renderItem={renderRevenue}
                checkedRows={checkePendingd}
                onSingleSelect={toggleRevenue}
                onSelectAll={toggleAllCheckedPendings}
                tableColModal={tableModal}
                renderElements={
                  <>
                    <ISpan onClick={handleMenu} ref={buttonRegRef}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {open && (
                      <ActionsMenu
                        position={position}
                        items={[
                          {
                            icon: <ReceivedIcon />,
                            label: 'Received',
                            action: () => {
                              openReceivePendingRevenues();
                              handleMenu();
                            },
                          },
                        ]}
                        ref={menu}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                page={pageP}
                count={pagesCountP}
                onChange={(_e, x) => handlePageChangeP(x)}
              />
            </>
          )}
          {tabs === 1 && (
            <>
              <NewCheckboxTable
                head={DFinanceHead3}
                items={receivedRevenues}
                renderItem={renderRevenue}
                checkedRows={checkedReceived}
                onSingleSelect={toggleReceived}
                onSelectAll={toggleAllCheckedReceived}
                tableColModal={tableModal4}
                renderElements={
                  <>
                    <span />
                    <span />
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                page={pageR}
                count={pagesCountR}
                onChange={(_e, x) => handlePageChangeR(x)}
              />
            </>
          )}

          {/* <Stack direction="horizontal">
            <Button color="default" variant="contained" onClick={handleMenuRP}>
              RP action
            </Button>
            <Button color="default" variant="contained" onClick={handleMenuRPa}>
              RPa action
            </Button>
            <Button color="default" variant="contained" onClick={handleMenuCP}>
              CP action
            </Button>
            <Button color="default" variant="contained" onClick={handleMenuCW}>
              CW action
            </Button>
            <Button color="default" variant="contained" onClick={handleMenuCPa}>
              CPa action
            </Button>
            <Button color="default" variant="contained" onClick={openCiModal}>
              Cost Info
            </Button>
            <Button color="default" variant="contained" onClick={openRiModal}>
              Revenue Info
            </Button>
          </Stack> */}
        </Stack>
        {openRP && (
          <Menu
            items={[
              {
                icon: <ReceivedIcon />,
                label: 'Received',
                action: () => {},
              },
              {
                icon: <ContactIcon />,
                label: 'Contact',
                action: () => {},
              },
              {
                icon: <EditIcon />,
                label: 'Note',
                action: () => {},
              },
              {
                icon: <ScheduleIcon />,
                label: 'Schedule',
                action: () => {},
              },
              {
                icon: <DeleteIcon />,
                label: 'Remove',
                action: () => {},
              },
            ]}
            ref={menuRP}
          />
        )}
        {openRPa && (
          <Menu
            items={[
              {
                icon: <ContactIcon />,
                label: 'Contact',
                action: () => {},
              },
              {
                icon: <EditIcon />,
                label: 'Note',
                action: () => {},
              },
              {
                icon: <ScheduleIcon />,
                label: 'Schedule',
                action: () => {},
              },
              {
                icon: <DeleteIcon />,
                label: 'Remove',
                action: () => {},
              },
            ]}
            ref={menuRPa}
          />
        )}
        {openCP && (
          <Menu
            items={[
              {
                icon: <ApproveIcon />,
                label: 'Approve',
                action: () => {},
              },
              {
                icon: <DeclineIcon />,
                label: 'Decline',
                action: () => {},
              },
              {
                icon: <ContactIcon />,
                label: 'Contact',
                action: () => {},
              },
              {
                icon: <EditIcon />,
                label: 'Note',
                action: () => {},
              },
              {
                icon: <ScheduleIcon />,
                label: 'Schedule',
                action: () => {},
              },
              {
                icon: <DeleteIcon />,
                label: 'Remove',
                action: () => {},
              },
            ]}
            ref={menuCP}
          />
        )}
        {openCW && (
          <Menu
            items={[
              {
                icon: <ApproveIcon />,
                label: 'Approve',
                action: () => {},
              },
              {
                icon: <ContactIcon />,
                label: 'Contact',
                action: () => {},
              },
              {
                icon: <EditIcon />,
                label: 'Note',
                action: () => {},
              },
              {
                icon: <ScheduleIcon />,
                label: 'Schedule',
                action: () => {},
              },
              {
                icon: <DeleteIcon />,
                label: 'Remove',
                action: () => {},
              },
            ]}
            ref={menuCW}
          />
        )}
        {openCPa && (
          <Menu
            items={[
              {
                icon: <ApproveIcon />,
                label: 'Approve',
                action: () => {},
              },
              {
                icon: <ContactIcon />,
                label: 'Contact',
                action: () => {},
              },
              {
                icon: <EditIcon />,
                label: 'Note',
                action: () => {},
              },
              {
                icon: <ScheduleIcon />,
                label: 'Schedule',
                action: () => {},
              },
              {
                icon: <DeleteIcon />,
                label: 'Remove',
                action: () => {},
              },
            ]}
            ref={menuCPa}
          />
        )}
      </CardWithText>
      {cfModal && (
        <CreateFinanceModal
          onClose={closeCfModal}
          reloadP={reloadP}
          reloadC={reloadC}
          reloadC1={reloadC1}
          reloadR={reloadR}
        />
      )}
      {efModal && (
        <ExportFinanceModal
          onClose={closeEfModal}
          checkedPending={checkePendingd}
          checkedPayments={checkedPayments}
          checkedWithdraws={checkedWithdraws}
          checkedRevenues={checkedReceived}
        />
      )}
      {afModal && (
        <ApproveFinanceModal
          onClose={closeAfModal}
          handleAction={handleBulkPaymentsAction}
          plural={plural}
          type={action}
        />
      )}
      {c1Modal && (
        <ApproveFinanceModal
          onClose={closeC1Modal}
          handleAction={handleBulkPaymentsActionC1}
          plural={plural}
          type={action}
        />
      )}
      {wModal && (
        <ApproveFinanceModal
          onClose={closeWModal}
          handleAction={handleBulkWithdrawAction}
          plural={plural}
          type={action}
          target="withdrawal"
        />
      )}
      {ciModal && <CostInfoModal onClose={closeCiModal} />}
      {riModal && <RevenueInfoModal onClose={closeRiModal} />}
      {receivePendingRevenues && (
        <PromptModal
          plural
          target="revenue"
          onClose={() => {
            closeReceivePendingRevenues();
          }}
          handleAction={handleBulkReceivePendingRevenues}
        />
      )}
    </FinancePageMain>
  );
};

export default FinancePage;
