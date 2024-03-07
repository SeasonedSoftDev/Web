import React, { useState, useEffect } from 'react';
import {
  DiscoverInfluencersPageMain,
  DiscoverInfluencersPageCharts,
  DiscoverInfluencersPageFilter,
  DiscoverInfluencersPageFilterActions,
  DiscoverInfluencersAction,
  DiscoverInfluencersFilterContainer,
} from 'features/discover-influencers/styles';
import {
  ToBeApprovedActionsMenu as CustomActionsMenu,
  ISpan,
} from 'features/discover-influencers/role/admin/elements/to-be-approved-actions/styles';
import {
  CardWithChart,
  CardWithText,
  NewCheckboxTable,
  Tabs,
} from 'components/custom';
import {
  ApproveIcon,
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
import { Button, Input, InputGroup, Pagination } from 'components/ui';
import { Stack } from 'components/system';
import { Collapse, Tooltip } from '@mui/material';
import {
  DGenerateDiscoverInfluencersFilter,
  DInfluencerHeadRegistered,
  DInfluencerHeadToBeApproved,
} from 'features/discover-influencers/data';
import {
  DiscoverActions,
  ExportInfluencersModal,
  InfluencerProfile,
  ToBeApprovedActions,
} from 'features/discover-influencers/role/admin/elements';
import {
  useDebounce,
  useMenu,
  useModal,
  usePagination,
  useSnackbar,
} from 'hooks';
import { TTableRenderItemObject } from 'components/custom/table/types';
import { DiseaseAreaAPI, InfluencerAPI, LocationAPI } from 'api';
import { IPaginatedUser } from 'api/influencer/types';
import { BackupTableRounded } from '@mui/icons-material';
import UsersAPI from 'api/users';
import { formatLongString } from 'utilities/string-converter';
import { fetchAndCacheData } from 'utilities/local-storage';
import PromptModal from './elements/approve-influencer-modal';
import { calculateAge, getDiseasesAsCommaSeparatedString } from './helpers';
import { CardWrapper, TableTooltip } from './styles';

interface ISelectedField {
  label: string;
  value: string;
}

interface IMinMaxField {
  min: string;
  max: string;
}

interface IFilterProps {
  search: string;
  diseaseArea: ISelectedField[];
  location: ISelectedField[];
  age: IMinMaxField;
  gender: ISelectedField | null;
  experienceAs: ISelectedField | null;
  status: ISelectedField | null;
  joinedFrom: Date | null;
  joinedTo: Date | null;
  ethnicity: ISelectedField[];
}

const DiscoverInfluencersPage = () => {
  // Modals
  const [eModal, openEModal, closeEModal] = useModal(false);
  const [ipModal, openIpModal, closeIpModal] = useModal(false);

  const { push } = useSnackbar();

  const [getDailyInfluencers, setDailyinfluencers] = useState<any>([]);
  const [getWeeklyInfluencers, setWeeklyinfluencers] = useState<any>([]);
  const [getMonthlyInfluencers, setMonthlyinfluencers] = useState<any>([]);
  const [getYearlyInfluencers, setYearlyinfluencers] = useState<any>([]);

  const genderOptions = [
    {
      value: 0,
      label: 'Male',
    },
    {
      value: 1,
      label: 'Female',
    },
    {
      value: 2,
      label: 'Other',
    },
  ];

  const [tabs, setTabs] = useState(0);

  const initialFilters = {
    search: '',
    diseaseArea: [],
    location: [],
    age: {
      min: '',
      max: '',
    },
    gender: null,
    experienceAs: null,
    status: null,
    joinedFrom: null,
    joinedTo: null,
    ethnicity: [],
  };

  const [filterCleared, setFilterCleared] = useState(false);
  const [filter, setFilter] = useState<IFilterProps>(initialFilters);
  const [diseaseAreasOptions, setDiseaseAreasOptions] = useState<any[]>([]);
  const [locationsOptions, setLocationsOptions] = useState<any[]>([]);

  const [filterOpen, setFilterOpen] = useState(false);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(initialFilters);
    setFilterCleared(true);
  };

  const [currentInfluencer, setCurrentInfluencer] = useState<any>();

  const getCurrentInfluencer = (value: any) => {
    setCurrentInfluencer(value);
  };

  const [filterParams, setFilterParams] = useState({});
  const [registeredInfluencers, setRegisteredInfluencers] = useState<
    IPaginatedUser[]
  >([]);

  // Collects ids that represent user ids not influencer id's
  const [checkedRegInfluencers, setCheckedRegInfluencers] = useState<number[]>(
    []
  );

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
          // diseaseAreaIds: filter.diseaseArea.length
          //   ? getStateValueAsNumArray(filter.diseaseArea)
          //   : undefined,
          // locationIds: filter.location.length
          //   ? getStateValueAsNumArray(filter.location)
          //   : undefined,
          status: filter.status ? filter.status.value : undefined,
          joinedFrom: filter.joinedFrom || undefined,
          joinedTo: filter.joinedTo || undefined,
        };

        const { data, pagination } =
          await InfluencerAPI.getDInfluencersRegistered({
            limit: params.limit,
            skip: params.skip,
            ...filterParams,
            ...formattedFilterParams,
          });

        setPage(params.page);

        setRegisteredInfluencers(data);
        setTotalResults(pagination.totalFilteredItems);
      },
    });

  // eslint-disable-next-line consistent-return
  const getAllRegisteredInfluencers = async (
    queryParams: any
    // eslint-disable-next-line consistent-return
  ): Promise<any> => {
    try {
      const response = await InfluencerAPI.getDiscoverInfluencersGraphData({
        ...filterParams,
        ...queryParams,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.log('error', error);
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

  const getInfluencerGraphDataAsync =
    (
      graphPeriod: string,
      setDataFunction: (data: any) => void,
      key: string,
      reformatToAbsoluteGraphData: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getAllRegisteredInfluencers({
            useStrictPeriod: true,
            graphPeriod,
            graphType: 'cumulative',
            roundDateToDay: true,
            includeOngoingPeriod: true,
          }),
        key
      );

      if (reformatToAbsoluteGraphData) {
        result.data = calculateRelativeGrowth(result.data);
      }

      setDataFunction(result);
    };

  const last30daysValues = getDailyInfluencers?.data?.slice(-30);

  // const sumOfLast30DaysValues = last30daysValues?.reduce(
  //   (accumulator: number, currentValue: { value: number }) =>
  //     accumulator + currentValue.value,
  //   0
  // );

  const last12WeeksValues = getWeeklyInfluencers?.data?.slice(-84);

  // const sumOfLast12WeeksValues = last12WeeksValues?.reduce(
  //   (accumulator: number, currentValue: { value: number }) =>
  //     accumulator + currentValue.value,
  //   0
  // );

  const lastYearValues = getMonthlyInfluencers?.data?.slice(-365);

  // const sumOfLastYearValues = lastYearValues?.reduce(
  //   (accumulator: number, currentValue: { value: number }) =>
  //     accumulator + currentValue.value,
  //   0
  // );

  const last6yearsdaysValues = getYearlyInfluencers?.data?.slice(-2191);

  // const sumOfLast6yearsDaysValues = last6yearsdaysValues?.reduce(
  //   (accumulator: number, currentValue: { value: number }) =>
  //     accumulator + currentValue.value,
  //   0
  // );

  const toggleAllCheckedRegInfluencers = (checked: boolean) => {
    if (checked) {
      const currentPageIds = registeredInfluencers.map((row) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedRegInfluencers, ...currentPageIds])
      );
      setCheckedRegInfluencers(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = registeredInfluencers.map((row) => row.id);
      const newSelectedRows = checkedRegInfluencers.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedRegInfluencers(newSelectedRows);
    }
  };

  const toggleRegInfluencer = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedRegInfluencers([...checkedRegInfluencers, rowId]);
    } else {
      setCheckedRegInfluencers(
        checkedRegInfluencers.filter((id) => id !== rowId)
      );
    }
  };

  const [toBeApprovedInfluencers, setToBeApprovedInfluencers] = useState<
    IPaginatedUser[]
  >([]);
  const [checkedToBeApprovedInfluencers, setCheckedToBeApprovedInfluencers] =
    useState<number[]>([]);

  const {
    pagesCount: pageCountTba,
    page: pageTba,
    setTotalResults: setTotalResultsTba,
    handlePageChange: handlePageChangeTba,
    reload: reloadTba,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const formattedFilterParams = {
        search: filter.search && filter.search.length ? filter.search : '',
        diseaseAreaIds: filter.diseaseArea.length
          ? getStateValueAsNumArray(filter.diseaseArea)
          : undefined,
        locationIds: filter.location.length
          ? getStateValueAsNumArray(filter.location)
          : undefined,
        ageMin:
          filter.age && filter.age.min.length ? +filter.age.min : undefined,
        ageMax:
          filter.age && filter.age.max.length ? +filter.age.max : undefined,
        gender:
          filter.gender && (filter.gender?.value || +filter.gender.value === 0)
            ? filter.gender.value
            : undefined,
        experienceAs:
          filter.experienceAs &&
          (filter.experienceAs?.value || +filter.experienceAs.value === 0)
            ? filter.experienceAs.value
            : undefined,
        joinedFrom: filter.joinedFrom || undefined,
        joinedTo: filter.joinedTo || undefined,
      };

      const { data, pagination } =
        await InfluencerAPI.getDInfluencersToBeApproved({
          limit: params.limit,
          skip: params.skip,
          ...filterParams,
          ...formattedFilterParams,
        });

      setPage(params.page);

      setToBeApprovedInfluencers(data);
      setTotalResultsTba(pagination.totalFilteredItems);
    },
  });

  const handleFilters = () => {
    handlePageChange(1);
    handlePageChangeTba(1);
  };

  const toggleAllCheckedTBAInfluencers = (checked: boolean) => {
    if (checked) {
      const currentPageIds = toBeApprovedInfluencers.map((row) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedToBeApprovedInfluencers, ...currentPageIds])
      );
      setCheckedToBeApprovedInfluencers(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = toBeApprovedInfluencers.map((row) => row.id);
      const newSelectedRows = checkedToBeApprovedInfluencers.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedToBeApprovedInfluencers(newSelectedRows);
    }
  };

  const toggleTBAInfluencer = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedToBeApprovedInfluencers([
        ...checkedToBeApprovedInfluencers,
        rowId,
      ]);
    } else {
      setCheckedToBeApprovedInfluencers(
        checkedToBeApprovedInfluencers.filter((id) => id !== rowId)
      );
    }
  };

  // Table New Checkbox Modal controlls
  const [tRegModal, openTRegModal, closeTRegModal] = useModal(false);
  const [tTBAModal, openTTBAModal, closeTTBAModal] = useModal(false);

  // Table Menu List Modal
  const [menu, open, setOpen, buttonRegRef, position] = useMenu(false);
  const [tbaMenu, openTba, setOpenTba, buttonTBARef, tbaPosition] =
    useMenu(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const handleTBAMenu = () => {
    setOpenTba(!openTba);
  };

  // placeholder items
  const [contactModal, openContactModal, closeContactModal] = useModal(false);
  const [noteModal, openNoteModal, closeNoteModal] = useModal(false);
  const [scheduleModal, openScheduleModal, closeScheduleModal] =
    useModal(false);

  // modals for bulk actions
  const [approveModal, openApproveModal, closeApproveModal] = useModal(false);
  const [
    removeBulkRegInfModal,
    openRemoveBulkRegInfModal,
    closeRemoveBulkRegInfModal,
  ] = useModal(false);
  const [removeBulkTBAModal, openRemoveBulkTBAModal, closeRemoveBulkTBAModal] =
    useModal(false);

  const registeredBulkActions = [
    {
      icon: <ContactIcon />,
      label: 'Contact',
      action: () => {
        openContactModal();
        handleMenu();
      },
    },
    {
      icon: <EditIcon />,
      label: 'Note',
      action: () => {
        openNoteModal();
        handleMenu();
      },
    },
    {
      icon: <ScheduleIcon />,
      label: 'Schedule',
      action: () => {
        openScheduleModal();
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
        openRemoveBulkRegInfModal();
        handleMenu();
      },
    },
  ];

  const toBeApprovedBulkActions = [
    {
      icon: <ApproveIcon />,
      label: 'Approve',
      action: () => {
        openApproveModal();
        handleTBAMenu();
      },
    },
    {
      icon: <ContactIcon />,
      label: 'Contact',
      action: () => {
        openContactModal();
        handleTBAMenu();
      },
    },
    {
      icon: <EditIcon />,
      label: 'Note',
      action: () => {
        openNoteModal();
        handleTBAMenu();
      },
    },
    {
      icon: <ScheduleIcon />,
      label: 'Schedule',
      action: () => {
        openScheduleModal();
        handleTBAMenu();
      },
    },
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openTTBAModal();
        handleTBAMenu();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        openRemoveBulkTBAModal();
        handleTBAMenu();
      },
    },
  ];

  const handleBulkRegInfApproval = async () => {
    try {
      await UsersAPI.updateSelectedUsersStatus(
        checkedToBeApprovedInfluencers,
        5
      );
      reloadTba();
      setCheckedToBeApprovedInfluencers([]);

      push('Influencer successfully approved!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleBulkRegInfRemoval = async () => {
    try {
      await InfluencerAPI.deleteManyInfluencers({
        userIds: checkedRegInfluencers,
      });
      reload();
      setCheckedRegInfluencers([]);

      push('Influencers successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };
  const handleBulkTBARemoval = async () => {
    // InfluencerAPI.deleteManyInfluencers({
    //   userIds: checkedToBeApprovedInfluencers,
    // });
    try {
      await InfluencerAPI.deleteManyInfluencers({
        userIds: checkedToBeApprovedInfluencers,
      });
      reloadTba();
      setCheckedToBeApprovedInfluencers([]);

      push('Influencers successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const getLocations = async (s: string = '') => {
    const { result } = await LocationAPI.getAll(s);
    setLocationsOptions(
      result.map((data: any) => ({
        value: data.id,
        label: data.country ? `${data.name}, ${data.country.name}` : data.name,
      }))
    );
  };

  const getDiseaseAreas = async (s: string = '') => {
    const { result } = await DiseaseAreaAPI.getAll(s);

    setDiseaseAreasOptions(
      result.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    );
  };

  const debouncedDiseaseAreas = useDebounce(getDiseaseAreas, 250);

  const debouncedLocations = useDebounce(getLocations, 250);

  const renderItem = ({ headItem, row }: TTableRenderItemObject) => {
    if (headItem.reference === 'firstName') {
      return (
        <DiscoverInfluencersAction
          onClick={() => {
            getCurrentInfluencer(row.data.user.id);
            openIpModal();
          }}
        >
          {row.data.user.firstName}
        </DiscoverInfluencersAction>
      );
    }
    if (headItem.reference === 'lastName') {
      return row.data.user.lastName;
    }
    if (headItem.reference === 'email') {
      return row.data.user.email;
    }

    if (headItem.reference === 'location') {
      if (!row.data.user.location) {
        return '';
      }
      const { location } = row.data.user;
      const label = location.country
        ? `${location.name}, ${location.country.name}`
        : location.name;

      return label;
    }

    if (headItem.reference === 'age') {
      if (!row.data.dateOfBirth) {
        return '';
      }
      return calculateAge(row.data.dateOfBirth);
    }

    if (headItem.reference === 'gender') {
      switch (row.data.gender) {
        case 0:
          return 'Male';
        case 1:
          return 'Female';
        case 2:
          return 'Other';
        default:
          return '';
      }
    }

    if (headItem.reference === 'diseaseArea') {
      if (row.data.influencerDiseaseAreas) {
        const formattedDiseases = getDiseasesAsCommaSeparatedString(
          row.data.influencerDiseaseAreas
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

    if (headItem.reference === 'status') {
      switch (row.data.user.status) {
        case 0:
          return 'Identified';
        case 1:
          return 'Contacted';
        case 2:
          return 'Not Confirmed';
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
    if (headItem.reference === 'registeredAt') {
      return row.data.user.createdAt.slice(0, 10);
    }

    if (headItem.reference === 'updatedAt') {
      return row.data.user.updatedAt.slice(0, 10);
    }

    if (headItem.reference === 'invitedBy') {
      return row.data.invitedByUser
        ? `${row.data.invitedByUser.firstName} ${row.data.invitedByUser.lastName}`
        : '';
    }

    if (headItem.reference === 'actions') {
      switch (row.data.user.status) {
        case 4:
          return (
            <ToBeApprovedActions data={row.data.user.id} reload={reloadTba} />
          );
        default:
          return <DiscoverActions data={row.data.user.id} reload={reload} />;
      }
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

  useEffect(() => {
    if (filterCleared) {
      setFilterCleared(false);
      handleFilters();
    }
  }, [filter, filterCleared]);

  useEffect(() => {
    getDiseaseAreas();
    getLocations();

    getInfluencerGraphDataAsync(
      'daily',
      setDailyinfluencers,
      'setDailyinfluencers',
      true
    )();
    getInfluencerGraphDataAsync(
      'weekly',
      setWeeklyinfluencers,
      'setWeeklyinfluencers',
      true
    )();
    getInfluencerGraphDataAsync(
      'monthly',
      setMonthlyinfluencers,
      'setMonthlyinfluencers',
      true
    )();
    getInfluencerGraphDataAsync(
      'yearly',
      setYearlyinfluencers,
      'setYearlyinfluencers',
      true
    )();
  }, []);

  return (
    <DiscoverInfluencersPageMain>
      <DiscoverInfluencersPageCharts>
        <CardWrapper>
          <CardWithChart
            title="Daily"
            icon={<DailyIcon />}
            smallIcon={<UserIcon />}
            percent={
              getDailyInfluencers.data &&
              getPercentage(
                getDailyInfluencers?.data[getDailyInfluencers.data.length - 1]
                  .value,
                getDailyInfluencers?.data[getDailyInfluencers.data.length - 2]
                  .value
              )
            }
            count={
              getDailyInfluencers?.data
                ? getDailyInfluencers?.data[getDailyInfluencers.data.length - 1]
                    .value
                : 0
            }
            chartData={{
              values:
                getDailyInfluencers?.data &&
                getDailyInfluencers.data.map((element: any) => element.value),
              labels:
                getDailyInfluencers?.data &&
                getDailyInfluencers?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Weekly"
            icon={<WeeklyIcon />}
            smallIcon={<UserIcon />}
            percent={
              getWeeklyInfluencers.data &&
              getPercentage(
                getWeeklyInfluencers?.data[getWeeklyInfluencers.data.length - 1]
                  .value,
                getWeeklyInfluencers?.data[getWeeklyInfluencers.data.length - 2]
                  .value
              )
            }
            count={
              getWeeklyInfluencers?.data
                ? getWeeklyInfluencers?.data[
                    getWeeklyInfluencers.data.length - 1
                  ].value
                : 0
            }
            chartData={{
              values:
                getWeeklyInfluencers?.data &&
                getWeeklyInfluencers.data.map((element: any) => element.value),
              labels:
                getWeeklyInfluencers?.data &&
                getWeeklyInfluencers?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Monthly"
            icon={<MonthlyIcon />}
            smallIcon={<UserIcon />}
            percent={
              getMonthlyInfluencers.data &&
              getPercentage(
                getMonthlyInfluencers?.data[
                  getMonthlyInfluencers.data.length - 1
                ].value,
                getMonthlyInfluencers?.data[
                  getMonthlyInfluencers.data.length - 2
                ].value
              )
            }
            count={
              getMonthlyInfluencers?.data
                ? getMonthlyInfluencers?.data[
                    getMonthlyInfluencers.data.length - 1
                  ].value
                : 0
            }
            chartData={{
              values:
                getMonthlyInfluencers?.data &&
                getMonthlyInfluencers.data.map((element: any) => element.value),
              labels:
                getMonthlyInfluencers?.data &&
                getMonthlyInfluencers?.data.map(
                  (element: any) => element.value
                ),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Yearly"
            icon={<YearlyIcon />}
            smallIcon={<UserIcon />}
            percent={
              getYearlyInfluencers.data &&
              getPercentage(
                getYearlyInfluencers?.data[getYearlyInfluencers.data.length - 1]
                  .value,
                getYearlyInfluencers?.data[getYearlyInfluencers.data.length - 2]
                  .value
              )
            }
            count={
              getYearlyInfluencers?.data
                ? getYearlyInfluencers?.data[
                    getYearlyInfluencers.data.length - 1
                  ].value
                : 0
            }
            chartData={{
              values:
                getYearlyInfluencers?.data &&
                getYearlyInfluencers.data.map((element: any) => element.value),
              labels:
                getYearlyInfluencers?.data &&
                getYearlyInfluencers?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
      </DiscoverInfluencersPageCharts>
      <CardWithText
        title="Discovered Influencers"
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
            <DiscoverInfluencersPageFilter>
              <DiscoverInfluencersFilterContainer>
                <Input
                  type="text"
                  label="Search"
                  placeholder="Please Enter"
                  value={filter.search}
                  onValue={(search) => setFilter({ ...filter, search })}
                />
                <Input
                  type="multiselect"
                  label="Disease Area"
                  placeholder="Please Select"
                  value={filter.diseaseArea}
                  onValue={(input) =>
                    setFilter({ ...filter, diseaseArea: input })
                  }
                  options={diseaseAreasOptions}
                  onSearch={debouncedDiseaseAreas}
                />
                <Input
                  type="multiselect"
                  label="Location"
                  placeholder="Please Select"
                  value={filter.location}
                  onValue={(input) => setFilter({ ...filter, location: input })}
                  options={locationsOptions}
                  onSearch={debouncedLocations}
                />
                <Input
                  type="min-max"
                  label="Age"
                  value={filter.age}
                  onValue={(age) => setFilter({ ...filter, age })}
                />
                <Input
                  type="select"
                  label="Gender"
                  placeholder="Please Select"
                  value={filter.gender}
                  onValue={(gender) => setFilter({ ...filter, gender })}
                  options={genderOptions}
                />
                <Input
                  type="select"
                  label="Experience As"
                  placeholder="Please Select"
                  value={filter.experienceAs}
                  onValue={(experienceAs) =>
                    setFilter({ ...filter, experienceAs })
                  }
                  options={[
                    {
                      value: 1,
                      label: 'Patient',
                    },
                    {
                      value: 2,
                      label: 'Caregiver',
                    },
                  ]}
                />
                {/* <Input
                  type="select"
                  label="Social Media"
                  placeholder="Please Select"
                  value={filter.socialMedia}
                  onValue={(socialMedia) =>
                    setFilter({ ...filter, socialMedia })
                  }
                  options={[
                    {
                      value: 0,
                      label: 'Instagram',
                    },
                    {
                      value: 1,
                      label: 'Twitter',
                    },
                  ]}
                /> */}
                <Input
                  type="select"
                  label="Status"
                  placeholder="Please Select"
                  value={filter.status}
                  onValue={(inputStatus) =>
                    setFilter({ ...filter, status: inputStatus })
                  }
                  options={[
                    {
                      value: 2,
                      label: 'Not Confirmed',
                    },
                    {
                      value: 3,
                      label: 'Confirmed',
                    },
                  ]}
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
              </DiscoverInfluencersFilterContainer>
              <DiscoverInfluencersPageFilterActions direction="horizontal">
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
              </DiscoverInfluencersPageFilterActions>
            </DiscoverInfluencersPageFilter>
          </Collapse>
          <Tabs
            value={tabs}
            onValue={setTabs}
            tabs={['Registered', 'To Be Approved']}
          />
          {tabs === 0 && (
            <>
              <NewCheckboxTable
                head={DInfluencerHeadRegistered}
                items={registeredInfluencers}
                renderItem={renderItem}
                checkedRows={checkedRegInfluencers}
                onSingleSelect={toggleRegInfluencer}
                onSelectAll={toggleAllCheckedRegInfluencers}
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
                onChange={(_e, x) => handlePageChange(x)}
                page={page}
                count={pagesCount}
              />
            </>
          )}
          {tabs === 1 && (
            <>
              <NewCheckboxTable
                head={DInfluencerHeadToBeApproved}
                items={toBeApprovedInfluencers}
                checkedRows={checkedToBeApprovedInfluencers}
                onSingleSelect={toggleTBAInfluencer}
                onSelectAll={toggleAllCheckedTBAInfluencers}
                renderItem={renderItem}
                tableColModal={tTBAModal}
                closeTableColModal={closeTTBAModal}
                renderElements={
                  <>
                    <ISpan onClick={handleTBAMenu} ref={buttonTBARef}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openTba && (
                      <CustomActionsMenu
                        position={tbaPosition}
                        items={toBeApprovedBulkActions}
                        ref={tbaMenu}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handlePageChangeTba(x)}
                page={pageTba}
                count={pageCountTba}
              />
            </>
          )}
        </Stack>
      </CardWithText>
      {approveModal && (
        <PromptModal
          type="approve"
          onClose={() => {
            closeApproveModal();
          }}
          handleAction={handleBulkRegInfApproval}
        />
      )}
      {removeBulkRegInfModal && (
        <PromptModal
          plural
          onClose={() => {
            closeRemoveBulkRegInfModal();
          }}
          handleAction={handleBulkRegInfRemoval}
        />
      )}
      {removeBulkTBAModal && (
        <PromptModal
          plural
          onClose={() => {
            closeRemoveBulkTBAModal();
          }}
          handleAction={handleBulkTBARemoval}
        />
      )}
      {eModal && (
        <ExportInfluencersModal
          onClose={closeEModal}
          checkedRegInfluencers={checkedRegInfluencers}
          checkedToBeApprovedInfluencers={checkedToBeApprovedInfluencers}
        />
      )}
      {ipModal && (
        <InfluencerProfile
          influencerId={currentInfluencer}
          onClose={closeIpModal}
        />
      )}
    </DiscoverInfluencersPageMain>
  );
};

export default DiscoverInfluencersPage;
