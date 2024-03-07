import React, { useEffect, useState } from 'react';
import {
  BenefitsPageMain,
  BenefitsPageCharts,
  BenefitsPageFilter,
  BenefitsPageFilterActions,
  ActionsMenu,
  ISpan,
  TableTooltip,
  IDiv,
  ThumbsWrapper,
  ThumbsIcon,
  TableModalLink,
} from 'features/benefits/role/admin/styles';
import {
  DActiveSuggestionsHead,
  DFinanceHead,
  DGenerateFinanceFilter,
  DToBeApprovedSuggestionsHead,
} from 'features/benefits/role/admin/data';
import {
  CardWithChartBenefits,
  CardWithText,
  Tabs,
  NewCheckboxTable,
} from 'components/custom';
import {
  ApparelIcon,
  BeautyIcon,
  DeleteIcon,
  ElectronicsIcon,
  FoodIcon,
  FurnitureIcon,
  HealthIcon,
  LeisureIcon,
  LockIcon,
  NutritionIcon,
  PetCareIcon,
  ServicesBIcon,
  SlidersHorizontalIcon,
  TravelIcon,
  AccesoriesIcon,
  VerticalDotsIcon,
  ApproveIcon,
  ThumbsUpIcon,
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
  AddBenefitModal,
  ExportBenefitsModal,
  ConfirmUpdateSuggestionModal,
  CreateSuggestion,
  SuggestionActions,
  BenefitActions,
  PromptModal,
  ChangeBenefit,
  SuggestionInfoModal,
} from 'features/benefits/role/admin/elements';
import { BenefitsAPI, LocationAPI } from 'api';
import Link from 'next/link';
import { ensureHttpsProtocol } from 'utilities/converters';
import { IBenefitSuggestion, IPaginatedBenefit } from 'api/benefits/types';
import { Tooltip } from '@mui/material';
import { formatLongString } from 'utilities/string-converter';
import { BackupTableRounded } from '@mui/icons-material';
import { AxiosError } from 'axios';
import { useAppContext } from 'context';
import { fetchAndCacheData } from 'utilities/local-storage';
import { reloadResources } from 'i18next';

interface IFilterCategory {
  value: string;
  label: string;
}
interface IFilterLocation {
  value: string;
  label: string;
}
interface IFilterBenefitsParams {
  search?: string;
  category?: IFilterCategory | null;
  location?: IFilterLocation | null;
}

