import React, { useEffect, useState } from 'react';
import {
  SurveysPageMain,
  SurveysPageCharts,
  SurveysPageFilter,
  SurveysPageFilterActions,
} from 'features/surveys/styles';
import {
  CardWithChart,
  CardWithText,
  Menu,
  CheckboxTable,
  Tabs,
  NewCheckboxTable,
} from 'components/custom';
import {
  ContactIcon,
  DeleteIcon,
  EditIcon,
  FinishedIcon,
  FinishIcon,
  InfoIcon,
  InpreparationIcon,
  ManageIcon,
  OngoingIcon,
  RevenueIcon,
  ScheduleIcon,
  SlidersHorizontalIcon,
  SurveysSmallIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { Button, Input, InputGroup, Pagination } from 'components/ui';
import { Grid, Stack } from 'components/system';
import { Collapse, Tooltip } from '@mui/material';
import { DGenerateSurveyFilter } from 'features/surveys/data';
import { TTableRenderItemObject } from 'components/custom/table/types';
import {
  ExportSurveysModal,
  CreateSurveysModal,
  SurveyInfoModal,
} from 'features/surveys/role/admin/elements';
import {
  useDebounce,
  useMenu,
  useModal,
  usePagination,
  useSnackbar,
} from 'hooks';
import { useRouter } from 'next/router';
import {
  AmbassadorAPI,
  ClientAPI,
  CompanyAPI,
  DiseaseAreaAPI,
  EnumsApi,
  IndustryApi,
  LocationAPI,
  ProductApi,
  SurveyAPI,
} from 'api';
import moment from 'moment';
import { BackupTableRounded } from '@mui/icons-material';
import { formatLongString } from 'utilities/string-converter';
import { fetchAndCacheData } from 'utilities/local-storage';
import InPreparationActions from './elements/inpreparation-actions';
import { IPSurveysAdminHead } from './data';
import {
  ISpan,
  ActionsMenu as CustomActionsMenu,
  TableTooltip,
  CardWrapper,
  SurveyModalLink,
} from './styles';
import PromptModal from './elements/prompt-modal';
import CreatedSurveysModal from './elements/created-surveys-modal';

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
  participants: IMinMaxField;
  questions: IMinMaxField;
  questionCredit: IMinMaxField;
  surveyType: ISelectedField | null;

  industry: ISelectedField[];
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

const SurveyPage = () => {
  const initialFilters: IFilterProps = {
    search: '',
    budget: {
      min: '',
      max: '',
    },
    startDate: null,
    endDate: null,
    participants: {
      min: '',
      max: '',
    },
    questions: {
      min: '',
      max: '',
    },
    questionCredit: {
      min: '',
      max: '',
    },
    surveyType: null,

    industry: [],
    company: [],
    client: [],
    ambassador: null,
    product: [],

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

  const [filterCleared, setFilterCleared] = useState(false);

  const [filter, setFilter] = useState<IFilterProps>(initialFilters);
  const [filterParams, setFilterParams] = useState({
    status: 0,
  });

  const [filterOSParams, setFilterOSParams] = useState({
    status: 1,
  });

  const [filterFSParams, setFilterFSParams] = useState({
    status: 2,
  });

  const router = useRouter();

  const [filterOpen, setFilterOpen] = useState(false);

  const [tabsValue, setTabsValue] = useState(0);

  const [tabs, setTabs] = useState(0);

  const [surveys, setSurveys] = useState<any>([]);
  const [checkedSurveys, setCheckedSurveys] = useState<number[]>([]);

  const [ongoingSurveys, setOngoingSurveys] = useState<any>([]);
  const [checkedOngoingSurveys, setCheckedOngoingSurveys] = useState<number[]>(
    []
  );

  const [finishedSurveys, setFinishedSurveys] = useState<any>([]);
  const [checkedFinishedSurveys, setCheckedFinishedSurveys] = useState<
    number[]
  >([]);
  const [current, setCurrent] = useState(-1);

  // In Preparation Table modal
  const [tModal, openTModal, closeTModal] = useModal(false);
  // Ongoing Surveys table modal
  const [oSModal, openOSModal, closeOSModal] = useModal(false);
  const [fSModal, openFSModal, closeFSModal] = useModal(false);

  const [esModal, openEsModal, closeEsModal] = useModal(false);
  const [csModal, openCsModal, closeCsModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [ccModal, openCcModal, closeCcModal] = useModal(false);

  const { push } = useSnackbar();

  const [
    removeBulkSurveysModal,
    openRemoveBulkSurveysModal,
    closeRemoveBulkSurveysModal,
  ] = useModal(false);

  const [
    removeBulkOngoingSurveysModal,
    openRemoveBulkOngoingSurveysModal,
    closeRemoveBulkOngoingSurveysModal,
  ] = useModal(false);

  const [
    removeBulkFinishedSurveysModal,
    openRemoveBulkFinishedSurveysModal,
    closeRemoveBulkFinishedSurveysModal,
  ] = useModal(false);

  const [surveysOverTime1, setSurveysOverTimeData1] = useState<any>([]);
  const [surveysOverTime2, setSurveysOverTimeData2] = useState<any>([]);
  const [surveysOverTime3, setSurveysOverTimeData3] = useState<any>([]);
  const [surveysOverTime4, setSurveysOverTimeData4] = useState<any>([]);

  const getSurveysOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response = await SurveyAPI.getSurveyOvertimeData({
        ...filterParams,
        ...queryParams,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      throw new Error('Error: Failed to fetch data!');
    }
  };

  const getSurveysRevenueOverTimeData = async (
    queryParams: any
  ): Promise<any> => {
    try {
      const response = await SurveyAPI.getSurveyRevenueOvertimeData({
        ...filterParams,
        ...queryParams,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      throw new Error('Error: Failed to fetch data!');
    }
  };

  const getSurveyGraphDataAsync =
    (status: number, setDataFunction: (data: any) => void, key: string) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getSurveysOverTimeData({
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

  const getSurveyRevenueGraphDataAsync =
    (setDataFunction: (data: any) => void, key: string) => async () => {
      const result = await fetchAndCacheData(
        () =>
          getSurveysRevenueOverTimeData({
            useStrictPeriod: false,
            numberOfPoints: 30,
            graphType: 'cumulative',
            includeData: ['changePercentageMonth'],
          }),
        key
      );

      setDataFunction(result);
    };

  const [clientIndustriesOptions, setClientIndustriesOptions] = useState<any[]>(
    []
  );

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

  const getClientIndustriesOptions = async (s: string = '') => {
    const { result } = await IndustryApi.getIndustries(s);

    setClientIndustriesOptions(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
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
  const debouncedClientCompanies = useDebounce(getClientCompanies, 250);
  const debouncedCampaignClient = useDebounce(getCampaignClients, 250);

  const debouncedClientAmbassadors = useDebounce(getClientAmbassadors, 250);
  const debouncedClientProducts = useDebounce(getClientProducts, 250);

  const debouncedTargetDiseaseAreas = useDebounce(getTargetDiseaseAreas, 250);
  const debouncedTargetLocations = useDebounce(getTargetLocations, 250);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(initialFilters);
    setFilterCleared(true);
  };

  const toggleSurvey = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedSurveys([...checkedSurveys, rowId]);
    } else {
      setCheckedSurveys(checkedSurveys.filter((id) => id !== rowId));
    }
  };

  const toggleOngoingSurvey = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedOngoingSurveys([...checkedOngoingSurveys, rowId]);
    } else {
      setCheckedOngoingSurveys(
        checkedOngoingSurveys.filter((id) => id !== rowId)
      );
    }
  };

  const toggleFinishedSurvey = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedFinishedSurveys([...checkedFinishedSurveys, rowId]);
    } else {
      setCheckedFinishedSurveys(
        checkedFinishedSurveys.filter((id) => id !== rowId)
      );
    }
  };

  const toggleAllCheckedSurveys = (checked: boolean) => {
    if (checked) {
      const currentPageIds = surveys.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedSurveys, ...currentPageIds])
      );
      setCheckedSurveys(newSelectedRows);
    } else {
      const currentPageIds = surveys.map((row: any) => row.id);
      const newSelectedRows = checkedSurveys.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedSurveys(newSelectedRows);
    }
  };

  const toggleAllCheckedOngoingSurveys = (checked: boolean) => {
    if (checked) {
      const currentPageIds = ongoingSurveys.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedOngoingSurveys, ...currentPageIds])
      );
      setCheckedOngoingSurveys(newSelectedRows);
    } else {
      const currentPageIds = ongoingSurveys.map((row: any) => row.id);
      const newSelectedRows = checkedOngoingSurveys.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedOngoingSurveys(newSelectedRows);
    }
  };

  const toggleAllCheckedFinishedSurveys = (checked: boolean) => {
    if (checked) {
      const currentPageIds = finishedSurveys.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedFinishedSurveys, ...currentPageIds])
      );
      setCheckedFinishedSurveys(newSelectedRows);
    } else {
      const currentPageIds = finishedSurveys.map((row: any) => row.id);
      const newSelectedRows = checkedFinishedSurveys.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedFinishedSurveys(newSelectedRows);
    }
  };

  const [menuIP, openIP, setOpenIP, buttonIpRef, ipPosition] = useMenu(false);
  const [menuOS, openOS, setOpenOS, buttonOsRef, oSPosition] = useMenu(false);
  const [menuFS, openFS, setOpenFS, buttonFsRef, fSPosition] = useMenu(false);

  const handleMenuIP = () => {
    setOpenIP(!openIP);
  };

  const handleMenuOS = () => {
    setOpenOS(!openOS);
  };

  const handleMenuFS = () => {
    setOpenFS(!openOS);
  };

  const [menuO, openO, setOpenO] = useMenu(false);

  const [menuF, openF, setOpenF] = useMenu(false);

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
          participantsMin:
            filter.participants && filter.participants.min.length
              ? +filter.participants.min
              : undefined,
          participantsMax:
            filter.participants && filter.participants.max.length
              ? +filter.participants.max
              : undefined,
          questionsMin:
            filter.questions && filter.questions.min.length
              ? +filter.questions.min
              : undefined,
          questionsMax:
            filter.questions && filter.questions.max.length
              ? +filter.questions.max
              : undefined,
          questionCreditMin:
            filter.questionCredit && filter.questionCredit.min.length
              ? +filter.questionCredit.min
              : undefined,
          questionCreditMax:
            filter.questionCredit && filter.questionCredit.max.length
              ? +filter.questionCredit.max
              : undefined,

          surveyType: filter.surveyType ? filter.surveyType.value : undefined,
          clientIndustryIds: filter.industry.length
            ? getStateValueAsNumArray(filter.industry)
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

        const { result, meta } = await SurveyAPI.getSurveys({
          limit: params.limit,
          skip: params.skip,
          ...filterParams,
          ...formattedFilterParams,
        });

        setPage(params.page);

        setSurveys(result);
        setTotalResults(meta.countFiltered);
      },
    });

  const {
    pagesCount: pagesOSCount,
    page: osPage,
    setTotalResults: setTotalOSResults,
    handlePageChange: handleOSPageChange,
    reload: reloadOs,
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
        participantsMin:
          filter.participants && filter.participants.min.length
            ? +filter.participants.min
            : undefined,
        participantsMax:
          filter.participants && filter.participants.max.length
            ? +filter.participants.max
            : undefined,
        questionsMin:
          filter.questions && filter.questions.min.length
            ? +filter.questions.min
            : undefined,
        questionsMax:
          filter.questions && filter.questions.max.length
            ? +filter.questions.max
            : undefined,
        questionCreditMin:
          filter.questionCredit && filter.questionCredit.min.length
            ? +filter.questionCredit.min
            : undefined,
        questionCreditMax:
          filter.questionCredit && filter.questionCredit.max.length
            ? +filter.questionCredit.max
            : undefined,

        surveyType: filter.surveyType ? filter.surveyType.value : undefined,
        clientIndustryIds: filter.industry.length
          ? getStateValueAsNumArray(filter.industry)
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
      const { result, meta } = await SurveyAPI.getSurveys({
        limit: params.limit,
        skip: params.skip,
        ...filterOSParams,
        ...formattedFilterParams,
      });

      setPage(params.page);

      setOngoingSurveys(result);
      setTotalOSResults(meta.countFiltered);
    },
  });

  const {
    pagesCount: pagesFSCount,
    page: fsPage,
    setTotalResults: setTotalFSResults,
    handlePageChange: handleFSPageChange,
    reload: reloadFs,
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
        participantsMin:
          filter.participants && filter.participants.min.length
            ? +filter.participants.min
            : undefined,
        participantsMax:
          filter.participants && filter.participants.max.length
            ? +filter.participants.max
            : undefined,
        questionsMin:
          filter.questions && filter.questions.min.length
            ? +filter.questions.min
            : undefined,
        questionsMax:
          filter.questions && filter.questions.max.length
            ? +filter.questions.max
            : undefined,
        questionCreditMin:
          filter.questionCredit && filter.questionCredit.min.length
            ? +filter.questionCredit.min
            : undefined,
        questionCreditMax:
          filter.questionCredit && filter.questionCredit.max.length
            ? +filter.questionCredit.max
            : undefined,

        surveyType: filter.surveyType ? filter.surveyType.value : undefined,
        clientIndustryIds: filter.industry.length
          ? getStateValueAsNumArray(filter.industry)
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
      const { result, meta } = await SurveyAPI.getSurveys({
        limit: params.limit,
        skip: params.skip,
        ...filterFSParams,
        ...formattedFilterParams,
      });

      setPage(params.page);

      setFinishedSurveys(result);
      setTotalFSResults(meta.countFiltered);
    },
  });

  const handleBulkSurveysRemoval = async () => {
    try {
      await SurveyAPI.deleteManySurveys({
        surveyIds: checkedSurveys,
      });
      reload();
      setCheckedSurveys([]);

      push('Surveys successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleBulkOSurveysRemoval = async () => {
    try {
      await SurveyAPI.deleteManySurveys({
        surveyIds: checkedOngoingSurveys,
      });
      reloadOs();
      setCheckedOngoingSurveys([]);

      push('Surveys successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleBulkFSurveysRemoval = async () => {
    try {
      await SurveyAPI.deleteManySurveys({
        surveyIds: checkedFinishedSurveys,
      });
      reloadFs();
      setCheckedFinishedSurveys([]);

      push('Surveys successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleReloadAllSurveys = () => {
    reload();
    reloadOs();
    reloadFs();
  };

  const handleFilters = () => {
    handlePageChange(1);
    handleFSPageChange(1);
    handleOSPageChange(1);
  };

  const renderItem = ({ headItem, row }: TTableRenderItemObject) => {
    if (headItem.reference === 'survey') {
      return (
        <SurveyModalLink
          onClick={() => {
            setCurrent(row.data.id);
            openCcModal();
          }}
        >
          {row.data.name}
        </SurveyModalLink>
      );
    }

    if (headItem.reference === 'diseaseArea') {
      if (row.data.platformProductOrder.platformProductOrderDiseaseAreas[0]) {
        return row.data.platformProductOrder.platformProductOrderDiseaseAreas[0]
          .diseaseArea.name;
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

    if (headItem.reference === 'participants') {
      if (row.data.participantCount) {
        return row.data.participantCount;
      }
    }
    if (headItem.reference === 'questions') {
      return row.data.questionCount ? row.data.questionCount : '';
    }

    if (headItem.reference === 'budget') {
      if (row.data.platformProductOrder.budget) {
        return `CHF ${row.data.platformProductOrder.budget}`;
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
    if (headItem.reference === 'questions') {
      return row.data.questionCount;
    }

    if (headItem.reference === 'actions') {
      if (row.data.platformProductOrder.status === 0) {
        return (
          <InPreparationActions
            data={row.data}
            reload={handleReloadAllSurveys}
          />
        );
      }
      if (row.data.platformProductOrder.status === 1) {
        return (
          <InPreparationActions
            data={row.data}
            reload={handleReloadAllSurveys}
          />
        );
      }
      if (row.data.platformProductOrder.status === 2) {
        return (
          <InPreparationActions
            data={row.data}
            reload={handleReloadAllSurveys}
          />
        );
      }
    }

    return '';
  };

  const ipBulkActions = [
    {
      icon: <InfoIcon />,
      label: 'Info',
      action: () => {},
    },
    // {
    //   icon: <ManageIcon />,
    //   label: 'Manage',
    //   action: () => router.push('/services/surveys/manage'),
    // },
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
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openTModal();
        handleMenuIP();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        if (checkedSurveys.length) {
          openRemoveBulkSurveysModal();
        } else {
          push('Please select surveys you want to delete', {
            variant: 'warning',
          });
        }
        handleMenuIP();
      },
    },
  ];

  const osBulkActions = [
    {
      icon: <ManageIcon />,
      label: 'Manage',
      action: () => router.push('/services/surveys/manage'),
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
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openOSModal();
        handleMenuOS();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        if (checkedOngoingSurveys.length) {
          openRemoveBulkOngoingSurveysModal();
        } else {
          push('Please select surveys you want to delete', {
            variant: 'warning',
          });
        }
        handleMenuOS();
      },
    },
  ];

  const fsBulkActions = [
    {
      icon: <ManageIcon />,
      label: 'Manage',
      action: () => router.push('/services/surveys/manage'),
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
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openFSModal();
        handleMenuFS();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        if (checkedFinishedSurveys.length) {
          openRemoveBulkFinishedSurveysModal();
        } else {
          push('Please select surveys you want to delete', {
            variant: 'warning',
          });
        }
        handleMenuFS();
      },
    },
  ];

  useEffect(() => {
    if (filterCleared) {
      setFilterCleared(false);
      handleFilters();
    }
  }, [filter, filterCleared]);

  useEffect(() => {
    getClientIndustriesOptions();
    getClientCompanies();
    getCampaignClients();

    getClientAmbassadors();
    getClientProducts();

    getTargetDiseaseAreas();
    getTargetStruggles();
    getTargetLocations();
    getTargetEthnicities();
    getTargetInterests();
    getTargetGenders();
    getTargetLanguages();
    getSurveyGraphDataAsync(
      0,
      setSurveysOverTimeData1,
      'setSurveysOverTimeData1'
    )();
    getSurveyGraphDataAsync(
      1,
      setSurveysOverTimeData2,
      'setSurveysOverTimeData2'
    )();
    getSurveyGraphDataAsync(
      2,
      setSurveysOverTimeData3,
      'setSurveysOverTimeData3'
    )();
    getSurveyRevenueGraphDataAsync(
      setSurveysOverTimeData4,
      'setSurveysOverTimeData4'
    )();
  }, []);

  return (
    <SurveysPageMain>
      <SurveysPageCharts>
        <CardWrapper>
          <CardWithChart
            title="In Preparation"
            icon={<InpreparationIcon />}
            smallIcon={<SurveysSmallIcon />}
            percent={
              surveysOverTime1?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              surveysOverTime1?.data
                ? surveysOverTime1?.data[surveysOverTime1.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                surveysOverTime1.data &&
                surveysOverTime1.data.map((element: any) => element.value),
              labels:
                surveysOverTime1.data &&
                surveysOverTime1.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Ongoing"
            icon={<OngoingIcon />}
            smallIcon={<SurveysSmallIcon />}
            percent={
              surveysOverTime2?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              surveysOverTime2?.data
                ? surveysOverTime2?.data[surveysOverTime2.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                surveysOverTime2.data &&
                surveysOverTime2.data.map((element: any) => element.value),
              labels:
                surveysOverTime2.data &&
                surveysOverTime2.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Finished"
            icon={<FinishedIcon />}
            smallIcon={<SurveysSmallIcon />}
            percent={
              surveysOverTime3?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              surveysOverTime3?.data
                ? surveysOverTime3?.data[surveysOverTime3.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                surveysOverTime3.data &&
                surveysOverTime3.data.map((element: any) => element.value),
              labels:
                surveysOverTime3.data &&
                surveysOverTime3.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Revenue"
            icon={<RevenueIcon />}
            smallIcon={<SurveysSmallIcon />}
            percent={
              surveysOverTime4.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              surveysOverTime4?.data
                ? surveysOverTime4?.data[surveysOverTime4.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                surveysOverTime4.data &&
                surveysOverTime4.data.map((element: any) => element.value),
              labels:
                surveysOverTime4.data &&
                surveysOverTime4.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
      </SurveysPageCharts>
      <CardWithText
        title="Surveys"
        actions={[
          <Button
            color={filterOpen ? 'secondary' : 'default'}
            variant="contained"
            onClick={toggleFilter}
            startIcon={<SlidersHorizontalIcon width="18" height="18" />}
          >
            Filters
          </Button>,
          <Button color="default" variant="contained" onClick={openEsModal}>
            Export
          </Button>,
          <Button color="primary" variant="contained" onClick={openCsModal}>
            Create Survey
          </Button>,
        ]}
      >
        <Stack>
          <Collapse in={filterOpen}>
            <SurveysPageFilter>
              <Tabs
                tabs={['Survey', 'Client', 'Target']}
                value={tabs}
                onValue={setTabs}
              />
              {tabs === 0 && (
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
                    label="Participants"
                    value={filter.participants}
                    onValue={(participants) =>
                      setFilter({ ...filter, participants })
                    }
                  />
                  <Input
                    type="min-max"
                    label="Questions"
                    value={filter.questions}
                    onValue={(questions) => setFilter({ ...filter, questions })}
                  />
                  <Input
                    type="min-max"
                    label="Question Credit"
                    value={filter.questionCredit}
                    onValue={(questionCredit) =>
                      setFilter({ ...filter, questionCredit })
                    }
                  />
                  <Input
                    type="select"
                    label="Survey Type"
                    placeholder="Please Select"
                    value={filter.surveyType}
                    onValue={(surveyType) =>
                      setFilter({ ...filter, surveyType })
                    }
                    options={[
                      {
                        value: 0,
                        label: 'Questionnaire',
                      },
                      {
                        value: 1,
                        label: 'Short Interview',
                      },
                      {
                        value: 2,
                        label: 'Long Interview',
                      },
                    ]}
                  />
                </Grid>
              )}
              {tabs === 1 && (
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
              {tabs === 2 && (
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
              <SurveysPageFilterActions direction="horizontal">
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
              </SurveysPageFilterActions>
            </SurveysPageFilter>
          </Collapse>
          <Tabs
            tabs={['In Preparation', 'Ongoing', 'Finished']}
            value={tabsValue}
            onValue={setTabsValue}
          />
          {tabsValue === 0 ? (
            <>
              <NewCheckboxTable
                head={IPSurveysAdminHead}
                items={surveys}
                renderItem={renderItem}
                checkedRows={checkedSurveys}
                onSingleSelect={toggleSurvey}
                onSelectAll={toggleAllCheckedSurveys}
                tableColModal={tModal}
                closeTableColModal={closeTModal}
                renderElements={
                  <>
                    <ISpan onClick={handleMenuIP} ref={buttonIpRef}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openIP && (
                      <CustomActionsMenu
                        position={ipPosition}
                        items={ipBulkActions}
                        ref={menuIP}
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
          ) : undefined}
          {tabsValue === 1 ? (
            <>
              <NewCheckboxTable
                head={IPSurveysAdminHead}
                items={ongoingSurveys}
                renderItem={renderItem}
                checkedRows={checkedOngoingSurveys}
                onSingleSelect={toggleOngoingSurvey}
                onSelectAll={toggleAllCheckedOngoingSurveys}
                tableColModal={oSModal}
                closeTableColModal={closeOSModal}
                renderElements={
                  <>
                    <ISpan onClick={handleMenuOS} ref={buttonOsRef}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openOS && (
                      <CustomActionsMenu
                        position={oSPosition}
                        items={osBulkActions}
                        ref={menuOS}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handleOSPageChange(x)}
                page={osPage}
                count={pagesOSCount}
              />
            </>
          ) : undefined}
          {tabsValue === 2 ? (
            <>
              <NewCheckboxTable
                head={IPSurveysAdminHead}
                items={finishedSurveys}
                renderItem={renderItem}
                checkedRows={checkedFinishedSurveys}
                onSingleSelect={toggleFinishedSurvey}
                onSelectAll={toggleAllCheckedFinishedSurveys}
                tableColModal={fSModal}
                closeTableColModal={closeFSModal}
                renderElements={
                  <>
                    <ISpan onClick={handleMenuFS} ref={buttonFsRef}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openFS && (
                      <CustomActionsMenu
                        position={fSPosition}
                        items={fsBulkActions}
                        ref={menuFS}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handleFSPageChange(x)}
                page={fsPage}
                count={pagesFSCount}
              />
            </>
          ) : undefined}

          <Stack direction="horizontal">
            {/* <Button variant="contained" onClick={handleMenuIP}>
              In preparation
            </Button> 
                <Button variant="contained" onClick={handleMenuO}>
                  Ongoing
                </Button>
                <Button variant="contained" onClick={handleMenuF}>
                  Finished
                </Button>
                <Button variant="contained" onClick={openSiModal}>
                  Survey Info
                </Button> */}
          </Stack>
        </Stack>
        {/* {openIP && (
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
                action: () => router.push('/services/surveys/manage'),
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
            ref={menuIP}
          />
        )} */}
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
                action: () => router.push('/services/surveys/manage'),
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
                icon: <InfoIcon />,
                label: 'Info',
                action: () => {},
              },
              {
                icon: <ManageIcon />,
                label: 'Manage',
                action: () => router.push('/services/surveys/manage'),
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
      </CardWithText>
      {esModal && (
        <ExportSurveysModal
          onClose={closeEsModal}
          checkedOSurveys={checkedOngoingSurveys}
          checkedIPSurveys={checkedSurveys}
          checkedFSurveys={checkedFinishedSurveys}
        />
      )}
      {csModal && (
        <CreateSurveysModal onClose={closeCsModal} refresh={reload} />
      )}
      {removeBulkSurveysModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkSurveysModal()}
          handleAction={handleBulkSurveysRemoval}
        />
      )}
      {removeBulkOngoingSurveysModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkOngoingSurveysModal()}
          handleAction={handleBulkOSurveysRemoval}
        />
      )}
      {removeBulkFinishedSurveysModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkFinishedSurveysModal()}
          handleAction={handleBulkFSurveysRemoval}
        />
      )}
      {siModal && <SurveyInfoModal onClose={closeSiModal} />}
      {ccModal && (
        <CreatedSurveysModal
          id={current.toString()}
          onClose={closeCcModal}
          reload={reload}
        />
      )}
    </SurveysPageMain>
  );
};

export default SurveyPage;
