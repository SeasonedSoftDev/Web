import React, { useEffect, useState } from 'react';
import {
  CampaignsPageMain,
  CampaignsPageCharts,
  CampaignsPageFilter,
  CampaignsPageFilterActions,
} from 'features/campaigns/styles';
import {
  DCampaignsAdminHead,
  DGenerateCampaignsFilter,
} from 'features/campaigns/data';
import {
  CardWithChart,
  CardWithText,
  NewCheckboxTable,
  Tabs,
} from 'components/custom';
import {
  CampaignsSmallIcon,
  DeleteIcon,
  FinishedIcon,
  InpreparationIcon,
  OngoingIcon,
  RevenueIcon,
  SlidersHorizontalIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { Button, Input, Pagination } from 'components/ui';
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
  AddCampaignModal,
  CreatedCampaignModal,
  ExportCampaignsModal,
  NoteCampaignsModal,
  ScheduleCampaignModal,
} from 'features/campaigns/role/admin/elements';
import {
  AmbassadorAPI,
  CampaignAPI,
  ClientAPI,
  CompanyAPI,
  DiseaseAreaAPI,
  EnumsApi,
  IndustryApi,
  LocationAPI,
  ProductApi,
} from 'api';
import { formatCurrencyIdToObject } from 'features/discover-influencers/role/admin/elements/influencer-profile/helpers';
import moment from 'moment';
import { BackupTableRounded } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { formatLongString } from 'utilities/string-converter';
import { fetchAndCacheData } from 'utilities/local-storage';
import InPreparationActions from './elements/inpreparation-actions';
import {
  ISpan,
  ActionsMenu as CustomActionsMenu,
  TableTooltip,
  CardWrapper,
  CampaignModalLink,
} from './styles';
import PromptModal from './elements/prompt-modal';

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
  budget: IMinMaxField;
  startDate: Date | null;
  endDate: Date | null;
  influencers: IMinMaxField;
  influencerSize: ISelectedField[];
  postType: ISelectedField | null;

  industry: ISelectedField[];
  clientDiseaseArea: ISelectedField[];
  company: ISelectedField[];
  client: ISelectedField[];
  ambassador: ISelectedField | null;
  product: ISelectedField[];

  targetDiseaseArea: ISelectedField[];
  targetStruggles: ISelectedField[];
  targetLocation: ISelectedField[];
  targetEthnicity: ISelectedField[];
  targetInterests: ISelectedField[];
  targetAge: IMinMaxField;
  targetGender: ISelectedField[];
  targetLanguage: ISelectedField[];
}