const BenefitsPage = () => {
  const { user } = useAppContext();
  const [abModal, openAbModal, closeAbModal] = useModal(false);
  const [ebModal, openEbModal, closeEbModal] = useModal(false);
  const [cusModal, openCusModal, closeCusModal] = useModal(false);
  const [csModal, openCsModal, closeCsModal] = useModal(false);
  const [biModal, openBiModal, closeBiModal] = useModal(false);
  const [bSiModal, openBSiModal, closeBSiModal] = useModal(false);

  const [benefitsOverTime1, setBenefitsOverTimeData1] = useState<any>([]);
  const [benefitsOverTime2, setBenefitsOverTimeData2] = useState<any>([]);
  const [benefitsOverTime3, setBenefitsOverTimeData3] = useState<any>([]);
  const [benefitsOverTime4, setBenefitsOverTimeData4] = useState<any>([]);
  const [benefitsOverTime5, setBenefitsOverTimeData5] = useState<any>([]);
  const [benefitsOverTime6, setBenefitsOverTimeData6] = useState<any>([]);
  const [benefitsOverTime7, setBenefitsOverTimeData7] = useState<any>([]);
  const [benefitsOverTime8, setBenefitsOverTimeData8] = useState<any>([]);
  const [benefitsOverTime9, setBenefitsOverTimeData9] = useState<any>([]);
  const [benefitsOverTime10, setBenefitsOverTimeData10] = useState<any>([]);
  const [benefitsOverTime11, setBenefitsOverTimeData11] = useState<any>([]);
  const [benefitsOverTime12, setBenefitsOverTimeData12] = useState<any>([]);

  const [categories, setCategories] = useState<any>([]);

  const getCategories = async () => {
    const result = await BenefitsAPI.getBenefitsCategories();

    setCategories(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const [locations, setLocations] = useState<any>([]);

  const getLocations = async (searchTerm: string = '') => {
    const { result } = await LocationAPI.getAll(searchTerm);

    setLocations(
      result.map((x: any) => ({
        value: x.id,
        label: x.country ? `${x.name}, ${x.country.name}` : x.name,
      }))
    );
  };

  const debouncedLocation = useDebounce(getLocations, 250);
  const debouncedCategories = useDebounce(getCategories, 250);

  const [benefits, setBenefits] = useState<IPaginatedBenefit[]>([]);
  const [checkedBenefits, setCheckedBenefits] = useState<number[]>([]);

  const [filterParams, setFilterParams] = useState({});

  const [current, setCurrent] = useState<IPaginatedBenefit>();
  const [currentSuggestion, setCurrentSuggestion] =
    useState<IBenefitSuggestion>();

  const [filter, setFilter] = useState<IFilterBenefitsParams>(
    DGenerateFinanceFilter()
  );

  const { pagesCount, page, setTotalResults, handlePageChange, reload } =
    usePagination({
      limit: 10,
      page: 1,
      onChange: async (params, setPage) => {
        // TODO Go back and reformat filters to send only array of ids instead objects
        const { result, meta } = await BenefitsAPI.getBenefits({
          limit: params.limit,
          skip: params.skip,
          ...filter,
        });
        setBenefits(result);
        setTotalResults(meta.countFiltered);
      },
    });

  const [activeSuggestions, setActiveSuggestions] = useState<
    IBenefitSuggestion[]
  >([]);
  const [checkedActiveSuggestions, setCheckedActiveSuggestions] = useState<
    number[]
  >([]);

  const [tbaSuggestions, setTbaSuggestions] = useState<IBenefitSuggestion[]>(
    []
  );
  const [checkedTbaSuggestions, setCheckedTbaSuggestions] = useState<number[]>(
    []
  );

  const [filterParamsSTBA, setFilterParamsSTBA] = useState({ status: 0 });
  const [filterParamsSActive, setFilterParamsSActive] = useState({ status: 1 });

  const {
    pagesCount: sTbaPageCount,
    page: sTbaPage,
    setTotalResults: setTotalsResultsSTba,
    handlePageChange: handlePageChangeSTba,
    reload: reloadSTba,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta } = await BenefitsAPI.getSuggestions({
        limit: params.limit,
        skip: params.skip,
        search: '',
        ...filterParamsSTBA,
      });

      setPage(params.page);

      setTbaSuggestions(result);
      setTotalsResultsSTba(meta.countFiltered);
    },
  });

  const {
    pagesCount: sAPageCount,
    page: sAPage,
    setTotalResults: setTotalsResultsSA,
    handlePageChange: handlePageChangeSA,
    reload: reloadSA,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta } = await BenefitsAPI.getSuggestions({
        limit: params.limit,
        skip: params.skip,
        search: '',
        ...filterParamsSActive,
      });

      setPage(params.page);

      setActiveSuggestions(result);
      setTotalsResultsSA(meta.countFiltered);
    },
  });

  const handleSuggestionsReload = async () => {
    reloadSA();
    reloadSTba();
  };

  // Checkbox Handlers

  // Benefits
  const toggleBenefit = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedBenefits([...checkedBenefits, rowId]);
    } else {
      setCheckedBenefits(checkedBenefits.filter((id) => id !== rowId));
    }
  };

  const toggleAllCheckedBenefits = (checked: boolean) => {
    if (checked) {
      const currentPageIds = benefits.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedBenefits, ...currentPageIds])
      );
      setCheckedBenefits(newSelectedRows);
    } else {
      const currentPageIds = benefits.map((row: any) => row.id);
      const newSelectedRows = checkedBenefits.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedBenefits(newSelectedRows);
    }
  };

  // To Be Approved Suggestions

  const toggleTBASuggestion = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedTbaSuggestions([...checkedTbaSuggestions, rowId]);
    } else {
      setCheckedTbaSuggestions(
        checkedTbaSuggestions.filter((id) => id !== rowId)
      );
    }
  };

  const toggleAllCheckedTbaSuggestions = (checked: boolean) => {
    if (checked) {
      const currentPageIds = tbaSuggestions.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedTbaSuggestions, ...currentPageIds])
      );
      setCheckedTbaSuggestions(newSelectedRows);
    } else {
      const currentPageIds = tbaSuggestions.map((row: any) => row.id);
      const newSelectedRows = checkedTbaSuggestions.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedTbaSuggestions(newSelectedRows);
    }
  };

  // Active Suggestions
  const toggleActiveSuggestion = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedActiveSuggestions([...checkedActiveSuggestions, rowId]);
    } else {
      setCheckedActiveSuggestions(
        checkedActiveSuggestions.filter((id) => id !== rowId)
      );
    }
  };

  const toggleAllCheckedActiveSuggestions = (checked: boolean) => {
    if (checked) {
      const currentPageIds = activeSuggestions.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedActiveSuggestions, ...currentPageIds])
      );
      setCheckedActiveSuggestions(newSelectedRows);
    } else {
      const currentPageIds = activeSuggestions.map((row: any) => row.id);
      const newSelectedRows = checkedActiveSuggestions.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedActiveSuggestions(newSelectedRows);
    }
  };

  const [
    menuBenefit,
    openBenefit,
    setOpenBenefit,
    buttonBenefitRef,
    benefitPosition,
  ] = useMenu(false);

  const [
    menuTbaSuggestion,
    openTbaSuggestion,
    setOpenTbaSuggestion,
    buttonTbaSRef,
    tbaSPosition,
  ] = useMenu(false);
  const [
    menuActiveSuggestion,
    openActiveSuggestion,
    setOpenActiveSuggestion,
    buttonASRef,
    asPosition,
  ] = useMenu(false);

  const [
    removeBulkBenefitsModal,
    openRemoveBulkBenefitsModal,
    closeRemoveBulkBenefitsModal,
  ] = useModal(false);

  const [
    removeBulkTBASuggestionsModal,
    openRemoveBulkTBASuggestionsModal,
    closeRemoveBulkTBASuggestionsModal,
  ] = useModal(false);

  const [
    removeBulkActiveSuggestionsModal,
    openRemoveBulkActiveSuggestionsModal,
    closeRemoveBulkActiveSuggestionsModal,
  ] = useModal(false);

  const [
    approveBulkTBASuggestionsModal,
    openApproveBulkTBASuggestionsModal,
    closeApproveBulkTBASuggestionsModal,
  ] = useModal(false);

  const { push } = useSnackbar();

  const handleApproveSuggestion = async () => {
    if (!checkedTbaSuggestions.length) {
      push('Please select suggestions you want to approve', {
        variant: 'warning',
      });
    }

    await BenefitsAPI.approveManySuggestions({
      suggestionIds: checkedTbaSuggestions,
    })
      .then(() => {
        setCheckedTbaSuggestions([]);
        handleSuggestionsReload();
        push('You have successfully approved multiple suggestions.', {
          variant: 'success',
        });
      })
      .catch((err) => {
        const error = err as AxiosError<any>;

        if (error.isAxiosError) {
          push('Something went wrong.', { variant: 'error' });
        }
      });
  };

  const handleDeleteSelectedActiveSuggestions = async () => {
    if (!checkedActiveSuggestions.length) {
      push('You did not select any suggestions to delete.', {
        variant: 'warning',
      });
      return;
    }

    await BenefitsAPI.deleteManySuggestions({
      suggestionIds: checkedActiveSuggestions,
    })
      .then(() => {
        setCheckedActiveSuggestions([]);
        reloadSA();
        push('You did have successfully deleted selected suggestions.', {
          variant: 'success',
        });
      })
      .catch((err) => {
        const error = err as AxiosError<any>;

        if (error.isAxiosError) {
          push('Something went wrong.', { variant: 'error' });
        }
      });
  };
  const handleDeleteSelectedTBASuggestions = async () => {
    if (!checkedTbaSuggestions.length) {
      push('You did not select any suggestions to delete.', {
        variant: 'warning',
      });
      return;
    }

    await BenefitsAPI.deleteManySuggestions({
      suggestionIds: checkedTbaSuggestions,
    })
      .then(() => {
        setCheckedTbaSuggestions([]);
        reloadSTba();
        push('You did have successfully deleted selected suggestions.', {
          variant: 'success',
        });
      })
      .catch((err) => {
        const error = err as AxiosError<any>;

        if (error.isAxiosError) {
          push('Something went wrong.', { variant: 'error' });
        }
      });
  };
  const handleDeleteSelectedBenefits = async () => {
    // deleteManyBenefits
    if (!checkedBenefits.length) {
      push('You did not select any benefits to delete.', {
        variant: 'warning',
      });
      return;
    }

    await BenefitsAPI.deleteManyBenefits({
      benefitIds: checkedBenefits,
    })
      .then(() => {
        setCheckedBenefits([]);
        reload();
        push('You did have successfully deleted selected benefits.', {
          variant: 'success',
        });
      })
      .catch((err) => {
        const error = err as AxiosError<any>;

        if (error.isAxiosError) {
          push('Something went wrong.', { variant: 'error' });
        }
      });
  };

  const [benefitTModal, openBenefitTModal, closeBenefitTModal] =
    useModal(false);
  const [saTModal, openSaTModal, closeSaTModal] = useModal(false);
  const [sTbaTModal, openSTbaTModal, closeSTbaTModal] = useModal(false);

  const handleTBASuggestionMenu = () => {
    setOpenTbaSuggestion((prevState: boolean) => !prevState);
  };

  const handleActiveSuggestionMenu = () => {
    setOpenActiveSuggestion((prevState: boolean) => !prevState);
  };

  const handleBenefitMenu = () => {
    setOpenBenefit((prevState: boolean) => !prevState);
  };

  const handleVote = async (suggestionId: number, isUpvoted: boolean) => {
    if (!isUpvoted) {
      await BenefitsAPI.upvoteSuggestion(suggestionId).then(() => {
        reloadSA();
      });
    }

    if (isUpvoted) {
      await BenefitsAPI.downvoteSuggestion(suggestionId).then(() => {
        reloadSA();
      });
    }
  };

  const [filterOpen, setFilterOpen] = useState(false);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const [filterCleared, setFilterCleared] = useState(false);

  const clearFilters = () => {
    setFilter(() => DGenerateFinanceFilter());
    setFilterCleared(true);
  };

  useEffect(() => {
    if (filterCleared) {
      reload();
      setFilterCleared(false);
    }
  }, [filter, filterCleared]);

  const benefitBulkActions = [
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        handleBenefitMenu();
        openBenefitTModal();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        handleBenefitMenu();
        openRemoveBulkBenefitsModal();
      },
    },
  ];

  const tbaSuggestionActions = [
    {
      icon: <ApproveIcon />,
      label: 'Approve',
      action: () => {
        handleTBASuggestionMenu();
        openApproveBulkTBASuggestionsModal();
      },
    },
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        handleTBASuggestionMenu();
        openSTbaTModal();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        handleTBASuggestionMenu();
        openRemoveBulkTBASuggestionsModal();
      },
    },
  ];

  const activeSuggestionActions = [
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        handleActiveSuggestionMenu();
        openSaTModal();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        handleActiveSuggestionMenu();
        openRemoveBulkActiveSuggestionsModal();
      },
    },
  ];

  const renderBenefitItem = ({ headItem, row }: TTableRenderItemObject) => {
    const benefitRow = row.data as IPaginatedBenefit;
    if (headItem.reference === 'company') {
      if (benefitRow.benefitPartnership?.name) {
        return (
          <TableModalLink
            onClick={() => {
              setCurrent(row.data);
              openBiModal();
            }}
          >
            {benefitRow.benefitPartnership.name}
          </TableModalLink>
        );
      }
    }
    if (headItem.reference === 'category') {
      if (benefitRow.benefitCategory?.name) {
        return benefitRow.benefitCategory.name;
      }
    }
    if (headItem.reference === 'location') {
      if (benefitRow.benefitLocations.length > 0) {
        const locationsInList = benefitRow.benefitLocations
          .map((benefitLocation) => {
            if (benefitLocation.location.country) {
              return `${benefitLocation.location.name} (${benefitLocation.location.country.name})`;
            }
            return benefitLocation.location.name;
          })
          .join(', ');

        const formattedElipsisString = formatLongString(locationsInList, 50);
        return (
          <Tooltip
            style={{ cursor: 'pointer' }}
            title={<TableTooltip>{locationsInList}</TableTooltip>}
          >
            <span>{formattedElipsisString}</span>
          </Tooltip>
        );
      }

      return '';
    }
    if (headItem.reference === 'link') {
      return (
        <Link
          href={ensureHttpsProtocol(benefitRow.benefitCompanyLink)}
          target="_blank"
        >
          <LockIcon />
        </Link>
      );
      // return benefitRow.benefitCompanyLink;
    }
    if (headItem.reference === 'benefit') {
      return benefitRow.description;
    }

    if (headItem.reference === 'actions') {
      return <BenefitActions reload={reload} data={benefitRow} />;
    }

    return '';
  };

  const renderItemSuggestions = ({ headItem, row }: TTableRenderItemObject) => {
    const suggestionItem = row.data as IBenefitSuggestion;
    if (headItem.reference === 'company') {
      return (
        <TableModalLink
          onClick={() => {
            setCurrentSuggestion(row.data);
            openBSiModal();
          }}
        >
          {suggestionItem.partnershipName || ''}
        </TableModalLink>
      );
    }

    if (headItem.reference === 'website') {
      return (
        <Link
          href={ensureHttpsProtocol(suggestionItem.partnershipLink)}
          target="_blank"
        >
          <LockIcon />
        </Link>
      );
    }
    if (headItem.reference === 'argument') {
      return suggestionItem.argumentDescription;
    }
    if (headItem.reference === 'desiredOutcome') {
      return suggestionItem.outcomeDescription;
    }

    if (headItem.reference === 'statusDescription') {
      if (!suggestionItem.statusDescription) {
        return '';
      }
      const formattedElipsisString = formatLongString(
        suggestionItem.statusDescription,
        50
      );
      return (
        <Tooltip
          style={{ cursor: 'pointer' }}
          title={
            <TableTooltip>{suggestionItem.statusDescription}</TableTooltip>
          }
        >
          <span>{formattedElipsisString}</span>
        </Tooltip>
      );
    }

    if (headItem.reference === 'vote') {
      const existingUpvote = suggestionItem.benefitUpvoteCounts.find(
        (benefitUpvote) =>
          benefitUpvote.benefitSuggestionId === suggestionItem.id &&
          benefitUpvote.userId === user.id
      );
      return (
        <ThumbsWrapper>
          <ISpan
            onClick={() =>
              handleVote(
                suggestionItem.id,
                !!(existingUpvote && existingUpvote.isUpvoted)
              )
            }
          >
            {/*  active={suggestionItem.benefitUpvoteCounts.length && suggestionItem.benefitUpvoteCounts.filter(benefitUpvote => benefitUpvote)} */}
            <ThumbsIcon
              active={!!(existingUpvote && existingUpvote.isUpvoted)}
            />
          </ISpan>
          {
            suggestionItem.benefitUpvoteCounts.filter(
              (benefitCount) => benefitCount.isUpvoted
            ).length
          }
        </ThumbsWrapper>
      );
    }

    if (headItem.reference === 'actions') {
      return (
        <SuggestionActions
          reload={handleSuggestionsReload}
          data={suggestionItem}
        />
      );
    }

    return '';
  };

  const getBenefitsOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response = await BenefitsAPI.getBenefitsOverTimeData({
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

  const getBenefitsGraphDataAsync =
    (
      categoryId: number,
      setDataFunction: (data: any) => void,
      key: string,
      maxResults: number | undefined = undefined
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getBenefitsOverTimeData({
            categoryId,
            graphType: 'cumulative',
            maxResults,
            includeData: ['changePercentageMonth'],
          }),
        key
      );

      setDataFunction(result);
    };

  useEffect(() => {
    getCategories();
    getLocations();
    getBenefitsGraphDataAsync(
      1,
      setBenefitsOverTimeData1,
      'setBenefitsOverTimeData1',
      1
    )();
    getBenefitsGraphDataAsync(
      2,
      setBenefitsOverTimeData2,
      'setBenefitsOverTimeData2'
    )();
    getBenefitsGraphDataAsync(
      3,
      setBenefitsOverTimeData3,
      'setBenefitsOverTimeData3'
    )();
    getBenefitsGraphDataAsync(
      4,
      setBenefitsOverTimeData4,
      'setBenefitsOverTimeData4'
    )();
    getBenefitsGraphDataAsync(
      5,
      setBenefitsOverTimeData5,
      'setBenefitsOverTimeData5'
    )();
    getBenefitsGraphDataAsync(
      6,
      setBenefitsOverTimeData6,
      'setBenefitsOverTimeData6'
    )();
    getBenefitsGraphDataAsync(
      7,
      setBenefitsOverTimeData7,
      'setBenefitsOverTimeData7'
    )();
    getBenefitsGraphDataAsync(
      8,
      setBenefitsOverTimeData8,
      'setBenefitsOverTimeData8'
    )();
    getBenefitsGraphDataAsync(
      9,
      setBenefitsOverTimeData9,
      'setBenefitsOverTimeData9'
    )();
    getBenefitsGraphDataAsync(
      10,
      setBenefitsOverTimeData10,
      'setBenefitsOverTimeData10'
    )();
    getBenefitsGraphDataAsync(
      11,
      setBenefitsOverTimeData11,
      'setBenefitsOverTimeData11'
    )();
    getBenefitsGraphDataAsync(
      12,
      setBenefitsOverTimeData12,
      'setBenefitsOverTimeData12'
    )();
  }, []);

  const [tabs, setTabs] = useState(0);

  return (
    <BenefitsPageMain>
      <BenefitsPageCharts columns={4}>
        <CardWithChartBenefits
          title="Accessories"
          icon={<AccesoriesIcon />}
          // eslint-disable-next-line no-unsafe-optional-chaining
          relativeGrowth={benefitsOverTime1?.changePercentageMonth / 100}
          count={
            benefitsOverTime1?.data
              ? benefitsOverTime1?.data[benefitsOverTime1.data.length - 1].value
              : 0
          }
        />
        <CardWithChartBenefits
          title="Apparel & Footwear"
          icon={<ApparelIcon />}
          relativeGrowth={
            // eslint-disable-next-line no-unsafe-optional-chaining
            benefitsOverTime2?.changePercentageMonth / 100
          }
          count={
            benefitsOverTime2?.data
              ? benefitsOverTime2?.data[benefitsOverTime2.data.length - 1].value
              : 0
          }
        />
        <CardWithChartBenefits
          title="Beauty & Personal Care"
          icon={<BeautyIcon />}
          relativeGrowth={
            // eslint-disable-next-line no-unsafe-optional-chaining
            benefitsOverTime3?.changePercentageMonth / 100
          }
          count={
            benefitsOverTime3?.data
              ? benefitsOverTime3?.data[benefitsOverTime3.data.length - 1].value
              : 0
          }
        />
        <CardWithChartBenefits
          title="Electronics"
          icon={<ElectronicsIcon />}
          relativeGrowth={
            // eslint-disable-next-line no-unsafe-optional-chaining
            benefitsOverTime4?.changePercentageMonth / 100
          }
          count={
            benefitsOverTime4?.data
              ? benefitsOverTime4?.data[benefitsOverTime4.data.length - 1].value
              : 0
          }
        />
        <CardWithChartBenefits
          title="Food & Beverage"
          icon={<FoodIcon />}
          relativeGrowth={
            // eslint-disable-next-line no-unsafe-optional-chaining
            benefitsOverTime5?.changePercentageMonth / 100
          }
          count={
            benefitsOverTime5?.data
              ? benefitsOverTime5?.data[benefitsOverTime5.data.length - 1].value
              : 0
          }
        />
        <CardWithChartBenefits
          title="Furniture"
          icon={<FurnitureIcon />}
          relativeGrowth={
            // eslint-disable-next-line no-unsafe-optional-chaining
            benefitsOverTime6?.changePercentageMonth / 100
          }
          count={
            benefitsOverTime6?.data
              ? benefitsOverTime6?.data[benefitsOverTime6.data.length - 1].value
              : 0
          }
        />
        <CardWithChartBenefits
          title="Health & Wellness"
          icon={<HealthIcon />}
          relativeGrowth={
            // eslint-disable-next-line no-unsafe-optional-chaining
            benefitsOverTime7?.changePercentageMonth / 100
          }
          count={
            benefitsOverTime7?.data
              ? benefitsOverTime7?.data[benefitsOverTime7.data.length - 1].value
              : 0
          }
        />
        <CardWithChartBenefits
          title="Leasure"
          icon={<LeisureIcon />}
          relativeGrowth={
            // eslint-disable-next-line no-unsafe-optional-chaining
            benefitsOverTime8?.changePercentageMonth / 100
          }
          count={
            benefitsOverTime8?.data
              ? benefitsOverTime8?.data[benefitsOverTime8.data.length - 1].value
              : 0
          }
        />
        <CardWithChartBenefits
          title="Nutrition"
          icon={<NutritionIcon />}
          relativeGrowth={
            // eslint-disable-next-line no-unsafe-optional-chaining
            benefitsOverTime9?.changePercentageMonth / 100
          }
          count={
            benefitsOverTime9?.data
              ? benefitsOverTime9?.data[benefitsOverTime9.data.length - 1].value
              : 0
          }
        />
        <CardWithChartBenefits
          title="Pet Care"
          icon={<PetCareIcon />}
          relativeGrowth={
            // eslint-disable-next-line no-unsafe-optional-chaining
            benefitsOverTime10?.changePercentageMonth / 100
          }
          count={
            benefitsOverTime10?.data
              ? benefitsOverTime10?.data[benefitsOverTime10.data.length - 1]
                  .value
              : 0
          }
        />
        <CardWithChartBenefits
          title="Services"
          icon={<ServicesBIcon />}
          relativeGrowth={
            // eslint-disable-next-line no-unsafe-optional-chaining
            benefitsOverTime11?.changePercentageMonth / 100
          }
          count={
            benefitsOverTime11?.data
              ? benefitsOverTime11?.data[benefitsOverTime11.data.length - 1]
                  .value
              : 0
          }
        />
        <CardWithChartBenefits
          title="Travel"
          icon={<TravelIcon />}
          relativeGrowth={
            // eslint-disable-next-line no-unsafe-optional-chaining
            benefitsOverTime12?.changePercentageMonth / 100
          }
          count={
            benefitsOverTime12?.data
              ? benefitsOverTime12?.data[benefitsOverTime12.data.length - 1]
                  .value
              : 0
          }
        />
      </BenefitsPageCharts>
      <CardWithText
        title="Benefits"
        actions={[
          <Button
            key={1}
            color={filterOpen ? 'secondary' : 'default'}
            variant="contained"
            onClick={toggleFilter}
            startIcon={<SlidersHorizontalIcon width="18" height="18" />}
          >
            Filters
          </Button>,
          <Button
            key={2}
            color="default"
            variant="contained"
            onClick={openEbModal}
          >
            Export
          </Button>,
          <Button
            key={3}
            color="primary"
            variant="contained"
            onClick={openAbModal}
          >
            Add Benefit
          </Button>,
        ]}
      >
        <Stack>
          <Collapse removeGap in={filterOpen}>
            <BenefitsPageFilter>
              <Grid columns={4}>
                <Input
                  type="text"
                  label="Search For Benefit"
                  placeholder="Search For Benefit"
                  value={filter.search}
                  onValue={(search) => {
                    setFilter((prevState: any) => ({ ...prevState, search }));
                  }}
                />
                <Input
                  type="select"
                  label="Location"
                  placeholder="Please Select"
                  value={filter.location}
                  onSearch={debouncedLocation}
                  onValue={(location) => setFilter({ ...filter, location })}
                  options={locations}
                />
                <Input
                  type="select"
                  label="Category"
                  onSearch={debouncedCategories}
                  placeholder="Please Select"
                  value={filter.category}
                  onValue={(category) => setFilter({ ...filter, category })}
                  options={categories}
                />
              </Grid>
              <BenefitsPageFilterActions direction="horizontal">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => reload()}
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
              </BenefitsPageFilterActions>
            </BenefitsPageFilter>
          </Collapse>
          <NewCheckboxTable
            head={DFinanceHead}
            items={benefits}
            renderItem={renderBenefitItem}
            checkedRows={checkedBenefits}
            onSingleSelect={toggleBenefit}
            onSelectAll={toggleAllCheckedBenefits}
            tableColModal={benefitTModal}
            closeTableColModal={closeBenefitTModal}
            renderElements={
              <>
                <IDiv onClick={handleBenefitMenu} ref={buttonBenefitRef}>
                  <VerticalDotsIcon />
                </IDiv>
                {openBenefit && (
                  <ActionsMenu
                    position={benefitPosition}
                    items={benefitBulkActions}
                    ref={menuBenefit}
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
        </Stack>
      </CardWithText>
      <CardWithText
        title="Suggestions"
        actions={[
          <Button
            key={4}
            color="primary"
            variant="contained"
            onClick={openCsModal}
          >
            Suggest
          </Button>,
        ]}
      >
        <Stack>
          <Tabs
            value={tabs}
            onValue={setTabs}
            tabs={['Active', 'To Be Approved']}
          />
          {tabs === 0 ? (
            <>
              <NewCheckboxTable
                head={DActiveSuggestionsHead}
                items={activeSuggestions}
                renderItem={renderItemSuggestions}
                checkedRows={checkedActiveSuggestions}
                onSingleSelect={toggleActiveSuggestion}
                onSelectAll={toggleAllCheckedActiveSuggestions}
                tableColModal={saTModal}
                closeTableColModal={closeSaTModal}
                renderElements={
                  <>
                    <IDiv
                      onClick={handleActiveSuggestionMenu}
                      ref={buttonASRef}
                    >
                      <VerticalDotsIcon />
                    </IDiv>
                    {openActiveSuggestion && (
                      <ActionsMenu
                        position={asPosition}
                        items={activeSuggestionActions}
                        ref={menuActiveSuggestion}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handlePageChangeSA(x)}
                page={sAPage}
                count={sAPageCount}
              />
            </>
          ) : undefined}
          {tabs === 1 ? (
            <>
              <NewCheckboxTable
                head={DToBeApprovedSuggestionsHead}
                items={tbaSuggestions}
                renderItem={renderItemSuggestions}
                checkedRows={checkedTbaSuggestions}
                onSingleSelect={toggleTBASuggestion}
                onSelectAll={toggleAllCheckedTbaSuggestions}
                tableColModal={sTbaTModal}
                closeTableColModal={closeSTbaTModal}
                renderElements={
                  <>
                    <IDiv onClick={handleTBASuggestionMenu} ref={buttonTbaSRef}>
                      <VerticalDotsIcon />
                    </IDiv>
                    {openTbaSuggestion && (
                      <ActionsMenu
                        position={tbaSPosition}
                        items={tbaSuggestionActions}
                        ref={menuTbaSuggestion}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handlePageChangeSTba(x)}
                page={sTbaPage}
                count={sTbaPageCount}
              />
            </>
          ) : undefined}
        </Stack>
      </CardWithText>
      {abModal && (
        <AddBenefitModal
          reload={reload}
          onClose={async () => {
            closeAbModal();
            await reload();
          }}
        />
      )}
      {ebModal && (
        <ExportBenefitsModal
          onClose={closeEbModal}
          checkedBenefits={checkedBenefits}
        />
      )}
      {cusModal && <ConfirmUpdateSuggestionModal onClose={closeCusModal} />}
      {csModal && (
        <CreateSuggestion
          onClose={() => {
            closeCsModal();
          }}
          reload={reloadSA}
        />
      )}
      {removeBulkActiveSuggestionsModal ? (
        <PromptModal
          plural
          type="delete"
          target="suggestion"
          onClose={() => closeRemoveBulkActiveSuggestionsModal()}
          handleAction={handleDeleteSelectedActiveSuggestions}
        />
      ) : undefined}
      {removeBulkTBASuggestionsModal ? (
        <PromptModal
          plural
          type="delete"
          target="suggestion"
          onClose={() => closeRemoveBulkTBASuggestionsModal()}
          handleAction={handleDeleteSelectedTBASuggestions}
        />
      ) : undefined}
      {removeBulkBenefitsModal ? (
        <PromptModal
          plural
          type="delete"
          target="benefit"
          onClose={() => closeRemoveBulkBenefitsModal()}
          handleAction={handleDeleteSelectedBenefits}
        />
      ) : undefined}
      {biModal && current && (
        <ChangeBenefit
          data={current}
          reload={reload}
          onClose={async () => {
            closeBiModal();
            await reload();
          }}
        />
      )}
      {bSiModal && currentSuggestion && (
        <SuggestionInfoModal
          reload={reloadResources}
          data={currentSuggestion}
          onClose={closeBSiModal}
        />
      )}
      {approveBulkTBASuggestionsModal ? (
        <PromptModal
          plural
          type="approve"
          target="suggestion"
          onClose={() => closeApproveBulkTBASuggestionsModal()}
          handleAction={handleApproveSuggestion}
        />
      ) : undefined}
    </BenefitsPageMain>
  );
};

export default BenefitsPage;
