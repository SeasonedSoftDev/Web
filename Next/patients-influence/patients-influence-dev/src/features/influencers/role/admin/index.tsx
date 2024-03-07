import React, { useEffect, useState } from 'react';
import {
  InfluencersPageMain,
  InfluencersPageCharts,
  InfluencersPageFilter,
  InfluencersPageFilterActions,
  InfluencerAction,
} from 'features/influencers/styles';
import {
  CardWithChart,
  CardWithText,
  Tabs,
  NewCheckboxTable,
} from 'components/custom';
import {
  ToBeApprovedActionsMenu as CustomActionsMenu,
  ISpan,
} from 'features/discover-influencers/role/admin/elements/to-be-approved-actions/styles';
import {
  ArrowDownIcon,
  ContactIcon,
  DeleteIcon,
  EditIcon,
  InstagramIcon,
  ScheduleIcon,
  SlidersHorizontalIcon,
  TiktokIcon,
  TotalIcon,
  TwitterIcon,
  UserIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { faker } from '@faker-js/faker';
import { Button, Input, InputGroup, Pagination } from 'components/ui';
import { Grid, Stack } from 'components/system';
import {
  ButtonGroup,
  ClickAwayListener,
  Collapse,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
} from '@mui/material';
import {
  DInfluencersHead,
  DGenerateInfluencersFilter,
  IInfluencerFilterProps,
} from 'features/influencers/data';
import { TTableRenderItemObject } from 'components/custom/table/types';
import {
  useDebounce,
  useMenu,
  useModal,
  usePagination,
  useSnackbar,
} from 'hooks';
import {
  AddToInfluencerModal,
  DonateInfluencerModal,
  ContactInfluencerModal,
  DeleteInfluencerModal,
  ExportInfluencersModal,
  InfluencerProfile,
  NoteInfluencer,
  NotificationsSettingsModal,
  ScheduleInfluencerModal,
  ConfirmInfluencerModal,
  DiscoverActions,
} from 'features/influencers/role/admin/elements';
import { DiseaseAreaAPI, EnumsApi, InfluencerAPI, LocationAPI } from 'api';
import { IInfluencerUser } from 'api/influencer/types';
import { BackupTableRounded } from '@mui/icons-material';
import PromptModal from 'features/discover-influencers/role/admin/elements/approve-influencer-modal';
import { formatLongString } from 'utilities/string-converter';
import { fetchAndCacheData } from 'utilities/local-storage';
import {
  getStateValueAsNumArray,
  handleFormatParamKey,
} from 'utilities/converters';
import { ButtonGroupContainer, CardWrapper, TableTooltip } from './styles';
import MlInfluencerModal from './elements/ml-influencer-modal';

const getDiseasesAsCommaSeparatedString = (diseases: any[]): string =>
  diseases.map((disease) => disease.name).join(', ');

const InfluencersPage = () => {
  // Modals
  const [aiModal, openAiModal, closeAiModal] = useModal(false);
  const [donateiModal, openDonateiModal, closeDonateiModal] = useModal(false);
  const [mlModal, openMlModal, closeMlModal] = useModal(false);
  const [eModal, openEModal, closeEModal] = useModal(false);
  const [diModal, openDiModal, closeDiModal] = useModal(false);
  const [ciModal, openCiModal, closeCiModal] = useModal(false);
  const [siModal, openSiModal, closeSiModal] = useModal(false);
  const [nsModal, openNsModal, closeNsModal] = useModal(false);
  const [ipModal, openIpModal, closeIpModal] = useModal(false);
  const [niModal, openNiModal, closeNiModal] = useModal(false);
  const [cfrmModal, openCfrmModal, closeCfrmModal] = useModal(false);

  const { push } = useSnackbar();

  const [genderOptions, setGenderOptions] = useState<any[]>([]);
  const [ethnicityOptions, setEthnicityOptions] = useState<any[]>([]);
  const [locationsOptions, setLocationsOptions] = useState<any[]>([]);
  const [locationsAudienceOptions, setLocationsAudienceOptions] = useState<
    any[]
  >([]);

  const [diseaseAreaOptions, setDiseaseAreaOptions] = useState<any[]>([]);
  const [struggleOptions, setStruggleOptions] = useState<any[]>([]);
  const [interestOptions, setInterestOptions] = useState<any[]>([]);
  const [languageOptions, setLanguageOptions] = useState<any>();

  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const anchorRef = React.useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState<IInfluencerFilterProps>(
    DGenerateInfluencersFilter()
  );

  const [filterCleared, setFilterCleared] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);

  const [tabs, setTabs] = useState(0);

  const [currentInfluencer, setCurrentInfluencer] = useState<any>();

  const getCurrentInfluencer = (value: any) => {
    setCurrentInfluencer(value);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleDonateModal = () => {
    openDonateiModal();
    setAddMenuOpen(false);
  };

  const handleDonateMlModal = () => {
    openMlModal();
    setAddMenuOpen(false);
  };

  const handleToggleAddMenu = () => {
    setAddMenuOpen((prevOpen) => !prevOpen);
  };

  const handleCloseAddMenu = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setAddMenuOpen(false);
  };

  const [influencers, setInfluencers] = useState<IInfluencerUser[]>([]);
  const [checkedInfluencers, setCheckedInfluencers] = useState<number[]>([]);

  const [getAllInfluencersInstagram, setDailyinfluencers] = useState<any>([]);
  const [getWeeklyInfluencers, setWeeklyinfluencers] = useState<any>([]);
  const [getMonthlyInfluencers, setMonthlyinfluencers] = useState<any>([]);
  const [getYearlyInfluencers, setYearlyinfluencers] = useState<any>([]);

  const [filterParams, setFilterParams] = useState({});

  const { pagesCount, page, setTotalResults, handlePageChange, reload } =
    usePagination({
      limit: 10,
      page: 1,
      onChange: async (params, setPage) => {
        const formattedParams = {
          search: filter.search,
          experienceAsId: handleFormatParamKey(filter.experienceAs, 'select'),
          genderIds:
            filter.genders && filter.genders.length
              ? getStateValueAsNumArray(filter.genders)
              : undefined,
          ageMin: handleFormatParamKey(filter.age, 'min'),
          ageMax: handleFormatParamKey(filter.age, 'max'),
          ethnicityIds:
            filter.ethnicities && filter.ethnicities.length
              ? getStateValueAsNumArray(filter.ethnicities)
              : undefined,
          locationIds: filter.locations.length
            ? getStateValueAsNumArray(filter.locations)
            : undefined,
          diseaseAreaIds: filter.diseaseAreas.length
            ? getStateValueAsNumArray(filter.diseaseAreas)
            : undefined,
          struggleIds: filter.struggles.length
            ? getStateValueAsNumArray(filter.struggles)
            : undefined,
          interestIds: filter.interests.length
            ? getStateValueAsNumArray(filter.interests)
            : undefined,
          languageIds:
            filter.languages && filter.languages.length
              ? getStateValueAsNumArray(filter.languages)
              : undefined,
          keywords: filter.keywords,
          followersMin: handleFormatParamKey(filter.followers, 'min'),
          followersMax: handleFormatParamKey(filter.followers, 'max'),
          engagementMin: handleFormatParamKey(filter.engagement, 'min'),
          engagementMax: handleFormatParamKey(filter.engagement, 'max'),
          likesMin: handleFormatParamKey(filter.likes, 'min'),
          likesMax: handleFormatParamKey(filter.likes, 'max'),
          commentsMin: handleFormatParamKey(filter.comments, 'min'),
          commentsMax: handleFormatParamKey(filter.comments, 'max'),
          joinedFrom: filter.joinedFrom || undefined,
          joinedTo: filter.joinedTo || undefined,
          stakeholderIds: filter.stakeholders.length
            ? getStateValueAsNumArray(filter.stakeholders)
            : undefined,
          audienceGenderChoiceIds: filter.audienceGenderChoices.length
            ? getStateValueAsNumArray(filter.audienceGenderChoices)
            : undefined,
          audienceGenderCount: filter.audienceGenderCount.length
            ? handleFormatParamKey(+filter.audienceGenderCount, 'number')
            : undefined,
          audienceGenderUnitId: handleFormatParamKey(filter.audienceGenderUnit),
          audienceAgeMin: handleFormatParamKey(filter.audienceAgeValues, 'min'),
          audienceAgeMax: handleFormatParamKey(filter.audienceAgeValues, 'max'),
          audienceAgeCount: filter.audienceAgeCount
            ? handleFormatParamKey(+filter.audienceAgeCount, 'number')
            : undefined,
          audienceAgeUnitId: handleFormatParamKey(filter.audienceAgeUnit),
          audienceEthnicityChoiceIds: filter.audienceEthnicityChoices.length
            ? getStateValueAsNumArray(filter.audienceEthnicityChoices)
            : undefined,
          audienceEthnicityCount: filter.audienceEthnicityCount.length
            ? handleFormatParamKey(+filter.audienceEthnicityCount, 'number')
            : undefined,
          audienceEthnicityUnitId: handleFormatParamKey(
            filter.audienceEthnicityUnit
          ),
          audienceLocationChoiceIds: filter.audienceLocationChoices.length
            ? getStateValueAsNumArray(filter.audienceLocationChoices)
            : undefined,
          audienceLocationCount: filter.audienceLocationCount.length
            ? handleFormatParamKey(+filter.audienceLocationCount, 'number')
            : undefined,
          audienceLocationUnitId: handleFormatParamKey(
            filter.audienceLocationUnit
          ),
          audienceDiseaseAreaChoiceIds: filter.audienceDiseaseAreaChoices.length
            ? getStateValueAsNumArray(filter.audienceDiseaseAreaChoices)
            : undefined,
          audienceDiseaseAreaCount: filter.audienceDiseaseAreaCount.length
            ? handleFormatParamKey(+filter.audienceDiseaseAreaCount, 'number')
            : undefined,
          audienceDiseaseAreaUnitId: handleFormatParamKey(
            filter.audienceDiseaseAreaUnit
          ),
          audienceStruggleChoiceIds: filter.audienceStruggleChoices.length
            ? getStateValueAsNumArray(filter.audienceStruggleChoices)
            : undefined,
          audienceStruggleCount: filter.audienceStruggleCount.length
            ? handleFormatParamKey(+filter.audienceStruggleCount, 'number')
            : undefined,
          audienceStruggleUnitId: handleFormatParamKey(
            filter.audienceStruggleUnit
          ),
          audienceInterestChoiceIds: filter.audienceInterestChoices.length
            ? getStateValueAsNumArray(filter.audienceInterestChoices)
            : undefined,
          audienceInterestCount: filter.audienceInterestCount
            ? handleFormatParamKey(+filter.audienceInterestCount, 'number')
            : undefined,
          audienceInterestUnitId: handleFormatParamKey(
            filter.audienceInterestUnit
          ),
          audienceLanguageChoiceIds: filter.audienceLanguageChoices.length
            ? getStateValueAsNumArray(filter.audienceLanguageChoices)
            : undefined,
          audienceLanguageCount: filter.audienceLanguageCount.length
            ? handleFormatParamKey(+filter.audienceLanguageCount, 'number')
            : undefined,
          audienceLanguageUnitId: handleFormatParamKey(
            filter.audienceLanguageUnit
          ),
          audienceKeywords: filter.audienceKeywords,
          performancePostTypeId: handleFormatParamKey(
            filter.performancePostType
          ),
          costPerTargetMin: handleFormatParamKey(filter.costPerTarget, 'min'),
          costPerTargetMax: handleFormatParamKey(filter.costPerTarget, 'max'),
          costPerQuestionCreditMin: handleFormatParamKey(
            filter.costPerQuestionCredit,
            'min'
          ),
          costPerQuestionCreditMax: handleFormatParamKey(
            filter.costPerQuestionCredit,
            'max'
          ),
          costPerLikeMin: handleFormatParamKey(filter.costPerLike, 'min'),
          costPerLikeMax: handleFormatParamKey(filter.costPerLike, 'max'),
          costPerCommentMin: handleFormatParamKey(filter.costPerComment, 'min'),
          costPerCommentMax: handleFormatParamKey(filter.costPerComment, 'max'),
          costPerEngagementMin: handleFormatParamKey(
            filter.costPerEngagement,
            'min'
          ),
          costPerEngagementMax: handleFormatParamKey(
            filter.costPerEngagement,
            'max'
          ),
          totalEarningsMin: handleFormatParamKey(filter.totalEarnings, 'min'),
          totalEarningsMax: handleFormatParamKey(filter.totalEarnings, 'max'),
          earningsLast30DaysMin: handleFormatParamKey(
            filter.earningsLast30Days,
            'min'
          ),
          earningsLast30DaysMax: handleFormatParamKey(
            filter.earningsLast30Days,
            'max'
          ),
          totalProjectsMin: handleFormatParamKey(filter.totalProjects, 'min'),
          totalProjectsMax: handleFormatParamKey(filter.totalProjects, 'max'),
          projectsLast30DaysMin: handleFormatParamKey(
            filter.projectsLast30Days,
            'min'
          ),
          projectsLast30DaysMax: handleFormatParamKey(
            filter.projectsLast30Days,
            'max'
          ),
          influencersNeeded: handleFormatParamKey(
            filter.influencersNeeded,
            'number'
          ),
          audienceOverlap: handleFormatParamKey(
            filter.audienceOverlap,
            'number'
          ),
          prioritizeBy:
            filter.prioritizeBy && filter.prioritizeBy.value
              ? filter.prioritizeBy.value
              : undefined,
        };

        const { dataFormatted, pagination } =
          await InfluencerAPI.getInfluencers({
            limit: params.limit,
            skip: params.skip,
            ...filterParams,
            ...formattedParams,
          });

        setPage(params.page);

        setInfluencers(dataFormatted);
        setTotalResults(pagination.totalFilteredItems);
      },
    });

  const handleFilters = () => {
    handlePageChange(1);
  };

  const clearFilters = () => {
    setFilter(DGenerateInfluencersFilter());
    setFilterCleared(true);
  };

  const toggleAllCheckedInfluencers = (checked: boolean) => {
    if (checked) {
      const currentPageIds = influencers.map((row) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedInfluencers, ...currentPageIds])
      );
      setCheckedInfluencers(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = influencers.map((row) => row.id);
      const newSelectedRows = checkedInfluencers.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedInfluencers(newSelectedRows);
    }
  };

  const toggleInfluencer = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedInfluencers([...checkedInfluencers, rowId]);
    } else {
      setCheckedInfluencers(checkedInfluencers.filter((id) => id !== rowId));
    }
  };

  // Table New Checkbox Modal controlls
  const [tableModal, openTableModal, closeTableModal] = useModal(false);

  // Table Menu List Modal
  const [menu, open, setOpen, buttonRegRef, position] = useMenu(false);

  // placeholder items
  const [contactModal, openContactModal, closeContactModal] = useModal(false);
  const [noteModal, openNoteModal, closeNoteModal] = useModal(false);
  const [scheduleModal, openScheduleModal, closeScheduleModal] =
    useModal(false);

  const [removeBulkInfModal, openRemoveBulkInfModal, closeRemoveBulkInfModal] =
    useModal(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const renderItem = ({ headItem, row }: TTableRenderItemObject) => {
    const singleInfluencer = row.data as IInfluencerUser;
    if (headItem.reference === 'firstName') {
      return (
        <InfluencerAction
          onClick={() => {
            getCurrentInfluencer(row.data.user.id);
            openIpModal();
          }}
        >
          {row.data.user.firstName}
        </InfluencerAction>
      );
    }

    if (headItem.reference === 'diseaseArea') {
      if (row.data.diseaseAreas) {
        const formattedDiseases = getDiseasesAsCommaSeparatedString(
          row.data.diseaseAreas
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

    if (headItem.reference === 'age') {
      return row.data.user.age;
    }
    if (headItem.reference === 'gender') {
      switch (row.data.user.gender) {
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
    if (headItem.reference === 'followers') {
      return row.data.followers;
    }
    if (headItem.reference === 'postAmount') {
      return singleInfluencer.postAmount
        ? `CHF ${singleInfluencer.postAmount}`
        : `Not Set`;
    }

    if (headItem.reference === 'reelAmount') {
      return singleInfluencer.reelAmount
        ? `CHF ${singleInfluencer.reelAmount}`
        : `Not Set`;
    }

    if (headItem.reference === 'storyAmount') {
      return singleInfluencer.storyAmount
        ? `CHF ${singleInfluencer.storyAmount}`
        : `Not Set`;
    }
    if (headItem.reference === 'shortInterviewAmount') {
      return singleInfluencer.shortInterviewAmount
        ? `CHF ${singleInfluencer.shortInterviewAmount}`
        : `Not Set`;
    }
    if (headItem.reference === 'longInterviewAmount') {
      return singleInfluencer.longInterviewAmount
        ? `CHF ${singleInfluencer.longInterviewAmount}`
        : `Not Set`;
    }
    if (headItem.reference === 'questionCreditAmount') {
      return singleInfluencer.questionCreditAmount
        ? `CHF ${singleInfluencer.questionCreditAmount}`
        : `Not Set`;
    }

    if (headItem.reference === 'lastName') {
      return row.data.user.lastName;
    }
    if (headItem.reference === 'email') {
      return row.data.user.email;
    }
    if (headItem.reference === 'status') {
      return 'Approved';
    }
    if (headItem.reference === 'registeredAt') {
      return row.data.user.createdAt.slice(0, 10);
    }

    if (headItem.reference === 'registeredAt') {
      return row.data.user.createdAt.slice(0, 10);
    }

    if (headItem.reference === 'invitedBy') {
      return row.data.invitendByUser;
    }

    if (headItem.reference === 'actions') {
      return <DiscoverActions dataId={row.data.user.id} reload={reload} />;
    }

    if (headItem.reference === 'follower') {
      if (row.data.followers) {
        return row.data.followers;
      }
    }

    if (headItem.reference === 'patientsRatio') {
      if (row.data.patientCaregiverRatio) {
        const convertToPercentage = row.data.patientCaregiverRatio * 100;
        return `${convertToPercentage.toFixed(2)}%`;
      }
    }

    if (headItem.reference === 'doctorsRatio') {
      if (row.data.doctorRatio) {
        const convertToPercentage = row.data.doctorRatio * 100;
        return `${convertToPercentage.toFixed(2)}%`;
      }
    }

    if (headItem.reference === 'nursesRatio') {
      if (row.data.doctorRatio) {
        const convertToPercentage = row.data.nurseRatio * 100;
        return `${convertToPercentage.toFixed(2)}%`;
      }
    }

    if (headItem.reference === 'targetedGender') {
      if (row.data.targetedGenderRatio) {
        const convertToPercentage = row.data.targetedGenderRatio * 100;
        return `${convertToPercentage.toFixed(2)}%`;
      }
    }

    if (headItem.reference === 'targetedStakeholdersAge') {
      if (row.data.targetedAgeRatio) {
        const convertToPercentage = row.data.targetedAgeRatio * 100;
        return `${convertToPercentage.toFixed(2)}%`;
      }
    }

    if (headItem.reference === 'targetedStakeholdersEthnicity') {
      if (row.data.targetedEthnicityRatio) {
        const convertToPercentage = row.data.targetedEthnicityRatio * 100;
        return `${convertToPercentage.toFixed(2)}%`;
      }
    }

    if (headItem.reference === 'targetedStakeholdersLocation') {
      if (row.data.targetedLocationRatio) {
        const convertToPercentage = row.data.targetedLocationRatio * 100;
        return `${convertToPercentage.toFixed(2)}%`;
      }
    }

    if (headItem.reference === 'targetedDiseaseArea') {
      if (row.data.targetedDieaseAreasRatio) {
        const convertToPercentage = row.data.targetedDieaseAreasRatio * 100;
        return `${convertToPercentage.toFixed(2)}%`;
      }
    }

    if (headItem.reference === 'targetedSymptom') {
      if (row.data.targetedSymptomsRatio) {
        const convertToPercentage = row.data.targetedSymptomsRatio * 100;
        return `${convertToPercentage.toFixed(2)}%`;
      }
    }

    if (headItem.reference === 'targetedRatio') {
      if (row.data.targetRatio) {
        const convertToPercentage = row.data.targetRatio * 100;
        return `${convertToPercentage.toFixed(2)}%`;
      }
    }

    if (headItem.reference === 'targetedTotal') {
      if (row.data.targetTotal) {
        return row.data.targetTotal;
      }
    }

    if (headItem.reference === 'likes') {
      if (row.data.averageLikes) {
        return row.data.averageLikes;
      }
    }

    if (headItem.reference === 'comments') {
      if (row.data.averageComments) {
        return row.data.averageComments;
      }
    }

    if (headItem.reference === 'engagement') {
      if (row.data.engagement) {
        return row.data.engagement;
      }
    }

    return '';
  };

  const influencerBulkActions = [
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
        openTableModal();
        handleMenu();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        openRemoveBulkInfModal();
        handleMenu();
      },
    },
  ];

  const handleBulkInfRemoval = async () => {
    try {
      await InfluencerAPI.deleteManyInfluencers({
        userIds: checkedInfluencers,
      });
      reload();
      setCheckedInfluencers([]);

      push('Influencers successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  // eslint-disable-next-line consistent-return
  const getInstagramInfluencersGraph = async (
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

  const getInfluencerInstagramGraphDataAsync =
    (
      setDataFunction: (data: any) => void,
      key: string,
      reformatToAbsoluteGraphData: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getInstagramInfluencersGraph({
            socialPlatform: 1,
            useStrictPeriod: false,
            numberOfPoints: 30,
            graphType: 'cumulative',
            includeData: ['changePercentageMonth'],
          }),
        key
      );

      if (reformatToAbsoluteGraphData) {
        result.data = calculateRelativeGrowth(result.data);
      }

      setDataFunction(result);
    };

  const getGenderOptions = async () => {
    const result = await EnumsApi.getGenders();

    setGenderOptions(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const getEthnicity = async () => {
    const result = await EnumsApi.getEthnicities();

    setEthnicityOptions(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
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

  const getAudienceLocations = async (s: string = '') => {
    const { result } = await LocationAPI.getAll(s);
    setLocationsAudienceOptions(
      result.map((data: any) => ({
        value: data.id,
        label: data.country ? `${data.name}, ${data.country.name}` : data.name,
      }))
    );
  };

  const getDiseaseAreas = async (s: string = '') => {
    const { result } = await DiseaseAreaAPI.getAll(s);

    setDiseaseAreaOptions(
      result.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    );
  };

  const getStruggles = async () => {
    const result = await EnumsApi.getStruggles();

    setStruggleOptions(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getInterests = async () => {
    const result = await EnumsApi.getInterests();

    setInterestOptions(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getLanguages = async () => {
    const result = await EnumsApi.getLanguages();

    setLanguageOptions(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const debounceLocations = useDebounce(getLocations, 250);
  const debounceAudienceLocations = useDebounce(getAudienceLocations, 250);
  const debounceDiseaseArea = useDebounce(getDiseaseAreas, 250);

  useEffect(() => {
    getAudienceLocations();
    getLocations();
    getGenderOptions();
    getEthnicity();
    getDiseaseAreas();
    getStruggles();
    getInterests();
    getLanguages();
    getInfluencerInstagramGraphDataAsync(
      setDailyinfluencers,
      'setInstagramInfluencers',
      true
    )();
  }, []);

  useEffect(() => {
    if (filterCleared) {
      setFilterCleared(false);
      handlePageChange(1);
    }
  }, [filter, filterCleared]);

  return (
    <InfluencersPageMain>
      <InfluencersPageCharts>
        <CardWrapper>
          <CardWithChart
            title="Instagram"
            icon={<InstagramIcon />}
            smallIcon={<UserIcon />}
            percent={
              getAllInfluencersInstagram?.changePercentageMonth ||
              Number(0).toFixed(2)
            }
            count={
              getAllInfluencersInstagram?.data
                ? getAllInfluencersInstagram?.data[
                    getAllInfluencersInstagram.data.length - 1
                  ].value
                : 0
            }
            chartData={{
              values:
                getAllInfluencersInstagram?.data &&
                getAllInfluencersInstagram.data.map(
                  (element: any) => element.value
                ),
              labels:
                getAllInfluencersInstagram?.data &&
                getAllInfluencersInstagram?.data.map(
                  (element: any) => element.value
                ),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Twitter"
            icon={<TwitterIcon />}
            smallIcon={<UserIcon />}
            percent={0}
            count={0}
            chartData={{
              values: Array.from(Array(20).keys()).map((_x) =>
                faker.datatype.number({ min: 0, max: 0 })
              ),
              labels: Array.from(Array(20).keys()).map((_x) => ''),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Tiktok"
            icon={<TiktokIcon />}
            smallIcon={<UserIcon />}
            percent={0}
            count={0}
            chartData={{
              values: Array.from(Array(20).keys()).map((_x) =>
                faker.datatype.number({ min: 0, max: 0 })
              ),
              labels: Array.from(Array(20).keys()).map((_x) => ''),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Total"
            icon={<TotalIcon />}
            smallIcon={<UserIcon />}
            percent={
              getAllInfluencersInstagram?.changePercentageMonth ||
              Number(0).toFixed(2)
            }
            count={
              getAllInfluencersInstagram?.data
                ? getAllInfluencersInstagram?.data[
                    getAllInfluencersInstagram.data.length - 1
                  ].value
                : 0
            }
            chartData={{
              values:
                getAllInfluencersInstagram?.data &&
                getAllInfluencersInstagram.data.map(
                  (element: any) => element.value
                ),
              labels:
                getAllInfluencersInstagram?.data &&
                getAllInfluencersInstagram?.data.map(
                  (element: any) => element.value
                ),
            }}
          />
        </CardWrapper>
      </InfluencersPageCharts>
      <CardWithText
        title="Influencers"
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
          <ButtonGroupContainer>
            <ButtonGroup>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  if (checkedInfluencers.length) {
                    openAiModal();
                  } else {
                    push('Please select influencers', { variant: 'warning' });
                  }
                }}
              >
                Add To
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={handleToggleAddMenu}
              >
                <ArrowDownIcon />
              </Button>
            </ButtonGroup>
            <Popper
              open={addMenuOpen}
              anchorEl={anchorRef.current}
              role={undefined}
              style={{ position: 'absolute', top: '37px', right: '0px' }}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleCloseAddMenu}>
                      <MenuList id="split-button-menu" autoFocusItem>
                        <MenuItem onClick={handleDonateModal}>Donate</MenuItem>
                        <MenuItem onClick={handleDonateMlModal}>
                          PI Algorithm
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </ButtonGroupContainer>,
        ]}
      >
        <Stack>
          <Collapse in={filterOpen}>
            <InfluencersPageFilter>
              <Tabs
                value={tabs}
                onValue={setTabs}
                tabs={['Influencers', 'Audience', 'Performance', 'Campaign']}
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
                  {/* <Input
                    type="select"
                    label="Social Media"
                    placeholder="Please Select"
                    disabled
                    value={filter.socialMedia}
                    onValue={(socialMedia) =>
                      setFilter({ ...filter, socialMedia })
                    }
                  /> */}
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
                  <Input
                    type="multiselect"
                    label="Gender"
                    placeholder="Please Select"
                    value={filter.genders}
                    onValue={(genders) => setFilter({ ...filter, genders })}
                    options={genderOptions}
                  />
                  <Input
                    type="min-max"
                    label="Age"
                    placeholder="Please Select"
                    value={filter.age}
                    onValue={(age) => setFilter({ ...filter, age })}
                  />
                  <Input
                    type="multiselect"
                    label="Ethnicity"
                    placeholder="Please Select"
                    value={filter.ethnicities}
                    onValue={(ethnicities) =>
                      setFilter({ ...filter, ethnicities })
                    }
                    options={ethnicityOptions}
                  />
                  <Input
                    type="multiselect"
                    label="Location"
                    placeholder="Please Select"
                    value={filter.locations}
                    onValue={(locations) => setFilter({ ...filter, locations })}
                    options={locationsOptions}
                    onSearch={debounceLocations}
                  />
                  <Input
                    type="multiselect"
                    label="Disease Area"
                    placeholder="Please Select"
                    value={filter.diseaseAreas}
                    onValue={(diseaseAreas) =>
                      setFilter({ ...filter, diseaseAreas })
                    }
                    options={diseaseAreaOptions}
                    onSearch={debounceDiseaseArea}
                  />
                  <Input
                    type="multiselect"
                    label="Struggles"
                    placeholder="Please Select"
                    value={filter.struggles}
                    onValue={(struggles) => setFilter({ ...filter, struggles })}
                    options={struggleOptions}
                  />
                  <Input
                    type="multiselect"
                    label="Interests"
                    placeholder="Please Select"
                    value={filter.interests}
                    onValue={(interests) => setFilter({ ...filter, interests })}
                    options={interestOptions}
                  />
                  {/* <Input
                    type="select"
                    label="Brands"
                    placeholder="Please Select"
                    value={filter.brands}
                    onValue={(brands) => setFilter({ ...filter, brands })}
                  /> */}
                  {/* <Input
                    type="select"
                    label="Products"
                    placeholder="Please Select"
                    value={filter.products}
                    onValue={(products) => setFilter({ ...filter, products })}
                  /> */}
                  <Input
                    type="text"
                    label="Keywords"
                    placeholder="Please Enter"
                    value={filter.keywords}
                    onValue={(keywords) => setFilter({ ...filter, keywords })}
                  />
                  <Input
                    type="multiselect"
                    label="Language"
                    placeholder="Choose language"
                    value={filter.languages}
                    onValue={(languages) => setFilter({ ...filter, languages })}
                    options={languageOptions}
                  />
                  <Input
                    type="min-max"
                    label="Followers"
                    value={filter.followers}
                    onValue={(followers) => setFilter({ ...filter, followers })}
                  />
                  <Input
                    type="min-max"
                    label="Engagement"
                    value={filter.engagement}
                    onValue={(engagement) =>
                      setFilter({ ...filter, engagement })
                    }
                  />
                  <Input
                    type="min-max"
                    label="Likes"
                    value={filter.likes}
                    onValue={(likes) => setFilter({ ...filter, likes })}
                  />
                  <Input
                    type="min-max"
                    label="Comments"
                    value={filter.comments}
                    onValue={(comments) => setFilter({ ...filter, comments })}
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
                        onValue: (joinedTo) =>
                          setFilter({ ...filter, joinedTo }),
                      },
                    ]}
                  />
                </Grid>
              )}

              {tabs === 1 && (
                <Grid columns={3}>
                  <Input
                    type="multiselect"
                    label="Stakeholders"
                    placeholder="Please Select"
                    value={filter.stakeholders}
                    onValue={(stakeholders) =>
                      setFilter({ ...filter, stakeholders })
                    }
                    options={[
                      {
                        value: 1,
                        label: 'Patients & Caregiver',
                      },
                      {
                        value: 2,
                        label: 'Doctor',
                      },
                      {
                        value: 3,
                        label: 'Nurse',
                      },
                    ]}
                  />
                  <InputGroup
                    label="Gender"
                    inputRatio="1fr 100px 75px"
                    elements={[
                      {
                        type: 'multiselect',
                        placeholder: 'Please Select',
                        value: filter.audienceGenderChoices,
                        onValue: (audienceGenderChoices) =>
                          setFilter({ ...filter, audienceGenderChoices }),
                        options: genderOptions,
                      },
                      {
                        type: 'number',
                        placeholder: 'Number',
                        value: filter.audienceGenderCount,
                        onValue: (audienceGenderCount) =>
                          setFilter({ ...filter, audienceGenderCount }),
                      },
                      {
                        type: 'select',
                        placeholder: 'Units',
                        value: filter.audienceGenderUnit,
                        onValue: (audienceGenderUnit) => {
                          if (audienceGenderUnit) {
                            setFilter({ ...filter, audienceGenderUnit });
                          } else {
                            setFilter({
                              ...filter,
                              audienceGenderUnit: {
                                value: '1',
                                label: '#',
                              },
                            });
                          }
                        },

                        options: [
                          {
                            value: 1,
                            label: '#',
                          },
                          {
                            value: 2,
                            label: '%',
                          },
                        ],
                      },
                    ]}
                  />
                  <InputGroup
                    label="Age"
                    inputRatio="1fr 100px 75px"
                    elements={[
                      {
                        type: 'min-max',
                        placeholder: 'Please Enter',
                        value: filter.audienceAgeValues,
                        onValue: (audienceAgeValues) =>
                          setFilter({ ...filter, audienceAgeValues }),
                      },
                      {
                        type: 'number',
                        placeholder: 'Number',
                        value: filter.audienceAgeCount,
                        onValue: (audienceAgeCount) =>
                          setFilter({ ...filter, audienceAgeCount }),
                      },
                      {
                        type: 'select',
                        placeholder: 'Units',
                        value: filter.audienceAgeUnit,
                        onValue: (audienceAgeUnit) => {
                          if (audienceAgeUnit) {
                            setFilter({ ...filter, audienceAgeUnit });
                          } else {
                            setFilter({
                              ...filter,
                              audienceAgeUnit: {
                                value: '1',
                                label: '#',
                              },
                            });
                          }
                        },
                        options: [
                          {
                            value: 1,
                            label: '#',
                          },
                          {
                            value: 2,
                            label: '%',
                          },
                        ],
                      },
                    ]}
                  />
                  <InputGroup
                    label="Ethnicity"
                    inputRatio="1fr 100px 75px"
                    elements={[
                      {
                        type: 'multiselect',
                        placeholder: 'Please Select',
                        value: filter.audienceEthnicityChoices,
                        onValue: (audienceEthnicityChoices) =>
                          setFilter({ ...filter, audienceEthnicityChoices }),
                        options: ethnicityOptions,
                      },
                      {
                        type: 'number',
                        placeholder: 'Number',
                        value: filter.audienceEthnicityCount,
                        onValue: (audienceEthnicityCount) =>
                          setFilter({ ...filter, audienceEthnicityCount }),
                      },
                      {
                        type: 'select',
                        placeholder: 'Units',
                        value: filter.audienceEthnicityUnit,
                        onValue: (audienceEthnicityUnit) => {
                          if (audienceEthnicityUnit) {
                            setFilter({ ...filter, audienceEthnicityUnit });
                          } else {
                            setFilter({
                              ...filter,
                              audienceEthnicityUnit: {
                                value: '1',
                                label: '#',
                              },
                            });
                          }
                        },
                        options: [
                          {
                            value: 1,
                            label: '#',
                          },
                          {
                            value: 2,
                            label: '%',
                          },
                        ],
                      },
                    ]}
                  />
                  <InputGroup
                    label="Location"
                    inputRatio="1fr 100px 75px"
                    elements={[
                      {
                        type: 'multiselect',
                        placeholder: 'Please Select',
                        value: filter.audienceLocationChoices,
                        onValue: (audienceLocationChoices) =>
                          setFilter({ ...filter, audienceLocationChoices }),
                        options: locationsAudienceOptions,
                        onSearch: debounceAudienceLocations,
                      },
                      {
                        type: 'number',
                        placeholder: 'Number',
                        value: filter.audienceLocationCount,
                        onValue: (audienceLocationCount) =>
                          setFilter({ ...filter, audienceLocationCount }),
                      },
                      {
                        type: 'select',
                        placeholder: 'Units',
                        value: filter.audienceLocationUnit,
                        onValue: (audienceLocationUnit) => {
                          if (audienceLocationUnit) {
                            setFilter({ ...filter, audienceLocationUnit });
                          } else {
                            setFilter({
                              ...filter,
                              audienceLocationUnit: {
                                value: '1',
                                label: '#',
                              },
                            });
                          }
                        },
                        options: [
                          {
                            value: 1,
                            label: '#',
                          },
                          {
                            value: 2,
                            label: '%',
                          },
                        ],
                      },
                    ]}
                  />
                  <InputGroup
                    label="Disease Area"
                    inputRatio="1fr 100px 75px"
                    elements={[
                      {
                        type: 'multiselect',
                        placeholder: 'Please Select',
                        value: filter.audienceDiseaseAreaChoices,
                        onValue: (audienceDiseaseAreaChoices) =>
                          setFilter({ ...filter, audienceDiseaseAreaChoices }),
                        options: diseaseAreaOptions,
                        onSearch: debounceDiseaseArea,
                      },
                      {
                        type: 'number',
                        placeholder: 'Number',
                        value: filter.audienceDiseaseAreaCount,
                        onValue: (audienceDiseaseAreaCount) =>
                          setFilter({
                            ...filter,
                            audienceDiseaseAreaCount,
                          }),
                      },
                      {
                        type: 'select',
                        placeholder: 'Units',
                        value: filter.audienceDiseaseAreaUnit,
                        onValue: (audienceDiseaseAreaUnit) => {
                          if (audienceDiseaseAreaUnit) {
                            setFilter({ ...filter, audienceDiseaseAreaUnit });
                          } else {
                            setFilter({
                              ...filter,
                              audienceDiseaseAreaUnit: {
                                value: '1',
                                label: '#',
                              },
                            });
                          }
                        },
                        options: [
                          {
                            value: 1,
                            label: '#',
                          },
                          {
                            value: 2,
                            label: '%',
                          },
                        ],
                      },
                    ]}
                  />
                  <InputGroup
                    label="Struggles"
                    inputRatio="1fr 100px 75px"
                    elements={[
                      {
                        type: 'multiselect',
                        placeholder: 'Please Select',
                        value: filter.audienceStruggleChoices,
                        onValue: (audienceStruggleChoices) =>
                          setFilter({ ...filter, audienceStruggleChoices }),
                        options: struggleOptions,
                      },
                      {
                        type: 'number',
                        placeholder: 'Number',
                        value: filter.audienceStruggleCount,
                        onValue: (audienceStruggleCount) =>
                          setFilter({ ...filter, audienceStruggleCount }),
                      },
                      {
                        type: 'select',
                        placeholder: 'Units',
                        value: filter.audienceStruggleUnit,
                        onValue: (audienceStruggleUnit) => {
                          if (audienceStruggleUnit) {
                            setFilter({ ...filter, audienceStruggleUnit });
                          } else {
                            setFilter({
                              ...filter,
                              audienceStruggleUnit: {
                                value: '1',
                                label: '#',
                              },
                            });
                          }
                        },
                        options: [
                          {
                            value: 1,
                            label: '#',
                          },
                          {
                            value: 2,
                            label: '%',
                          },
                        ],
                      },
                    ]}
                  />
                  <InputGroup
                    label="Interests"
                    inputRatio="1fr 100px 75px"
                    elements={[
                      {
                        type: 'multiselect',
                        placeholder: 'Please Select',
                        value: filter.audienceInterestChoices,
                        onValue: (audienceInterestChoices) =>
                          setFilter({ ...filter, audienceInterestChoices }),
                        options: interestOptions,
                      },
                      {
                        type: 'number',
                        placeholder: 'Number',
                        value: filter.audienceInterestCount,
                        onValue: (audienceInterestCount) =>
                          setFilter({ ...filter, audienceInterestCount }),
                      },
                      {
                        type: 'select',
                        placeholder: 'Units',
                        value: filter.audienceInterestUnit,
                        onValue: (audienceInterestUnit) => {
                          if (audienceInterestUnit) {
                            setFilter({ ...filter, audienceInterestUnit });
                          } else {
                            setFilter({
                              ...filter,
                              audienceInterestUnit: {
                                value: '1',
                                label: '#',
                              },
                            });
                          }
                        },
                        options: [
                          {
                            value: 1,
                            label: '#',
                          },
                          {
                            value: 2,
                            label: '%',
                          },
                        ],
                      },
                    ]}
                  />

                  <InputGroup
                    label="Language"
                    inputRatio="1fr 100px 75px"
                    elements={[
                      {
                        type: 'multiselect',
                        placeholder: 'Please Select',
                        value: filter.audienceLanguageChoices,
                        onValue: (audienceLanguageChoices) =>
                          setFilter({ ...filter, audienceLanguageChoices }),
                        options: languageOptions,
                      },
                      {
                        type: 'number',
                        placeholder: 'Number',
                        value: filter.audienceLanguageCount,
                        onValue: (audienceLanguageCount) =>
                          setFilter({ ...filter, audienceLanguageCount }),
                      },
                      {
                        type: 'select',
                        placeholder: 'Units',
                        value: filter.audienceLanguageUnit,
                        onValue: (audienceLanguageUnit) => {
                          if (audienceLanguageUnit) {
                            setFilter({ ...filter, audienceLanguageUnit });
                          } else {
                            setFilter({
                              ...filter,
                              audienceLanguageUnit: {
                                value: '1',
                                label: '#',
                              },
                            });
                          }
                        },
                        options: [
                          {
                            value: 1,
                            label: '#',
                          },
                          {
                            value: 2,
                            label: '%',
                          },
                        ],
                      },
                    ]}
                  />
                  <Input
                    type="text"
                    label="Keywords"
                    placeholder="Please Enter"
                    value={filter.audienceKeywords}
                    onValue={(audienceKeywords) =>
                      setFilter({ ...filter, audienceKeywords })
                    }
                  />
                </Grid>
              )}

              {tabs === 2 && (
                <Grid columns={4}>
                  <Input
                    type="select"
                    label="Post Type"
                    placeholder="Please Select"
                    value={filter.performancePostType}
                    onValue={(performancePostType) =>
                      setFilter({ ...filter, performancePostType })
                    }
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
                    type="min-max"
                    label="Cost Per Click"
                    value={filter.costPerClick}
                    onValue={(costPerClick) =>
                      setFilter({ ...filter, costPerClick })
                    }
                  /> */}
                  <Input
                    type="min-max"
                    label="Cost Per Target"
                    value={filter.costPerTarget}
                    onValue={(costPerTarget) =>
                      setFilter({ ...filter, costPerTarget })
                    }
                  />
                  <Input
                    type="min-max"
                    label="Cost Per Question Credit"
                    value={filter.costPerQuestionCredit}
                    onValue={(costPerQuestionCredit) =>
                      setFilter({ ...filter, costPerQuestionCredit })
                    }
                  />
                  {/* <Input
                    type="min-max"
                    label="Reach Multiplier"
                    value={filter.reachMultiplier}
                    onValue={(reachMultiplier) =>
                      setFilter({ ...filter, reachMultiplier })
                    }
                  /> */}
                  {/* Desired Amount / prosecan broj lajkova u zadnjih 5%? Wtf  */}
                  <Input
                    type="min-max"
                    label="Cost Per Like"
                    value={filter.costPerLike}
                    onValue={(costPerLike) =>
                      setFilter({ ...filter, costPerLike })
                    }
                  />
                  <Input
                    type="min-max"
                    label="Cost Per Comment"
                    value={filter.costPerComment}
                    onValue={(costPerComment) =>
                      setFilter({ ...filter, costPerComment })
                    }
                  />
                  {/* Desired amount / (likes + comments) */}
                  <Input
                    type="min-max"
                    label="Cost Per Engagement"
                    value={filter.costPerEngagement}
                    onValue={(costPerEngagement) =>
                      setFilter({ ...filter, costPerEngagement })
                    }
                  />
                  {/* <Input
                    type="min-max"
                    label="Cost Per Engaged Target"
                    value={filter.costPerEngagedTarget}
                    onValue={(costPerEngagedTarget) =>
                      setFilter({ ...filter, costPerEngagedTarget })
                    }
                  /> */}
                  <Input
                    type="min-max"
                    label="Total Earnings"
                    value={filter.totalEarnings}
                    onValue={(totalEarnings) =>
                      setFilter({ ...filter, totalEarnings })
                    }
                  />
                  <Input
                    type="min-max"
                    label="Earnings Last 30 Days"
                    value={filter.earningsLast30Days}
                    onValue={(earningsLast30Days) =>
                      setFilter({ ...filter, earningsLast30Days })
                    }
                  />
                  <Input
                    type="min-max"
                    label="Total Projects"
                    value={filter.totalProjects}
                    onValue={(totalProjects) =>
                      setFilter({ ...filter, totalProjects })
                    }
                  />
                  <Input
                    type="min-max"
                    label="Projects Last 30 Days"
                    value={filter.projectsLast30Days}
                    onValue={(projectsLast30Days) =>
                      setFilter({ ...filter, projectsLast30Days })
                    }
                  />
                </Grid>
              )}

              {tabs === 3 && (
                <Grid columns={4}>
                  {/* Limit? */}
                  <Input
                    type="number"
                    label="Influencers needed"
                    value={filter.influencersNeeded}
                    placeholder="Please Enter"
                    onValue={(influencersNeeded) =>
                      setFilter({ ...filter, influencersNeeded })
                    }
                  />
                  <Input
                    type="number"
                    label="Audience overlap"
                    placeholder="Please Enter"
                    value={filter.audienceOverlap}
                    endAdornment="%"
                    max={100}
                    min={0}
                    onValue={(audienceOverlap) =>
                      setFilter({ ...filter, audienceOverlap })
                    }
                  />
                  <Input
                    type="select"
                    label="Prioritize by"
                    placeholder="Please Select"
                    value={filter.prioritizeBy}
                    onValue={(prioritizeBy) =>
                      setFilter({ ...filter, prioritizeBy })
                    }
                    options={[
                      {
                        value: 'costPerTarget',
                        label: 'Cost Per Target',
                      },
                      {
                        value: 'costPerEngagement',
                        label: 'Cost Per Engagement',
                      },

                      {
                        value: 'postDesiredAmount',
                        label: 'Post Amount',
                      },
                      {
                        value: 'reelDesiredAmount',
                        label: 'Reel Amount',
                      },
                      {
                        value: 'storyDesiredAmount',
                        label: 'Story Amount',
                      },
                      {
                        value: 'questionCreditDesiredAmount',
                        label: 'Question Credit Amount',
                      },
                    ]}
                  />
                </Grid>
              )}

              <InfluencersPageFilterActions direction="horizontal">
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
                  onClick={() => clearFilters()}
                >
                  Clear filter
                </Button>
              </InfluencersPageFilterActions>
            </InfluencersPageFilter>
          </Collapse>
          <>
            <NewCheckboxTable
              head={DInfluencersHead}
              items={influencers}
              renderItem={renderItem}
              checkedRows={checkedInfluencers}
              onSingleSelect={toggleInfluencer}
              onSelectAll={toggleAllCheckedInfluencers}
              tableColModal={tableModal}
              closeTableColModal={closeTableModal}
              renderElements={
                <>
                  <ISpan onClick={handleMenu} ref={buttonRegRef}>
                    <VerticalDotsIcon />
                  </ISpan>
                  {open && (
                    <CustomActionsMenu
                      position={position}
                      items={influencerBulkActions}
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
        </Stack>
      </CardWithText>
      {removeBulkInfModal && (
        <PromptModal
          plural
          onClose={() => {
            closeRemoveBulkInfModal();
          }}
          handleAction={handleBulkInfRemoval}
        />
      )}
      {aiModal && (
        <AddToInfluencerModal
          onClose={closeAiModal}
          checkedInfluencers={checkedInfluencers}
          setCheckedInfluencers={setCheckedInfluencers}
        />
      )}
      {donateiModal && <DonateInfluencerModal onClose={closeDonateiModal} />}
      {mlModal && (
        <MlInfluencerModal
          onClose={closeMlModal}
          checkedInfluencers={checkedInfluencers}
        />
      )}
      {eModal && (
        <ExportInfluencersModal
          onClose={closeEModal}
          checkedInfluencers={checkedInfluencers}
        />
      )}
      {diModal && <DeleteInfluencerModal onClose={closeDiModal} />}
      {ciModal && <ContactInfluencerModal onClose={closeCiModal} />}
      {siModal && <ScheduleInfluencerModal onClose={closeSiModal} />}
      {nsModal && <NotificationsSettingsModal onClose={closeNsModal} />}
      {ipModal && (
        <InfluencerProfile
          onClose={closeIpModal}
          reload={reload}
          userId={currentInfluencer}
        />
      )}
      {niModal && <NoteInfluencer onClose={closeNiModal} />}
      {cfrmModal && <ConfirmInfluencerModal onClose={closeCfrmModal} />}
    </InfluencersPageMain>
  );
};

export default InfluencersPage;