const CampaignsPage = () => {
  const [acModal, openAcModal, closeAcModal] = useModal(false);
  const [ecModal, openEcModal, closeEcModal] = useModal(false);
  const [scModal, openScModal, closeScModal] = useModal(false);
  const [ncModal, openNcModal, closeNcModal] = useModal(false);

  const [current, setCurrent] = useState(-1);

  const [inPrepCampaigns, setInPrepCampaigns] = useState<any>([]);
  const [ongoingCampaigns, setOngoingCampaigns] = useState<any>([]);
  const [finishedCampaigns, setFinishedCampaigns] = useState<any>([]);

  const [checkedIPCampaigns, setCheckedIPCampaigns] = useState<number[]>([]);
  const [checkedOCampaigns, setCheckedOCampaigns] = useState<number[]>([]);
  const [checkedFCampaigns, setCheckedFCampaigns] = useState<number[]>([]);

  const [campaignsOverTime1, setCampaignsOverTimeData1] = useState<any>([]);

  const [campaignsOverTime2, setCampaignsOverTimeData2] = useState<any>([]);
  const [campaignsOverTime3, setCampaignsOverTimeData3] = useState<any>([]);
  const [campaignsOverTime4, setCampaignsOverTimeData4] = useState<any>([]);

  const [filterCleared, setFilterCleared] = useState(false);

  const [filterParams, setFilterParams] = useState({});
  const [filterIPParams, setFilterIPParams] = useState({ status: 0 });
  const [filterOCParams, setFilterOCParams] = useState({ status: 1 });
  const [filterFCParams, setFilterFParams] = useState({ status: 2 });

  const { push } = useSnackbar();

  const initialFilters: IFilterProps = {
    search: '',
    budget: {
      min: '',
      max: '',
    },
    startDate: null,
    endDate: null,
    influencers: {
      min: '',
      max: '',
    },
    influencerSize: [],
    // socialMedia: null,
    postType: null,

    clientDiseaseArea: [],
    company: [],
    client: [],
    ambassador: null,
    product: [],

    industry: [],
    targetDiseaseArea: [],
    targetStruggles: [],
    targetLocation: [],
    targetEthnicity: [],
    targetInterests: [],
    targetAge: {
      min: '',
      max: '',
    },
    targetGender: [],
    targetLanguage: [],
  };

  // TODO use this but modify it and combine it with status
  const [filter, setFilter] = useState<IFilterProps>(initialFilters);

  const [
    removeBulkIPCampaignsModal,
    openRemoveBulkIPCampaignsModal,
    closeRemoveBulkIPCampaignsModal,
  ] = useModal(false);

  const [
    removeBulkOCampaignsModal,
    openRemoveBulkOCampaignsModal,
    closeRemoveBulkOCampaignsModal,
  ] = useModal(false);

  const [
    removeBulkFCampaignsModal,
    openRemoveBulkFCampaignsModal,
    closeRemoveBulkFCampaignsModal,
  ] = useModal(false);

  const getStateValueAsNumArray = (stateValue: ISelectedField[]): number[] =>
    stateValue && stateValue.length
      ? stateValue.map((item) => +item.value)
      : [];

  const {
    pagesCount: oCPageCount,
    page: oCPage,
    setTotalResults: setTotalOCResults,
    handlePageChange: handleOCPageChange,
    reload: reloadOC,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const formattedFilterParams = {
        search: filter.search && filter.search.length ? filter.search : '',
        budgetMin:
          filter.budget && filter.budget.min.length
            ? +filter.budget.min
            : undefined,
        budgetMax:
          filter.budget && filter.budget.max.length
            ? +filter.budget.max
            : undefined,
        startDate: filter.startDate || undefined,
        endDate: filter.endDate || undefined,
        influencersMin:
          filter.influencers && filter.influencers.min.length
            ? +filter.influencers.min
            : undefined,
        influencersMax:
          filter.influencers && filter.influencers.max.length
            ? +filter.influencers.max
            : undefined,
        influencersSizeIds: filter.influencerSize.length
          ? getStateValueAsNumArray(filter.influencerSize)
          : undefined,
        postType: filter.postType ? filter.postType.value : undefined,
        clientIndustryIds: filter.industry.length
          ? getStateValueAsNumArray(filter.industry)
          : undefined,
        clientDiseaseAreaIds: filter.clientDiseaseArea.length
          ? getStateValueAsNumArray(filter.clientDiseaseArea)
          : undefined,
        clientCompanyIds: filter.company.length
          ? getStateValueAsNumArray(filter.company)
          : undefined,

        clientIds: filter.client.length
          ? getStateValueAsNumArray(filter.client)
          : undefined,
        ambassadorId: filter.ambassador ? filter.ambassador.value : undefined,
        productIds: filter.product.length
          ? getStateValueAsNumArray(filter.product)
          : undefined,
        targetDiseaseAreaIds: filter.targetDiseaseArea.length
          ? getStateValueAsNumArray(filter.targetDiseaseArea)
          : undefined,
        targetStruggleIds: filter.targetStruggles.length
          ? getStateValueAsNumArray(filter.targetStruggles)
          : undefined,
        targetLocationIds: filter.targetLocation.length
          ? getStateValueAsNumArray(filter.targetLocation)
          : undefined,
        targetEthnicityIds: filter.targetEthnicity.length
          ? getStateValueAsNumArray(filter.targetEthnicity)
          : undefined,
        targetInterestIds: filter.targetInterests.length
          ? getStateValueAsNumArray(filter.targetInterests)
          : undefined,
        targetAgeMin:
          filter.targetAge && filter.targetAge.min.length
            ? +filter.targetAge.min
            : undefined,
        targetAgeMax:
          filter.targetAge && filter.targetAge.max.length
            ? +filter.targetAge.max
            : undefined,
        targetGenderIds: filter.targetGender.length
          ? getStateValueAsNumArray(filter.targetGender)
          : undefined,
        targetLanguageIds: filter.targetLanguage.length
          ? getStateValueAsNumArray(filter.targetLanguage)
          : undefined,
      };

      const { result, meta } = await CampaignAPI.getCampaigns({
        limit: params.limit,
        skip: params.skip,
        ...filterOCParams,
        ...formattedFilterParams,
      });

      setPage(params.page);

      setOngoingCampaigns(result);

      setTotalOCResults(meta.countFiltered);
    },
  });

  const {
    pagesCount: fcPagesCount,
    page: fcPage,
    setTotalResults: setTotalFCResults,
    handlePageChange: handleFCPageChange,
    reload: reloadFC,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const formattedFilterParams = {
        search: filter.search && filter.search.length ? filter.search : '',
        budgetMin:
          filter.budget && filter.budget.min.length
            ? +filter.budget.min
            : undefined,
        budgetMax:
          filter.budget && filter.budget.max.length
            ? +filter.budget.max
            : undefined,
        startDate: filter.startDate || undefined,
        endDate: filter.endDate || undefined,
        influencersMin:
          filter.influencers && filter.influencers.min.length
            ? +filter.influencers.min
            : undefined,
        influencersMax:
          filter.influencers && filter.influencers.max.length
            ? +filter.influencers.max
            : undefined,
        influencersSizeIds: filter.influencerSize.length
          ? getStateValueAsNumArray(filter.influencerSize)
          : undefined,
        postType: filter.postType ? filter.postType.value : undefined,
        clientIndustryIds: filter.industry.length
          ? getStateValueAsNumArray(filter.industry)
          : undefined,
        clientDiseaseAreaIds: filter.clientDiseaseArea.length
          ? getStateValueAsNumArray(filter.clientDiseaseArea)
          : undefined,
        clientCompanyIds: filter.company.length
          ? getStateValueAsNumArray(filter.company)
          : undefined,

        clientIds: filter.client.length
          ? getStateValueAsNumArray(filter.client)
          : undefined,
        ambassadorId: filter.ambassador ? filter.ambassador.value : undefined,
        productIds: filter.product.length
          ? getStateValueAsNumArray(filter.product)
          : undefined,
        targetDiseaseAreaIds: filter.targetDiseaseArea.length
          ? getStateValueAsNumArray(filter.targetDiseaseArea)
          : undefined,
        targetStruggleIds: filter.targetStruggles.length
          ? getStateValueAsNumArray(filter.targetStruggles)
          : undefined,
        targetLocationIds: filter.targetLocation.length
          ? getStateValueAsNumArray(filter.targetLocation)
          : undefined,
        targetEthnicityIds: filter.targetEthnicity.length
          ? getStateValueAsNumArray(filter.targetEthnicity)
          : undefined,
        targetInterestIds: filter.targetInterests.length
          ? getStateValueAsNumArray(filter.targetInterests)
          : undefined,
        targetAgeMin:
          filter.targetAge && filter.targetAge.min.length
            ? +filter.targetAge.min
            : undefined,
        targetAgeMax:
          filter.targetAge && filter.targetAge.max.length
            ? +filter.targetAge.max
            : undefined,
        targetGenderIds: filter.targetGender.length
          ? getStateValueAsNumArray(filter.targetGender)
          : undefined,
        targetLanguageIds: filter.targetLanguage.length
          ? getStateValueAsNumArray(filter.targetLanguage)
          : undefined,
      };

      const { result, meta } = await CampaignAPI.getCampaigns({
        limit: params.limit,
        skip: params.skip,
        ...filterFCParams,
        ...formattedFilterParams,
      });

      setPage(params.page);

      setFinishedCampaigns(result);
      setTotalFCResults(meta.countFiltered);
    },
  });

  const { pagesCount, page, setTotalResults, handlePageChange, reload } =
    usePagination({
      limit: 10,
      page: 1,
      onChange: async (params, setPage) => {
        const formattedFilterParams = {
          search: filter.search && filter.search.length ? filter.search : '',
          budgetMin:
            filter.budget && filter.budget.min.length
              ? +filter.budget.min
              : undefined,
          budgetMax:
            filter.budget && filter.budget.max.length
              ? +filter.budget.max
              : undefined,
          startDate: filter.startDate || undefined,
          endDate: filter.endDate || undefined,
          influencersMin:
            filter.influencers && filter.influencers.min.length
              ? +filter.influencers.min
              : undefined,
          influencersMax:
            filter.influencers && filter.influencers.max.length
              ? +filter.influencers.max
              : undefined,
          influencersSizeIds: filter.influencerSize.length
            ? getStateValueAsNumArray(filter.influencerSize)
            : undefined,
          postType: filter.postType ? filter.postType.value : undefined,
          clientIndustryIds: filter.industry.length
            ? getStateValueAsNumArray(filter.industry)
            : undefined,
          clientDiseaseAreaIds: filter.clientDiseaseArea.length
            ? getStateValueAsNumArray(filter.clientDiseaseArea)
            : undefined,
          clientCompanyIds: filter.company.length
            ? getStateValueAsNumArray(filter.company)
            : undefined,

          clientIds: filter.client.length
            ? getStateValueAsNumArray(filter.client)
            : undefined,
          ambassadorId: filter.ambassador ? filter.ambassador.value : undefined,
          productIds: filter.product.length
            ? getStateValueAsNumArray(filter.product)
            : undefined,
          targetDiseaseAreaIds: filter.targetDiseaseArea.length
            ? getStateValueAsNumArray(filter.targetDiseaseArea)
            : undefined,
          targetStruggleIds: filter.targetStruggles.length
            ? getStateValueAsNumArray(filter.targetStruggles)
            : undefined,
          targetLocationIds: filter.targetLocation.length
            ? getStateValueAsNumArray(filter.targetLocation)
            : undefined,
          targetEthnicityIds: filter.targetEthnicity.length
            ? getStateValueAsNumArray(filter.targetEthnicity)
            : undefined,
          targetInterestIds: filter.targetInterests.length
            ? getStateValueAsNumArray(filter.targetInterests)
            : undefined,
          targetAgeMin:
            filter.targetAge && filter.targetAge.min.length
              ? +filter.targetAge.min
              : undefined,
          targetAgeMax:
            filter.targetAge && filter.targetAge.max.length
              ? +filter.targetAge.max
              : undefined,
          targetGenderIds: filter.targetGender.length
            ? getStateValueAsNumArray(filter.targetGender)
            : undefined,
          targetLanguageIds: filter.targetLanguage.length
            ? getStateValueAsNumArray(filter.targetLanguage)
            : undefined,
        };

        const { result, meta } = await CampaignAPI.getCampaigns({
          limit: params.limit,
          skip: params.skip,
          ...filterIPParams,
          ...formattedFilterParams,
        });

        setPage(params.page);

        // investigate this?
        if (result) {
          reloadOC();
        }

        setInPrepCampaigns(result);
        setTotalResults(meta.countFiltered);
      },
    });

  const [tModal, openTModal, closeTModal] = useModal(false);
  const [oCTModal, openOCTModal, closeOCTModal] = useModal(false);
  const [fcModal, opentFCModal, closeFCModal] = useModal(false);
  const [ccModal, openCcModal, closeCcModal] = useModal(false);

  const [filterOpen, setFilterOpen] = useState(false);

  const [tabs, setTabs] = useState(0);
  const [filterTabs, setFilterTabs] = useState(0);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const toggleIPCampaign = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedIPCampaigns([...checkedIPCampaigns, rowId]);
    } else {
      setCheckedIPCampaigns(checkedIPCampaigns.filter((id) => id !== rowId));
    }
  };

  const toggleAllCheckedIPCampaigns = (checked: boolean) => {
    if (checked) {
      const currentPageIds = inPrepCampaigns.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedIPCampaigns, ...currentPageIds])
      );
      setCheckedIPCampaigns(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = inPrepCampaigns.map((row: any) => row.id);
      const newSelectedRows = checkedIPCampaigns.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedIPCampaigns(newSelectedRows);
    }
  };

  const toggleOCampaign = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedOCampaigns([...checkedOCampaigns, rowId]);
    } else {
      setCheckedOCampaigns(checkedOCampaigns.filter((id) => id !== rowId));
    }
  };

  const toggleAllCheckedOCampaigns = (checked: boolean) => {
    if (checked) {
      const currentPageIds = ongoingCampaigns.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedOCampaigns, ...currentPageIds])
      );
      setCheckedOCampaigns(newSelectedRows);
    } else {
      const currentPageIds = ongoingCampaigns.map((row: any) => row.id);
      const newSelectedRows = checkedOCampaigns.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedOCampaigns(newSelectedRows);
    }
  };

  const toggleFCampaign = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedFCampaigns([...checkedFCampaigns, rowId]);
    } else {
      setCheckedFCampaigns(checkedFCampaigns.filter((id) => id !== rowId));
    }
  };

  const toggleAllCheckedFCampaigns = (checked: boolean) => {
    if (checked) {
      const currentPageIds = finishedCampaigns.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedFCampaigns, ...currentPageIds])
      );
      setCheckedFCampaigns(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = finishedCampaigns.map((row: any) => row.id);
      const newSelectedRows = checkedFCampaigns.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedFCampaigns(newSelectedRows);
    }
  };

  const clearFilters = () => {
    setFilter(initialFilters);
    setFilterCleared(true);
  };

  const handleBulkIPCampaignsRemoval = async () => {
    try {
      await CampaignAPI.deleteManyCampaigns({
        campaignIds: checkedIPCampaigns,
      });
      handlePageChange(1);
      reload();
      setCheckedIPCampaigns([]);

      push('Campaigns successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleBulkOngoingCampaignsRemoval = async () => {
    try {
      await CampaignAPI.deleteManyCampaigns({
        campaignIds: checkedOCampaigns,
      });

      handleOCPageChange(1);
      reloadOC();
      setCheckedOCampaigns([]);

      push('Campaigns successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleBulkFinishedCampaignsRemoval = async () => {
    try {
      await CampaignAPI.deleteManyCampaigns({
        campaignIds: checkedFCampaigns,
      });

      handleFCPageChange(1);
      reloadFC();
      setCheckedFCampaigns([]);

      push('Campaigns successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const getCampaignsOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response = await CampaignAPI.getCampaignsOverTimeData({
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

  const getCampaignsRevenueOverTimeData = async (
    queryParams: any
  ): Promise<any> => {
    try {
      const response = await CampaignAPI.getCampaignsRevenueOverTimeData({
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

  const handleReloadAll = () => {
    reload();
    reloadOC();
    reloadFC();
  };

  const getCampaignGraphDataAsync =
    (status: number, setDataFunction: (data: any) => void, key: string) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getCampaignsOverTimeData({
            status,
            statusAtPointOfTime: true,
            useStrictPeriod: false,
            numberOfPoints: 30,
            graphType: 'cumulative',
            includeData: ['changePercentageMonth'],
          }),
        key
      );

      setDataFunction(result);
    };

  const getCampaignRevenueGraphDataAsync =
    (setDataFunction: (data: any) => void, key: string) => async () => {
      const result = await fetchAndCacheData(
        () =>
          getCampaignsRevenueOverTimeData({
            useStrictPeriod: false,
            numberOfPoints: 30,
            graphType: 'cumulative',
            includeData: ['changePercentageMonth'],
          }),
        key
      );

      setDataFunction(result);
    };

  const handleFilter = () => {
    handleFCPageChange(1);
    handlePageChange(1);
    handleOCPageChange(1);
  };

  const [platformInfluencerSize, setPlatformInfluencerSize] = useState<any>();

  const [clientIndustriesOptions, setClientIndustriesOptions] = useState<any[]>(
    []
  );
  const [clientDiseaseAreasOptions, setClientDiseaseAreasOptions] = useState<
    any[]
  >([]);
  const [clientAmbassadorsOptions, setClientAmbassadorsOptions] = useState<
    any[]
  >([]);
  const [clientCompaniesOptions, setClientCompaniesOptions] = useState<any[]>(
    []
  );
  const [campaignClientsOptions, setCampaignClientsOptions] = useState<any[]>(
    []
  );
  const [clientProductsOptions, setClientProductsOptions] = useState<any>([]);

  const [targetDiseaseAreaOptions, setTargetDiseaseAreaOptions] = useState<
    any[]
  >([]);
  const [targetStrugglesOptions, setTargetStrugglesOptions] = useState<any[]>(
    []
  );
  const [targetLocationsOptions, setTargetLocationsOptions] = useState<any[]>(
    []
  );
  const [targetEthnicityOptions, setTargetEthnicityOptions] = useState<any[]>(
    []
  );
  const [targetInterestsOptions, setTargetInterestsOptions] = useState<any[]>(
    []
  );
  const [targetGenderOptions, setTargetGenderOptions] = useState<any[]>([]);
  const [targetLanguageOptions, setTargetLanguageOptions] = useState<any[]>([]);

  const getInfluencerSizes = async () => {
    const { result } = await EnumsApi.getInfluencerSize();

    setPlatformInfluencerSize(
      result.map((x: any) => ({
        value: x.id,
        label: `${x.name}: ${x.from} - ${x.to}`,
      }))
    );
  };

  const getClientIndustriesOptions = async (s: string = '') => {
    const { result } = await IndustryApi.getIndustries(s);

    setClientIndustriesOptions(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getClientDiseaseAreas = async (s: string = '') => {
    const { result } = await DiseaseAreaAPI.getAll(s);

    setClientDiseaseAreasOptions(
      result.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    );
  };

  const getClientCompanies = async (s: string = '') => {
    const { result } = await CompanyAPI.getAll(s);

    setClientCompaniesOptions(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getCampaignClients = async (s: string = '') => {
    const { result } = await ClientAPI.getClients(s);

    setCampaignClientsOptions(
      result.map((data: any) => ({
        value: data.id,
        label: `${data.firstName} ${data.lastName}`,
      }))
    );
  };

  const getClientAmbassadors = async (s: string = '') => {
    const { result } = await AmbassadorAPI.getAmbassadorSearch(s);

    setClientAmbassadorsOptions(
      result.map((x: any) => ({
        value: x.id,
        label: `${x.firstName} ${x.lastName}`,
      }))
    );
  };

  const getClientProducts = async (s: string = '') => {
    const { result } = await ProductApi.getProducts(s);

    setClientProductsOptions(
      result.map((data: any) => ({
        value: data.id,
        label: data.name,
      }))
    );
  };

  const getTargetDiseaseAreas = async (s: string = '') => {
    const { result } = await DiseaseAreaAPI.getAll(s);

    setTargetDiseaseAreaOptions(
      result.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    );
  };

  const getTargetStruggles = async () => {
    const result = await EnumsApi.getStruggles();

    setTargetStrugglesOptions(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getTargetLocations = async (s: string = '') => {
    const { result } = await LocationAPI.getAll(s);
    setTargetLocationsOptions(
      result.map((data: any) => ({
        value: data.id,
        label: data.country ? `${data.name}, ${data.country.name}` : data.name,
      }))
    );
  };

  const getTargetEthnicities = async () => {
    const result = await EnumsApi.getEthnicities();

    setTargetEthnicityOptions(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getTargetInterests = async () => {
    const result = await EnumsApi.getInterests();

    setTargetInterestsOptions(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getTargetGenders = async () => {
    const result = await EnumsApi.getGenders();

    setTargetGenderOptions(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const getTargetLanguages = async () => {
    const result = await EnumsApi.getLanguages();

    setTargetLanguageOptions(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const debouncedClientIndustries = useDebounce(
    getClientIndustriesOptions,
    250
  );
  const debouncedClientDiseaseAreas = useDebounce(getClientDiseaseAreas, 250);
  const debouncedClientCompanies = useDebounce(getClientCompanies, 250);
  const debouncedCampaignClient = useDebounce(getCampaignClients, 250);

  const debouncedClientAmbassadors = useDebounce(getClientAmbassadors, 250);
  const debouncedClientProducts = useDebounce(getClientProducts, 250);

  const debouncedTargetDiseaseAreas = useDebounce(getTargetDiseaseAreas, 250);
  const debouncedTargetLocations = useDebounce(getTargetLocations, 250);

  useEffect(() => {
    getInfluencerSizes();
    getClientIndustriesOptions();
    getClientDiseaseAreas();
    getClientCompanies();
    getCampaignClients();

    getClientAmbassadors();
    getClientProducts();

    getTargetDiseaseAreas();
    getTargetStruggles();
    debouncedTargetLocations();
    getTargetEthnicities();
    getTargetInterests();
    getTargetGenders();
    getTargetLanguages();

    getCampaignGraphDataAsync(
      0,
      setCampaignsOverTimeData1,
      'setCampaignsOverTimeData1'
    )();
    getCampaignGraphDataAsync(
      1,
      setCampaignsOverTimeData2,
      'setCampaignsOverTimeData2'
    )();
    getCampaignGraphDataAsync(
      2,
      setCampaignsOverTimeData3,
      'setCampaignsOverTimeData3'
    )();
    getCampaignRevenueGraphDataAsync(
      setCampaignsOverTimeData4,
      'setCampaignsOverTimeData4'
    )();
  }, []);

  useEffect(() => {
    if (filterCleared) {
      setFilterCleared(false);
      handleFilter();
    }
  }, [filter, filterCleared]);

  const renderItem = ({ headItem, row }: TTableRenderItemObject) => {
    if (headItem.reference === 'campaignName') {
      return (
        <CampaignModalLink
          onClick={() => {
            setCurrent(row.data.id);
            openCcModal();
          }}
        >
          {row.data.name}
        </CampaignModalLink>
      );
    }

    if (headItem.reference === 'client') {
      return `
        ${row.data.platformProductOrder.client.user.firstName} 
        ${row.data.platformProductOrder.client.user.lastName}
        `;
    }

    if (headItem.reference === 'ambassador') {
      const { client } = row.data.platformProductOrder;
      if (client && client.ambassador && client.ambassador.user) {
        return `${client.ambassador.user.firstName} ${client.ambassador.user.lastName}`;
      }
    }

    if (headItem.reference === 'budget') {
      if (
        row.data.platformProductOrder.currencyId &&
        row.data.platformProductOrder.budget
      ) {
        const currency = formatCurrencyIdToObject(
          row.data.platformProductOrder.currencyId - 1 ?? 2
        );

        if (currency && row.data.platformProductOrder.budget) {
          return `${row.data.platformProductOrder.budget} ${currency!!.short}`;
        }
      }
    }

    if (headItem.reference === 'diseaseArea') {
      if (row.data.platformProductOrder.platformProductOrderDiseaseAreas) {
        const diseaseArea =
          row.data.platformProductOrder.platformProductOrderDiseaseAreas.map(
            (item: any) => item.diseaseArea.name
          );

        return diseaseArea.join(', ');
      }
    }

    if (headItem.reference === 'location') {
      if (row.data.platformProductOrder.platformProductOrderLocations) {
        const locations =
          row.data.platformProductOrder.platformProductOrderLocations.map(
            (item: any) => {
              if (item.location.country && item.location.country.name) {
                return `${item.location.name} (${item.location.country.name})`;
              }
              return item.location.name;
            }
          );

        return locations.join(', ');
      }
    }

    if (headItem.reference === 'product') {
      if (row.data.platformProductOrder.platformProductOrderLocations) {
        const locations = row.data.products.map(
          (item: any) => item.product.name
        );

        return locations.join(', ');
      }
    }

    if (headItem.reference === 'struggles') {
      if (row.data.platformProductOrder.platformProductOrderStruggles) {
        const struggles =
          row.data.platformProductOrder.platformProductOrderStruggles.map(
            (item: any) => item.struggle.name
          );

        return struggles.join(', ');
      }
    }

    if (headItem.reference === 'influencersNumber') {
      if (row.data.influencersCount) {
        return row.data.influencersCount;
      }
    }

    if (headItem.reference === 'report') {
      if (row.data.report) {
        return row.data.report.name;
      }
    }

    if (headItem.reference === 'company') {
      if (row.data.platformProductOrder.client.company.name) {
        return row.data.platformProductOrder.client.company.name;
      }
    }

    if (headItem.reference === 'ethnicity') {
      if (row.data.platformProductOrder.platformProductOrderEthnicities) {
        const ethnicities =
          row.data.platformProductOrder.platformProductOrderEthnicities.map(
            (item: any) => item.ethnicity.name
          );
        return ethnicities.join(', ');
      }
    }

    if (headItem.reference === 'interests') {
      if (row.data.platformProductOrder.platformProductOrderInterests) {
        const interests =
          row.data.platformProductOrder.platformProductOrderInterests.map(
            (item: any) => item.interest.name
          );
        return interests.join(', ');
      }
    }

    if (headItem.reference === 'startDate') {
      if (row.data.dateStart) {
        return moment(row.data.dateStart).format('DD/MM/YYYY');
      }
    }

    if (headItem.reference === 'endDate') {
      if (row.data.dateEnd) {
        return moment(row.data.dateEnd).format('DD/MM/YYYY');
      }
    }

    if (headItem.reference === 'influencerSize') {
      if (row.data.campaignInfluencersSizes) {
        const influencerSizes = row.data.campaignInfluencersSizes.map(
          (item: any) =>
            `${item.influencerSize.name}: ${item.influencerSize.from} - ${item.influencerSize.to}`
        );

        return influencerSizes.join(', ');
      }
    }

    if (headItem.reference === 'ageMin') {
      if (row.data.ageMin) {
        return row.data.ageMin;
      }
    }

    if (headItem.reference === 'ageMax') {
      if (row.data.ageMax) {
        return row.data.ageMax;
      }
    }

    if (headItem.reference === 'gender') {
      if (row.data.platformProductOrder.platformProductOrderGenders) {
        const genders =
          row.data.platformProductOrder.platformProductOrderGenders.map(
            (item: any) => item.name
          );

        return genders.join(', ');
      }
    }

    if (headItem.reference === 'socialMediaPlatform') {
      if (row.data.socialPlatformId) {
        return 'Instagram';
      }
    }

    if (headItem.reference === 'postType') {
      if (row.data.postType) {
        return row.data.postType.name;
      }
    }

    if (headItem.reference === 'website') {
      if (row.data.clientCompanyWebsite) {
        return row.data.clientCompanyWebsite;
      }
    }

    if (headItem.reference === 'language') {
      if (
        row.data.platformProductOrder &&
        row.data.platformProductOrder.platformProductOrderLanguages &&
        row.data.platformProductOrder.platformProductOrderLanguages.length
      ) {
        const languageCommaSeparatedString =
          row.data.platformProductOrder.platformProductOrderLanguages
            .map((language: any) => language.name)
            .join(', ');
        const formattedElipsisString = formatLongString(
          languageCommaSeparatedString,
          50
        );
        return (
          <Tooltip
            style={{ cursor: 'pointer' }}
            title={<TableTooltip>{languageCommaSeparatedString}</TableTooltip>}
          >
            <span>{formattedElipsisString}</span>
          </Tooltip>
        );
      }
    }

    if (headItem.reference === 'actions') {
      if (row.data.platformProductOrder.status === 0) {
        return (
          <InPreparationActions
            data={row.data}
            reload={() => handleReloadAll()}
          />
        );
      }
      return (
        <InPreparationActions
          data={row.data}
          reload={() => handleReloadAll()}
        />
      );
    }

    return '';
  };

  const [menuI, openI, setOpenI, buttonRef, position] = useMenu(false);
  const [menuOC, openOC, setOpenOC, buttonOCRef, positionOC] = useMenu(false);
  const [menuFC, openFC, setOpenFC, buttonFCRef, positionFC] = useMenu(false);

  const handleMenuI = () => {
    setOpenI(!openI);
  };
  const handleMenuOC = () => {
    setOpenOC(!openOC);
  };
  const handleMenuFC = () => {
    setOpenFC(!openFC);
  };
  const bulkActions = [
    // {
    //   icon: <StartIcon />,
    //   label: 'Start',
    //   action: () => {},
    // },
    // {
    //   icon: <InfoIcon />,
    //   label: 'Info',
    //   action: () => {},
    // },
    // {
    //   icon: <ManageIcon />,
    //   label: 'Manage',
    //   action: () => {},
    // },
    // {
    //   icon: <ContactIcon />,
    //   label: 'Contact',
    //   action: () => {},
    // },
    // {
    //   icon: <EditIcon />,
    //   label: 'Note',
    //   action: () => {},
    // },
    // {
    //   icon: <ScheduleIcon />,
    //   label: 'Schedule',
    //   action: () => {},
    // },
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openTModal();
        handleMenuI();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        if (checkedIPCampaigns.length) {
          openRemoveBulkIPCampaignsModal();
        } else {
          push('Please select campaigns you want to delete', {
            variant: 'warning',
          });
        }
        handleMenuI();
      },
    },
  ];

  const handleCampaignsReload = async () => {
    reload();
    reloadOC();
  };

  const bulkOCActions = [
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openOCTModal();
        handleMenuOC();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        if (checkedOCampaigns.length) {
          openRemoveBulkOCampaignsModal();
        } else {
          push('Please select campaigns you want to delete', {
            variant: 'warning',
          });
        }
        handleMenuOC();
      },
    },
  ];

  const bulkFCActions = [
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        opentFCModal();
        handleMenuFC();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        if (checkedFCampaigns.length) {
          openRemoveBulkFCampaignsModal();
        } else {
          push('Please select campaigns you want to delete', {
            variant: 'warning',
          });
        }
        handleMenuFC();
      },
    },
  ];

  return (
    <CampaignsPageMain>
      <CampaignsPageCharts>
        <CardWrapper>
          <CardWithChart
            title="In Preparation"
            icon={<InpreparationIcon />}
            smallIcon={<CampaignsSmallIcon />}
            percent={
              campaignsOverTime1?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              campaignsOverTime1?.data
                ? campaignsOverTime1?.data[campaignsOverTime1.data.length - 1]
                    .value
                : 0
            }
            chartData={{
              values:
                campaignsOverTime1?.data &&
                campaignsOverTime1.data.map((element: any) => element.value),
              labels:
                campaignsOverTime1?.data &&
                campaignsOverTime1?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Ongoing"
            icon={<OngoingIcon />}
            smallIcon={<CampaignsSmallIcon />}
            percent={
              campaignsOverTime2?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              campaignsOverTime2?.data
                ? campaignsOverTime2?.data[campaignsOverTime2.data.length - 1]
                    .value
                : 0
            }
            chartData={{
              values:
                campaignsOverTime2?.data &&
                campaignsOverTime2.data.map((element: any) => element.value),
              labels:
                campaignsOverTime2?.data &&
                campaignsOverTime2?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Finished"
            icon={<FinishedIcon />}
            smallIcon={<CampaignsSmallIcon />}
            percent={
              campaignsOverTime3?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              campaignsOverTime3?.data
                ? campaignsOverTime3?.data[campaignsOverTime3.data.length - 1]
                    .value
                : 0
            }
            chartData={{
              values:
                campaignsOverTime3?.data &&
                campaignsOverTime3.data.map((element: any) => element.value),
              labels:
                campaignsOverTime3?.data &&
                campaignsOverTime3?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Revenue"
            icon={<RevenueIcon />}
            smallIcon={<CampaignsSmallIcon />}
            percent={
              campaignsOverTime4?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              campaignsOverTime4?.data
                ? campaignsOverTime4?.data[campaignsOverTime4.data.length - 1]
                    .value
                : 0
            }
            chartData={{
              values:
                campaignsOverTime4?.data &&
                campaignsOverTime4.data.map((element: any) => element.value),
              labels:
                campaignsOverTime4?.data &&
                campaignsOverTime4?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
      </CampaignsPageCharts>
      {/* On 21.08.2023 It was requested that this should be removed */}
      {/* {/* <CampaignsPageCharts>
        <CardWithProgress
          title="Company"
          icon={<CampaignsCompanyIcon />}
          progressData={[
            {
              icon: 'TS',
              percent: 100,
              title: 'Test',
            },
            {
              icon: 'TS',
              percent: 38,
              title: 'Test',
            },
            {
              icon: 'TS',
              percent: 57,
              title: 'Test',
            },
            {
              icon: 'TS',
              percent: 57,
              title: 'Test',
            },
            {
              icon: 'TS',
              percent: 57,
              title: 'Test',
            },
          ]}
        />
        <CardWithProgress
          title="Location"
          icon={<CampaignsLocationIcon />}
          progressData={[
            {
              icon: 'US',
              percent: 100,
              title: 'United States',
            },
            {
              icon: 'US',
              percent: 38,
              title: 'United States',
            },
            {
              icon: 'US',
              percent: 57,
              title: 'United States',
            },
          ]}
        />
        <CardWithProgress
          title="Disease Area"
          icon={<CampaignsDiseaseIcon />}
          progressData={[
            {
              icon: 'BC',
              percent: 100,
              title: 'Brain Cancer',
            },
            {
              icon: 'BC',
              percent: 38,
              title: 'Brain Cancer',
            },
            {
              icon: 'BC',
              percent: 57,
              title: 'Brain Cancer',
            },
          ]}
        />
        <CardWithProgress
          title="Struggle"
          icon={<CampaignsStruggleIcon />}
          progressData={[
            {
              icon: 'MP',
              percent: 100,
              title: 'Muscle Pain',
            },
            {
              icon: 'MP',
              percent: 38,
              title: 'Muscle Pain',
            },
            {
              icon: 'MP',
              percent: 57,
              title: 'Muscle Pain',
            },
          ]}
        />
      </CampaignsPageCharts> */}
      <CardWithText
        title="Campaigns"
        actions={[
          <Button
            color={filterOpen ? 'secondary' : 'default'}
            variant="contained"
            onClick={toggleFilter}
            startIcon={<SlidersHorizontalIcon width="18" height="18" />}
          >
            Filters
          </Button>,
          <Button color="default" variant="contained" onClick={openEcModal}>
            Export
          </Button>,
          <Button color="primary" variant="contained" onClick={openAcModal}>
            Create Campaign
          </Button>,
        ]}
      >
        <Stack>
          <Collapse removeGap in={filterOpen}>
            <CampaignsPageFilter>
              <Tabs
                tabs={['Campaign', 'Client', 'Target']}
                value={filterTabs}
                onValue={setFilterTabs}
              />
              {filterTabs === 0 && (
                <Grid columns={4}>
                  <Input
                    type="text"
                    label="Search"
                    placeholder="Please Enter"
                    value={filter.search}
                    onValue={(search) => setFilter({ ...filter, search })}
                  />
                  <Input
                    type="min-max"
                    label="Budget"
                    value={filter.budget}
                    onValue={(budget) => setFilter({ ...filter, budget })}
                  />
                  <Input
                    type="date"
                    label="Start Date"
                    placeholder="Please Select"
                    value={filter.startDate}
                    onValue={(startDate) => setFilter({ ...filter, startDate })}
                  />
                  <Input
                    type="date"
                    label="End Date"
                    placeholder="Please Select"
                    value={filter.endDate}
                    onValue={(endDate) => setFilter({ ...filter, endDate })}
                  />
                  <Input
                    type="min-max"
                    label="Influencers (Number)"
                    value={filter.influencers}
                    onValue={(influencers) =>
                      setFilter({ ...filter, influencers })
                    }
                  />
                  <Input
                    type="multiselect"
                    label="Influencer Size"
                    placeholder="Please Select"
                    value={filter.influencerSize}
                    onValue={(influencerSize) =>
                      setFilter({ ...filter, influencerSize })
                    }
                    options={platformInfluencerSize}
                  />
                  {/* <Input
                    type="select"
                    label="Social Media Platform"
                    placeholder="Please Select"
                    value={filter.socialMedia}
                    onValue={(socialMedia) =>
                      setFilter({ ...filter, socialMedia })
                    }
                  /> */}
                  <Input
                    type="select"
                    label="Post Type"
                    placeholder="Please Select"
                    value={filter.postType}
                    onValue={(postType) => setFilter({ ...filter, postType })}
                    options={[
                      {
                        value: 0,
                        label: 'Post',
                      },
                      {
                        value: 1,
                        label: 'Reel',
                      },
                      {
                        value: 2,
                        label: 'Story',
                      },
                    ]}
                  />
                  {/* <Input
                    type="select"
                    label="Report"
                    placeholder="Please Select"
                    value={filter.report}
                    onValue={(report) => setFilter({ ...filter, report })}
                  /> */}
                  {/* <Input
                    type="select"
                    label="Labels"
                    placeholder="Please Select"
                    value={filter.labels}
                    onValue={(labels) => setFilter({ ...filter, labels })}
                  />
                  <Input
                    type="select"
                    label="Schedule"
                    placeholder="Please Select"
                    value={filter.schedule}
                    onValue={(schedule) => setFilter({ ...filter, schedule })}
                  /> */}
                </Grid>
              )}
              {filterTabs === 1 && (
                <Grid columns={4}>
                  <Input
                    type="multiselect"
                    label="Industry"
                    placeholder="Please Select"
                    value={filter.industry}
                    onValue={(industry) => setFilter({ ...filter, industry })}
                    options={clientIndustriesOptions}
                    onSearch={debouncedClientIndustries}
                  />
                  <Input
                    type="multiselect"
                    label="Disease Area"
                    placeholder="Please Select"
                    value={filter.clientDiseaseArea}
                    onValue={(clientDiseaseArea) =>
                      setFilter({ ...filter, clientDiseaseArea })
                    }
                    options={clientDiseaseAreasOptions}
                    onSearch={debouncedClientDiseaseAreas}
                  />
                  <Input
                    type="multiselect"
                    label="Company"
                    placeholder="Please Select"
                    value={filter.company}
                    onValue={(company) => setFilter({ ...filter, company })}
                    options={clientCompaniesOptions}
                    onSearch={debouncedClientCompanies}
                  />
                  <Input
                    type="multiselect"
                    label="Client"
                    placeholder="Please Select"
                    value={filter.client}
                    onValue={(client) => setFilter({ ...filter, client })}
                    options={campaignClientsOptions}
                    onSearch={debouncedCampaignClient}
                  />
                  <Input
                    type="select"
                    label="Ambassador"
                    placeholder="Please Select"
                    value={filter.ambassador}
                    onValue={(ambassador) =>
                      setFilter({ ...filter, ambassador })
                    }
                    options={clientAmbassadorsOptions}
                    onSearch={debouncedClientAmbassadors}
                  />
                  <Input
                    type="multiselect"
                    label="Product"
                    placeholder="Please Select"
                    value={filter.product}
                    onValue={(product) => setFilter({ ...filter, product })}
                    options={clientProductsOptions}
                    onSearch={debouncedClientProducts}
                  />
                </Grid>
              )}
              {filterTabs === 2 && (
                <Grid columns={4}>
                  <Input
                    type="multiselect"
                    label="Disease Area"
                    placeholder="Please Select"
                    value={filter.targetDiseaseArea}
                    onValue={(targetDiseaseArea) =>
                      setFilter({ ...filter, targetDiseaseArea })
                    }
                    options={targetDiseaseAreaOptions}
                    onSearch={debouncedTargetDiseaseAreas}
                  />
                  <Input
                    type="multiselect"
                    label="Struggles"
                    placeholder="Please Select"
                    value={filter.targetStruggles}
                    onValue={(targetStruggles) =>
                      setFilter({ ...filter, targetStruggles })
                    }
                    options={targetStrugglesOptions}
                  />
                  <Input
                    type="multiselect"
                    label="Location"
                    placeholder="Please Select"
                    value={filter.targetLocation}
                    onValue={(targetLocation) =>
                      setFilter({ ...filter, targetLocation })
                    }
                    options={targetLocationsOptions}
                    onSearch={debouncedTargetLocations}
                  />
                  <Input
                    type="multiselect"
                    label="Ethnicity"
                    placeholder="Please Select"
                    value={filter.targetEthnicity}
                    onValue={(targetEthnicity) =>
                      setFilter({ ...filter, targetEthnicity })
                    }
                    options={targetEthnicityOptions}
                  />
                  <Input
                    type="multiselect"
                    label="Interests"
                    placeholder="Please Select"
                    value={filter.targetInterests}
                    onValue={(targetInterests) =>
                      setFilter({ ...filter, targetInterests })
                    }
                    options={targetInterestsOptions}
                  />
                  <Input
                    type="min-max"
                    label="Age"
                    value={filter.targetAge}
                    onValue={(targetAge) => setFilter({ ...filter, targetAge })}
                  />
                  <Input
                    type="multiselect"
                    label="Gender"
                    placeholder="Please Select"
                    value={filter.targetGender}
                    onValue={(targetGender) =>
                      setFilter({ ...filter, targetGender })
                    }
                    options={targetGenderOptions}
                  />
                  <Input
                    type="multiselect"
                    label="Language"
                    placeholder="Please Select"
                    value={filter.targetLanguage}
                    onValue={(targetLanguage) =>
                      setFilter({ ...filter, targetLanguage })
                    }
                    options={targetLanguageOptions}
                  />
                </Grid>
              )}
              <CampaignsPageFilterActions direction="horizontal">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => handleFilter()}
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
              </CampaignsPageFilterActions>
            </CampaignsPageFilter>
          </Collapse>
          <Tabs
            value={tabs}
            onValue={setTabs}
            tabs={['In Preparation', 'Ongoing', 'Finished']}
          />

          {tabs === 0 && (
            <>
              <NewCheckboxTable
                head={DCampaignsAdminHead}
                items={inPrepCampaigns}
                renderItem={renderItem}
                checkedRows={checkedIPCampaigns}
                onSingleSelect={toggleIPCampaign}
                onSelectAll={toggleAllCheckedIPCampaigns}
                tableColModal={tModal}
                closeTableColModal={closeTModal}
                renderElements={
                  <>
                    <ISpan onClick={handleMenuI} ref={buttonRef}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openI && (
                      <CustomActionsMenu
                        position={position}
                        items={bulkActions}
                        ref={menuI}
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
          )}
          {tabs === 1 && (
            <>
              <NewCheckboxTable
                head={DCampaignsAdminHead}
                items={ongoingCampaigns}
                renderItem={renderItem}
                checkedRows={checkedOCampaigns}
                onSingleSelect={toggleOCampaign}
                onSelectAll={toggleAllCheckedOCampaigns}
                tableColModal={oCTModal}
                closeTableColModal={closeOCTModal}
                renderElements={
                  <>
                    <ISpan onClick={handleMenuOC} ref={buttonOCRef}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openOC && (
                      <CustomActionsMenu
                        position={positionOC}
                        items={bulkFCActions}
                        ref={menuOC}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handleOCPageChange(x)}
                page={oCPage}
                count={oCPageCount}
              />
            </>
          )}
          {tabs === 2 && (
            <>
              <NewCheckboxTable
                head={DCampaignsAdminHead}
                items={finishedCampaigns}
                renderItem={renderItem}
                checkedRows={checkedFCampaigns}
                onSingleSelect={toggleFCampaign}
                onSelectAll={toggleAllCheckedFCampaigns}
                tableColModal={fcModal}
                closeTableColModal={closeFCModal}
                renderElements={
                  <>
                    <ISpan onClick={handleMenuFC} ref={buttonFCRef}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openFC && (
                      <CustomActionsMenu
                        position={positionFC}
                        items={bulkOCActions}
                        ref={menuFC}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handleFCPageChange(x)}
                page={fcPage}
                count={fcPagesCount}
              />
            </>
          )}
          {/* Saving for future reference */}
          {/* <Stack direction="horizontal">
            <Button variant="contained" color="primary" onClick={openNcModal}>
              Note Campaign
            </Button>
            <Button variant="contained" color="primary" onClick={openScModal}>
              Schedule Campaign
            </Button>
          </Stack>
          <Stack direction="horizontal">
            <Button variant="contained" color="primary" onClick={handleMenuI}>
              Inprogress action
            </Button>
            <Button variant="contained" color="primary" onClick={handleMenuO}>
              Ongoing action
            </Button>
            <Button variant="contained" color="primary" onClick={handleMenuF}>
              Finished action
            </Button>
            <Button variant="contained" color="primary" onClick={handleMenuA}>
              Archived action
            </Button>
            <Button variant="contained" color="primary" onClick={handleMenuIn}>
              Influencer action
            </Button>
          </Stack> */}
        </Stack>
        {/* Saving for future reference */}
        {/* {openI && (
          <Menu
            items={[
              {
                icon: <StartIcon />,
                label: 'Start',
                action: () => {},
              },
              {
                icon: <InfoIcon />,
                label: 'Info',
                action: () => {},
              },
              {
                icon: <ManageIcon />,
                label: 'Manage',
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
            ref={menuI}
          />
        )}
        {openO && (
          <Menu
            items={[
              {
                icon: <FinishIcon />,
                label: 'Finish',
                action: () => {},
              },
              {
                icon: <InfoIcon />,
                label: 'Info',
                action: () => {},
              },
              {
                icon: <ManageIcon />,
                label: 'Manage',
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
            ref={menuO}
          />
        )}
        {openF && (
          <Menu
            items={[
              {
                icon: <ReportIcon />,
                label: 'Report',
                action: () => {},
              },
              {
                icon: <InfoIcon />,
                label: 'Info',
                action: () => {},
              },
              {
                icon: <ManageIcon />,
                label: 'Manage',
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
            ref={menuF}
          />
        )}
        {openA && (
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
            ref={menuA}
          />
        )}
        {openIn && (
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
            ref={menuIn}
          />
        )} */}
      </CardWithText>
      {removeBulkIPCampaignsModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkIPCampaignsModal()}
          handleAction={handleBulkIPCampaignsRemoval}
        />
      )}
      {removeBulkOCampaignsModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkOCampaignsModal()}
          handleAction={handleBulkOngoingCampaignsRemoval}
        />
      )}
      {removeBulkFCampaignsModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkFCampaignsModal()}
          handleAction={handleBulkFinishedCampaignsRemoval}
        />
      )}
      {acModal && (
        <AddCampaignModal
          onClose={closeAcModal}
          refresh={handleCampaignsReload}
        />
      )}
      {ecModal && (
        <ExportCampaignsModal
          onClose={closeEcModal}
          checkedIPCampaigns={checkedIPCampaigns}
          checkedOCampaigns={checkedOCampaigns}
          checkedFCampaigns={checkedFCampaigns}
        />
      )}
      {scModal && <ScheduleCampaignModal onClose={closeScModal} />}
      {ncModal && <NoteCampaignsModal onClose={closeNcModal} />}
      {ccModal && (
        <CreatedCampaignModal
          id={current.toString()}
          onClose={closeCcModal}
          reload={reload}
        />
      )}
    </CampaignsPageMain>
  );
};

export default CampaignsPage;
