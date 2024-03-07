import React, { useEffect, useState } from 'react';
import {
  CampaignsPageMain,
  CampaignsPageFilterContainer,
  CampaignsPageFilter,
  CampaignsPageFilterActions,
  CampaignModalLink,
} from 'features/campaigns/styles';
import {
  DCampaignsClientHead,
  DGenerateCampaignsClientFilter,
} from 'features/campaigns/data';
import {
  CardWithChart,
  CardWithText,
  CheckboxTable,
  Menu,
  Tabs,
} from 'components/custom';
import {
  CampaignsSmallIcon,
  ContactIcon,
  FinishedIcon,
  InfoIcon,
  InpreparationIcon,
  ManageIcon,
  OngoingIcon,
  ReportIcon,
  ScheduleIcon,
  SlidersHorizontalIcon,
  TotalIcon,
} from 'components/svg';
import { Button, Input, InputGroup, Pagination } from 'components/ui';
import { Stack, Collapse } from 'components/system';
import { TTableRenderItemObject } from 'components/custom/table/types';
import { useDebounce, useMenu, useModal, usePagination } from 'hooks';
import {
  AddCampaignModal,
  ExportCampaignsModal,
  CreatedCampaignModal,
  InPreparationActions,
} from 'features/campaigns/role/client/elements';
import { useRouter } from 'next/router';
import {
  CampaignAPI,
  ClientAPI,
  DiseaseAreaAPI,
  EnumsApi,
  LocationAPI,
  ProductApi,
} from 'api';
import { useAppContext } from 'context';
import GraphsAPI from 'api/graphs';
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
  influencers: IMinMaxField;
  influencerSize: ISelectedField[];
  postType: ISelectedField | null;
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
  const [ccModal, openCcModal, closeCcModal] = useModal(false);

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
    postType: null,
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

  const [filter, setFilter] = useState<IFilterProps>(initialFilters);
  const [filterCleared, setFilterCleared] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);

  const [tabs, setTabs] = useState(0);

  const [filterTabs, setFilterTabs] = useState(0);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(initialFilters);
    setFilterCleared(true);
  };

  const [menuIp, openIp, setOpenIp] = useMenu(false);
  const [menuF, openF, setOpenF] = useMenu(false);

  const [campaignsOverTime1, setCampaignsOverTime1] = useState<any>([]);
  const [campaignsOverTime2, setCampaignsOverTime2] = useState<any>([]);
  const [campaignsOverTime3, setCampaignsOverTime3] = useState<any>([]);
  const [campaignsOverTime4, setCampaignsOverTime4] = useState<any>([]);

  const handleMenuIp = () => {
    setOpenIp(!openIp);
  };
  const handleMenuF = () => {
    setOpenF(!openF);
  };

  const [current, setCurrent] = useState(-1);
  // const [filterParams, setFilterParams] = useState({});
  const [inPrepCampaigns, setInPrepCampaigns] = useState<any>([]);
  const [ongoingCampaigns, setOngoingCampaigns] = useState<any>([]);
  const [finishedCampaigns, setFinishedCampaigns] = useState<any>([]);

  const [filterIPParams, setFilterIPParams] = useState({ status: 0 });
  const [filterOCParams, setFilterOCParams] = useState({ status: 1 });
  const [filterFCParams, setFilterFParams] = useState({ status: 2 });

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

        setInPrepCampaigns(result);
        setTotalResults(meta.countFiltered);
      },
    });

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

  const handleFilter = () => {
    handleFCPageChange(1);
    handlePageChange(1);
    handleOCPageChange(1);
  };

  const renderItem = ({
    headItem,
    row,
    table,
    cell,
  }: TTableRenderItemObject) => {
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

    if (headItem.reference === 'budget') {
      if (row.data.platformProductOrder.budget) {
        return `${row.data.platformProductOrder.budget} CHF`;
      }
    }

    if (headItem.reference === 'diseaseArea') {
      if (row.data.platformProductOrder.platformProductOrderDiseaseAreas) {
        const diseases =
          row.data.platformProductOrder.platformProductOrderDiseaseAreas.map(
            (item: any) => item.diseaseArea.name
          );

        return diseases.join(', ');
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

    if (headItem.reference === 'influencers') {
      if (row.data.influencersCount) {
        return row.data.influencersCount;
      }
    }

    if (headItem.reference === 'report') {
      if (row.data.report) {
        return row.data.report.name;
      }
    }

    if (headItem.reference === 'actions') {
      if (row.data.platformProductOrder.status === 0) {
        return <InPreparationActions data={row.data} reload={reload} />;
      }
      return <InPreparationActions data={row.data} reload={reloadOC} />;
    }

    return '';
  };

  const router = useRouter();

  /* Filters */

  const [platformInfluencerSize, setPlatformInfluencerSize] = useState<any>();
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

  const getInfluencerSizes = async () => {
    const { result } = await EnumsApi.getInfluencerSize();

    setPlatformInfluencerSize(
      result.map((x: any) => ({
        value: x.id,
        label: `${x.name}: ${x.from} - ${x.to}`,
      }))
    );
  };

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

  const { user } = useAppContext();

  const { id } = user;

  const getClientsOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response = await GraphsAPI.getGraphs(user.id, { ...queryParams });

      if (response.data) {
        return response;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      throw new Error('Error: Failed to fetch data!');
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
          getClientsOverTimeData({
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

  useEffect(() => {
    getProducts();
    getInfluencerSizes();
    getTargetDiseaseAreas();
    getTargetStruggles();
    getTargetLocations();
    getTargetEthnicities();
    getTargetInterests();
    getTargetGenders();
    getTargetLanguages();

    getClientGraphDataAsync(
      0,
      0,
      setCampaignsOverTime1,
      'setCampaignsOverTime1'
    )();
    getClientGraphDataAsync(
      0,
      1,
      setCampaignsOverTime2,
      'setCampaignsOverTime2'
    )();
    getClientGraphDataAsync(
      0,
      2,
      setCampaignsOverTime3,
      'setCampaignsOverTime3'
    )();
    getClientProductsInfluencersGraphDataAsync(
      0,
      setCampaignsOverTime4,
      'setCampaignsOverTime4'
    )();
  }, []);

  useEffect(() => {
    if (filterCleared) {
      setFilterCleared(false);
      handleFilter();
    }
  }, [filter, filterCleared]);

  const debounce = (func: any, wait: any) => {
    let timeout: any;

    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  return (
    <CampaignsPageMain>
      <CampaignsPageFilterContainer>
        {campaignsOverTime1 && campaignsOverTime1.data && (
          <CardWrapper>
            <CardWithChart
              title="In Preparation"
              icon={<InpreparationIcon />}
              percent={
                campaignsOverTime1?.changePercentageMonth ||
                Number(0).toFixed(2)
              }
              count={
                campaignsOverTime1.data[campaignsOverTime1.data.length - 1]
                  .value || 0
              }
              chartData={{
                values: campaignsOverTime1.data.map(
                  (element: any) => element.value
                ),
                labels: campaignsOverTime1.data.map(
                  (element: any) => element.value
                ),
              }}
            />
          </CardWrapper>
        )}
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
            title="Influencers"
            icon={<TotalIcon />}
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
      </CampaignsPageFilterContainer>
      <CardWithText
        title="Campaigns"
        description=""
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
          // <Button color="default" variant="contained" onClick={openEcModal}>
          //   Export
          // </Button>,
          <Button color="primary" variant="contained" onClick={openAcModal}>
            Create Campaign
          </Button>,
        ]}
      >
        <Stack>
          <Collapse removeGap in={filterOpen}>
            <CampaignsPageFilter>
              <Tabs
                tabs={['Campaign', 'Target']}
                value={filterTabs}
                onValue={setFilterTabs}
              />
              {filterTabs === 0 && (
                <CampaignsPageFilterContainer>
                  <Input
                    type="text"
                    label="Search"
                    placeholder="Please Enter"
                    value={filter.search}
                    onValue={(search) => setFilter({ ...filter, search })}
                  />
                  <Input
                    type="multiselect"
                    label="Products"
                    placeholder="Please Select"
                    value={filter.product}
                    onValue={(product) => setFilter({ ...filter, product })}
                    options={productsOptions}
                    onSearch={debouncedProducts}
                  />
                  <Input
                    type="min-max"
                    label="Budget"
                    placeholder="Please Select"
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
                    label="Influencer Sizes"
                    placeholder="Please Select"
                    value={filter.influencerSize}
                    onValue={(influencerSize) =>
                      setFilter({ ...filter, influencerSize })
                    }
                    options={platformInfluencerSize}
                  />

                  <Input
                    type="select"
                    label="Post Types"
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
                </CampaignsPageFilterContainer>
              )}
              {filterTabs === 1 && (
                <CampaignsPageFilterContainer>
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
                </CampaignsPageFilterContainer>
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
            tabs={['In Preparation', 'Ongoing', 'Finished', 'Report Received']}
          />
          {tabs === 0 && (
            <>
              <CheckboxTable
                head={DCampaignsClientHead}
                items={inPrepCampaigns}
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
          {tabs === 1 && (
            <>
              <CheckboxTable
                head={DCampaignsClientHead}
                items={ongoingCampaigns}
                renderItem={renderItem}
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
              <CheckboxTable
                head={DCampaignsClientHead}
                items={[]}
                renderItem={() => {}}
              />
              <Pagination style={{ justifyContent: 'right' }} count={0} />
            </>
          )}
          {tabs === 3 && (
            <>
              <CheckboxTable
                head={DCampaignsClientHead}
                items={[]}
                renderItem={() => {}}
              />
              <Pagination style={{ justifyContent: 'right' }} count={0} />
            </>
          )}
        </Stack>
        {/* <Stack direction="horizontal">
          <Button color="primary" variant="contained" onClick={openCcModal}>
            {' '}
            Created Campaign
          </Button>
          <Button color="primary" variant="contained" onClick={handleMenuIp}>
            {' '}
            In Preparation Action
          </Button>
          <Button color="primary" variant="contained" onClick={handleMenuF}>
            {' '}
            Finished Action
          </Button>
        </Stack> */}
        {openIp && (
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
                action: () => router.push('/campaigns/manage'),
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
                action: () => router.push('/campaigns/manage'),
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
      {acModal && (
        <AddCampaignModal
          refresh={reload}
          onClose={async () => {
            reload();
            closeAcModal();
          }}
        />
      )}
      {/* {ecModal && <ExportCampaignsModal onClose={closeEcModal} />} */}
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
