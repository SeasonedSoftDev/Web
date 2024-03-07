import React, { useEffect, useState } from 'react';
import {
  SurveysPageMain,
  SurveysPageCharts,
  SurveysPageFilter,
  SurveysPageFilterActions,
  SurveysPageFilterContainer,
  SurveyLink,
} from 'features/surveys/styles';
import {
  CardWithChart,
  CardWithText,
  CheckboxTable,
  Menu,
  Tabs,
} from 'components/custom';
import {
  ContactIcon,
  FinishedIcon,
  InfoIcon,
  InpreparationIcon,
  ManageIcon,
  OngoingIcon,
  ScheduleIcon,
  SlidersHorizontalIcon,
  SurveysSmallIcon,
  TotalIcon,
} from 'components/svg';
import { faker } from '@faker-js/faker';
import { Button, Input, InputGroup, Pagination } from 'components/ui';
import { Stack } from 'components/system';
import { Collapse } from '@mui/material';
import { DGenerateSurveyClientFilter } from 'features/surveys/data';
import { TTableRenderItemObject } from 'components/custom/table/types';
import {
  ExportSurveysModal,
  CreateSurveysModal,
  InPreparationActions,
  CreatedSurveysModal,
} from 'features/surveys/role/client/elements';
import { useDebounce, useMenu, useModal, usePagination } from 'hooks';
import { useRouter } from 'next/router';
import {
  SurveyAPI,
  DiseaseAreaAPI,
  EnumsApi,
  LocationAPI,
  ProductApi,
} from 'api';
import GraphsAPI from 'api/graphs';
import { useAppContext } from 'context';
import { fetchAndCacheData } from 'utilities/local-storage';
import { CardWrapper, ProductOrderInfluencers } from './styles';

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
    product: [],
    surveyType: null,

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

  // const [filter, setFilter] = useState<IFilterProps>(initialFilters);
  const [filter, setFilter] = useState<IFilterProps>(initialFilters);

  const [filterOpen, setFilterOpen] = useState(false);

  const [tabsValue, setTabsValue] = useState(0);

  const [esModal, openEsModal, closeEsModal] = useModal(false);
  const [csModal, openCsModal, closeCsModal] = useModal(false);
  const [createdSurveyModal, openCreatedSurveyModal, closeCreatedSurveyModal] =
    useModal(false);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(initialFilters);
    setFilterCleared(true);
  };

  const [current, setCurrent] = useState(-1);

  const router = useRouter();

  const [menuIp, openIp, setOpenIp] = useMenu(false);
  const [menuOn, openOn, setOpenOn] = useMenu(false);
  const [menuF, openF, setOpenF] = useMenu(false);

  const handleMenuIp = () => {
    setOpenIp(!openIp);
  };
  const handleMenuOn = () => {
    setOpenOn(!openOn);
  };
  const handleMenuF = () => {
    setOpenF(!openF);
  };

  const [inPrepSurveys, setInPrepSurveys] = useState<any>([]);
  const [ongoingSurveys, setOngoingSurveys] = useState<any>([]);
  const [finishedSurveys, setFinishedSurveys] = useState<any>([]);

  const [surveysOverTime1, setSurveysOverTime1] = useState<any>([]);
  const [surveysOverTime2, setSurveysOverTime2] = useState<any>([]);
  const [surveysOverTime3, setSurveysOverTime3] = useState<any>([]);
  const [surveysOverTime4, setSurveysOverTime4] = useState<any>([]);

  const [tabs, setTabs] = useState(0);

  const [filterParams, setFilterParams] = useState({});

  const [filterInPrepSParams, setFilterInPrepSParams] = useState({
    status: 0,
  });

  const [filterOngoingSParams, setFilterOngoingSParams] = useState({
    status: 1,
  });

  const [filterFinishedSParams, setFilterFinishedSParams] = useState({
    status: 2,
  });

  const [productsOptions, setProductsOptions] = useState<any>([]);

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

  const getProducts = async (s: string = '') => {
    const { result } = await ProductApi.getProducts(s);

    setProductsOptions(
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

  const debouncedProducts = useDebounce(getProducts, 250);

  const debouncedTargetDiseaseAreas = useDebounce(getTargetDiseaseAreas, 250);
  const debouncedTargetLocations = useDebounce(getTargetLocations, 250);

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
          ...filterInPrepSParams,
          ...formattedFilterParams,
        });

        setPage(params.page);

        setInPrepSurveys(result);
        setTotalResults(meta.countFiltered);
      },
    });

  const {
    pagesCount: pageOSCount,
    page: pageOs,
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
        ...filterOngoingSParams,
        ...formattedFilterParams,
      });

      setPage(params.page);

      setOngoingSurveys(result);
      setTotalOSResults(meta.countFiltered);
    },
  });

  const {
    pagesCount: pageFSCount,
    page: pageFs,
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
        ...filterFinishedSParams,
        ...formattedFilterParams,
      });

      setPage(params.page);

      setFinishedSurveys(result);
      setTotalFSResults(meta.countFiltered);
    },
  });

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

  const { user } = useAppContext();

  // eslint-disable-next-line consistent-return
  const getGraphData = async (queryParams: any) => {
    try {
      const response = await GraphsAPI.getGraphs(user.id, { ...queryParams });

      if (response.data) {
        return response;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.error(error);
    }
  };

  // eslint-disable-next-line consistent-return
  const getClientProductsInfluencersOverTimeData = async (queryParams: any) => {
    try {
      const response = await GraphsAPI.getClientProductsInfluencersOverTimeData(
        user.id,
        { ...queryParams }
      );

      if (response.data) {
        return response;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.error(error);
    }
  };

  const getClientGraphDataAsync =
    (
      product: number,
      status: number | undefined,
      setDataFunction: (data: any) => void,
      key: string,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getGraphData({
            product,
            startFromUserRegistration: true,
            status,
            statusAtPointOfTime: true,
            useStrictPeriod: false,
            numberOfPoints: 30,
            graphType: 'cumulative',
            includeData: ['changePercentageMonth'],
          }),
        key,
        forceUpdate
      );

      setDataFunction(result);
    };

  const getClientProductsInfluencersGraphDataAsync =
    (
      product: number,
      setDataFunction: (data: any) => void,
      key: string,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getClientProductsInfluencersOverTimeData({
            product,
            startFromUserRegistration: true,
            statusAtPointOfTime: true,
            numberOfPoints: 30,
            graphType: 'cumulative',
            includeData: ['changePercentageMonth'],
          }),
        key,
        forceUpdate
      );

      setDataFunction(result);
    };

  /* Filters */
  const [loading, setLoading] = useState(false);
  const [filtersProducts, setFilterProducts] = useState<any>([]);
  const [filterDiseaseAreas, setFilterDiseaseAreas] = useState<any>([]);
  const [filterStruggles, setFilterStruggles] = useState<any>([]);
  const [filterLocations, setFilterLocations] = useState<any>([]);
  const [filterEthnicitys, setFilterEthnicity] = useState<any>([]);
  const [filterInterests, setFilterInterests] = useState<any>([]);
  const [filterGenders, setFilterGenders] = useState<any>([]);
  const [filterLanguages, setFilterLanguages] = useState<any>([]);
  const [filterSymptoms, setFilterSymptoms] = useState<any>([]);

  const getDiseaseAreas = async (s: string = '') => {
    setLoading(true);
    const { result } = await DiseaseAreaAPI.getAll(s);

    setFilterDiseaseAreas(
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
    setFilterLocations(
      result.map((data: any) => ({
        value: data.id,
        label: data.country ? `${data.name}, ${data.country.name}` : data.name,
      }))
    );
    setLoading(false);
  };

  const getGenders = async () => {
    const result = await EnumsApi.getGenders();

    setFilterGenders(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const getEthnicities = async () => {
    const result = await EnumsApi.getEthnicities();

    setFilterEthnicity(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getStruggles = async () => {
    const result = await EnumsApi.getStruggles();

    setFilterStruggles(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };
  const getInterests = async () => {
    const result = await EnumsApi.getInterests();

    setFilterInterests(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getLanguages = async () => {
    const result = await EnumsApi.getLanguages();

    setFilterLanguages(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const getSymptoms = async () => {
    const { result } = await EnumsApi.getSymptoms();

    setFilterSymptoms(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const handleFilters = () => {
    handlePageChange(1);
    handleFSPageChange(1);
    handleOSPageChange(1);
  };

  useEffect(() => {
    if (filterCleared) {
      setFilterCleared(false);
      handleFilters();
    }
  }, [filter, filterCleared]);

  useEffect(() => {
    getClientGraphDataAsync(1, 0, setSurveysOverTime1, 'setSurveysOverTime1')();
    getClientGraphDataAsync(1, 1, setSurveysOverTime2, 'setSurveysOverTime2')();
    getClientGraphDataAsync(1, 2, setSurveysOverTime3, 'setSurveysOverTime3')();
    getClientProductsInfluencersGraphDataAsync(
      1,
      setSurveysOverTime4,
      'setSurveysOverTime4'
    )();

    getTargetDiseaseAreas();
    getTargetStruggles();
    getTargetLocations();
    getTargetEthnicities();
    getTargetInterests();
    getTargetGenders();
    getTargetLanguages();
  }, []);

  const handleNewProductTag = (v: any) => {
    setFilter({
      ...filter,
      product: [...filter.product, { value: v.label, label: v.label }],
    });
  };

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const renderItem = ({ headItem, row }: TTableRenderItemObject) => {
    if (headItem.reference === 'surveyName') {
      return (
        <SurveyLink
          onClick={() => {
            setCurrent(row.data.id);
            openCreatedSurveyModal();
          }}
        >
          {row.data.name}
        </SurveyLink>
      );
    }
    if (headItem.reference === 'diseaseArea') {
      if (row.data.platformProductOrder.platformProductOrderDiseaseAreas) {
        const diseaseAreas =
          row.data.platformProductOrder.platformProductOrderDiseaseAreas.map(
            (x: any) => x.diseaseArea.name
          );

        return diseaseAreas.join(', ');
      }
    }
    if (headItem.reference === 'participants') {
      if (row.data.participantCount) {
        return row.data.participantCount;
      }
    }
    if (headItem.reference === 'language') {
      if (row.data.platformProductOrder.platformProductOrderLanguages) {
        const languages =
          row.data.platformProductOrder.platformProductOrderLanguages.map(
            (x: any) => x.name
          );

        return languages.join(', ');
      }
    }
    if (headItem.reference === 'questions') {
      return row.data.questionCount;
    }
    if (headItem.reference === 'actions') {
      return <InPreparationActions data={row.data} />;
    }

    return '';
  };

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
            title="Participants"
            icon={<TotalIcon />}
            smallIcon={<SurveysSmallIcon />}
            percent={
              surveysOverTime4?.changePercentageMonth || Number(0).toFixed(2)
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
        // description="More than 290+ new Reports"
        style={
          window.innerWidth < 600
            ? { padding: '1.25rem', boxShadow: 'unset' }
            : { padding: '1.25rem', boxShadow: '0px 2px 5px #00000010' }
        }
        actions={[
          <Button
            color={filterOpen ? 'secondary' : 'default'}
            variant="contained"
            onClick={toggleFilter}
            startIcon={<SlidersHorizontalIcon width="18" height="18" />}
          >
            Filters
          </Button>,
          // <Button color="default" variant="contained" onClick={openEsModal}>
          //   Export
          // </Button>,
          <Button color="primary" variant="contained" onClick={openCsModal}>
            Create Survey
          </Button>,
        ]}
      >
        <Stack>
          <Collapse in={filterOpen}>
            <SurveysPageFilter>
              <Tabs
                tabs={['Survey', 'Target']}
                value={tabs}
                onValue={setTabs}
              />

              {tabs === 0 && (
                <SurveysPageFilterContainer>
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
                  <Input
                    type="multiselect"
                    label="Products"
                    placeholder="Please Select"
                    value={filter.product}
                    onValue={(product) => setFilter({ ...filter, product })}
                    options={filtersProducts}
                    onSearch={debounce(getProducts, 250)}
                    onNewTag={handleNewProductTag}
                    loading={loading}
                  />
                </SurveysPageFilterContainer>
              )}
              {tabs === 1 && (
                <SurveysPageFilterContainer>
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
                </SurveysPageFilterContainer>
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
            style={{ marginTop: '-30px' }}
          />
          {tabsValue === 0 && (
            <>
              <CheckboxTable
                head={[
                  {
                    reference: 'surveyName',
                    label: 'Survey Name',
                    visible: true,
                  },
                  {
                    reference: 'budget',
                    label: 'Budget',
                    visible: false,
                  },
                  {
                    reference: 'diseaseArea',
                    label: 'Disease Area',
                    visible: true,
                  },
                  {
                    reference: 'struggles',
                    label: 'Struggles',
                    visible: false,
                  },
                  {
                    reference: 'location',
                    label: 'Location',
                    visible: false,
                  },
                  {
                    reference: 'company',
                    label: 'Company',
                    visible: false,
                  },
                  {
                    reference: 'ethnicity',
                    label: 'Ethnicity',
                    visible: false,
                  },
                  {
                    reference: 'interests',
                    label: 'Interests',
                    visible: false,
                  },
                  {
                    reference: 'product',
                    label: 'Product',
                    visible: false,
                  },
                  {
                    reference: 'startDate',
                    label: 'Start Date',
                    visible: false,
                  },
                  {
                    reference: 'endDate',
                    label: 'End Date',
                    visible: false,
                  },
                  {
                    reference: 'participants',
                    label: 'Participants',
                    visible: true,
                  },
                  {
                    reference: 'ageMin',
                    label: 'Age Min',
                    visible: false,
                  },
                  {
                    reference: 'ageMax',
                    label: 'Age Max',
                    visible: false,
                  },
                  {
                    reference: 'gender',
                    label: 'Gender',
                    visible: false,
                  },
                  {
                    reference: 'language',
                    label: 'Language',
                    visible: true,
                  },
                  {
                    reference: 'questions',
                    label: 'Questions',
                    visible: true,
                  },
                  {
                    reference: 'questionCredits',
                    label: 'Question Credits',
                    visible: false,
                  },
                  {
                    reference: 'actions',
                    label: '',
                    visible: true,
                  },
                ]}
                items={inPrepSurveys}
                renderItem={renderItem}
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handlePageChange(x)}
                page={page}
                count={pagesCount}
              />
            </>
          )}
          {tabsValue === 1 && (
            <>
              <CheckboxTable
                head={[
                  {
                    reference: 'surveyName',
                    label: 'Survey Name',
                    visible: true,
                  },
                  {
                    reference: 'budget',
                    label: 'Budget',
                    visible: false,
                  },
                  {
                    reference: 'diseaseArea',
                    label: 'Disease Area',
                    visible: true,
                  },
                  {
                    reference: 'struggles',
                    label: 'Struggles',
                    visible: false,
                  },
                  {
                    reference: 'location',
                    label: 'Location',
                    visible: false,
                  },
                  {
                    reference: 'company',
                    label: 'Company',
                    visible: false,
                  },
                  {
                    reference: 'ethnicity',
                    label: 'Ethnicity',
                    visible: false,
                  },
                  {
                    reference: 'interests',
                    label: 'Interests',
                    visible: false,
                  },
                  {
                    reference: 'product',
                    label: 'Product',
                    visible: false,
                  },
                  {
                    reference: 'startDate',
                    label: 'Start Date',
                    visible: false,
                  },
                  {
                    reference: 'endDate',
                    label: 'End Date',
                    visible: false,
                  },
                  {
                    reference: 'participants',
                    label: 'Participants',
                    visible: true,
                  },
                  {
                    reference: 'ageMin',
                    label: 'Age Min',
                    visible: false,
                  },
                  {
                    reference: 'ageMax',
                    label: 'Age Max',
                    visible: false,
                  },
                  {
                    reference: 'gender',
                    label: 'Gender',
                    visible: false,
                  },
                  {
                    reference: 'language',
                    label: 'Language',
                    visible: true,
                  },
                  {
                    reference: 'questions',
                    label: 'Questions',
                    visible: true,
                  },
                  {
                    reference: 'questionCredits',
                    label: 'Question Credits',
                    visible: false,
                  },
                  {
                    reference: 'actions',
                    label: '',
                    visible: true,
                  },
                ]}
                items={ongoingSurveys}
                renderItem={renderItem}
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handleOSPageChange(x)}
                page={pageOs}
                count={pageOSCount}
              />
            </>
          )}
          {tabsValue === 2 && (
            <>
              <CheckboxTable
                head={[
                  {
                    reference: 'surveyName',
                    label: 'Survey Name',
                    visible: true,
                  },
                  {
                    reference: 'budget',
                    label: 'Budget',
                    visible: false,
                  },
                  {
                    reference: 'diseaseArea',
                    label: 'Disease Area',
                    visible: true,
                  },
                  {
                    reference: 'struggles',
                    label: 'Struggles',
                    visible: false,
                  },
                  {
                    reference: 'location',
                    label: 'Location',
                    visible: false,
                  },
                  {
                    reference: 'company',
                    label: 'Company',
                    visible: false,
                  },
                  {
                    reference: 'ethnicity',
                    label: 'Ethnicity',
                    visible: false,
                  },
                  {
                    reference: 'interests',
                    label: 'Interests',
                    visible: false,
                  },
                  {
                    reference: 'product',
                    label: 'Product',
                    visible: false,
                  },
                  {
                    reference: 'startDate',
                    label: 'Start Date',
                    visible: false,
                  },
                  {
                    reference: 'endDate',
                    label: 'End Date',
                    visible: false,
                  },
                  {
                    reference: 'participants',
                    label: 'Participants',
                    visible: true,
                  },
                  {
                    reference: 'ageMin',
                    label: 'Age Min',
                    visible: false,
                  },
                  {
                    reference: 'ageMax',
                    label: 'Age Max',
                    visible: false,
                  },
                  {
                    reference: 'gender',
                    label: 'Gender',
                    visible: false,
                  },
                  {
                    reference: 'language',
                    label: 'Language',
                    visible: true,
                  },
                  {
                    reference: 'questions',
                    label: 'Questions',
                    visible: true,
                  },
                  {
                    reference: 'questionCredits',
                    label: 'Question Credits',
                    visible: false,
                  },
                  {
                    reference: 'actions',
                    label: '',
                    visible: true,
                  },
                ]}
                items={finishedSurveys}
                renderItem={renderItem}
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handleFSPageChange(x)}
                page={pageFs}
                count={pageFSCount}
              />
            </>
          )}

          {/* <Stack direction="horizontal">
            <Button color="primary" variant="contained" onClick={handleMenuIp}>
              {' '}
              In Preparation Action
            </Button>
            <Button color="primary" variant="contained" onClick={handleMenuOn}>
              {' '}
              On Going Action
            </Button>
            <Button color="primary" variant="contained" onClick={handleMenuF}>
              {' '}
              Finished Action
            </Button>
            <Button color="primary" variant="contained" onClick={openCdModal}>
              {' '}
              Created Survey
            </Button>
          </Stack> */}
        </Stack>
        {openIp && (
          <Menu
            items={[
              {
                icon: <InfoIcon />,
                label: 'Info',
                action: () => {},
              },
              {
                icon: <ContactIcon />,
                label: 'Contact',
                action: () => {},
              },
              {
                icon: <ScheduleIcon />,
                label: 'Schedule',
                action: () => {},
              },
            ]}
            ref={menuIp}
          />
        )}
        {openOn && (
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
                action: () => router.push('/surveys/create'),
              },
              {
                icon: <ContactIcon />,
                label: 'Contact',
                action: () => {},
              },
              {
                icon: <ScheduleIcon />,
                label: 'Schedule',
                action: () => {},
              },
            ]}
            ref={menuOn}
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
                action: () => router.push('/surveys/create'),
              },
              {
                icon: <ContactIcon />,
                label: 'Contact',
                action: () => {},
              },
              {
                icon: <ScheduleIcon />,
                label: 'Schedule',
                action: () => {},
              },
            ]}
            ref={menuF}
          />
        )}
      </CardWithText>
      {esModal && <ExportSurveysModal onClose={closeEsModal} />}
      {csModal && (
        <CreateSurveysModal
          refresh={reload}
          onClose={async () => {
            reload();
            closeCsModal();
          }}
        />
      )}
      {createdSurveyModal && (
        <CreatedSurveysModal
          id={current.toString()}
          onClose={closeCreatedSurveyModal}
        />
      )}
    </SurveysPageMain>
  );
};

export default SurveyPage;
