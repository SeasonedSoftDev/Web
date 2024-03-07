/* eslint-disable default-case */
/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import {
  BenefitsPageFilterContainer,
  BenefitsPageMain,
  BenefitsPageCharts,
  BenefitsPageFilter,
  BenefitsPageFilterActions,
  TableTooltip,
  ThumbsIcon,
  ThumbsWrapper,
  ISpan,
} from 'features/benefits/role/influencer/styles';
import {
  DBenefitsIHead,
  DSuggestionsIHead2,
  DGenerateFinanceFilter,
} from 'features/benefits/role/influencer/data';
import {
  CardWithChartBenefits,
  CardWithText,
  CheckboxTable,
} from 'components/custom';
import {
  ApparelIcon,
  BeautyIcon,
  ElectronicsIcon,
  FurnitureIcon,
  HealthIcon,
  LeisureIcon,
  LockIcon,
  NutritionIcon,
  PetCareIcon,
  ServicesBIcon,
  SlidersHorizontalIcon,
  TravelIcon,
  FoodIcon,
} from 'components/svg';
import { faker } from '@faker-js/faker';
import { Button, Input, Pagination } from 'components/ui';
import { Stack, Collapse } from 'components/system';
import { TTableRenderItemObject } from 'components/custom/table/types';
import { useDebounce, useModal, usePagination } from 'hooks';
import {
  AddSuggestionModal,
  ExportBenefitsModal,
} from 'features/benefits/role/influencer/elements';
import AccesoriesIcon from 'components/svg/accessories';
import Link from 'next/link';
import { BenefitsAPI, LocationAPI } from 'api';
import { IBenefitSuggestion, IPaginatedBenefit } from 'api/benefits/types';
import { ensureHttpsProtocol } from 'utilities/converters';
import { formatLongString } from 'utilities/string-converter';
import { Tooltip } from '@mui/material';
import { useAppContext } from 'context';
import { fetchAndCacheData } from 'utilities/local-storage';

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
  const [asModal, openAsModal, closeAsModal] = useModal(false);

  const [filter, setFilter] = useState<IFilterBenefitsParams>(
    DGenerateFinanceFilter()
  );

  const [filterOpen, setFilterOpen] = useState(false);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const [filterCleared, setFilterCleared] = useState(false);

  const clearFilters = () => {
    setFilter(() => DGenerateFinanceFilter());
    setFilterCleared(true);
  };

  const [benefits, setBenefits] = useState<IPaginatedBenefit[]>([]);

  // const [benefitsGraphData, setBenefitsGraphData] = useState<any>([]);
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

  const [filterParams, setFilterParams] = useState({});

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
    getLocations();
    getCategories();
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

  const { pagesCount, page, setTotalResults, handlePageChange, reload } =
    usePagination({
      limit: 10,
      page: 1,
      onChange: async (params, setPage) => {
        const { result, meta } = await BenefitsAPI.getBenefits({
          limit: params.limit,
          skip: params.skip,
          ...filter,
        });

        setPage(params.page);
        setBenefits(result);
        setTotalResults(meta.countFiltered);
      },
    });

  const [suggestions, setSuggestions] = useState<IBenefitSuggestion[]>([]);

  const [filterParamsS, setFilterParamsS] = useState({});

  const {
    pagesCount: sPageCount,
    page: sPage,
    setTotalResults: setTotalsResultsS,
    handlePageChange: handlePageChangeS,
    reload: reloadS,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta } = await BenefitsAPI.getSuggestions({
        limit: params.limit,
        skip: params.skip,
        search: '',
        ...filterParamsS,
      });
      setPage(params.page);
      setSuggestions(result);
      setTotalsResultsS(meta.countFiltered);
    },
  });

  const handleVote = async (suggestionId: number, isUpvoted: boolean) => {
    if (!isUpvoted) {
      await BenefitsAPI.upvoteSuggestion(suggestionId).then(() => {
        reloadS();
      });
    }

    if (isUpvoted) {
      await BenefitsAPI.downvoteSuggestion(suggestionId).then(() => {
        reloadS();
      });
    }
  };

  const renderItem = ({
    headItem,
    cell,
    row,
    table,
  }: TTableRenderItemObject) => {
    const benefitRow = row.data as IPaginatedBenefit;
    if (headItem.reference === 'company') {
      return benefitRow.benefitPartnership?.name;
    }
    if (headItem.reference === 'category') {
      return benefitRow.benefitCategory?.name;
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

    return '';
  };

  const renderItemSuggestions = ({ headItem, row }: TTableRenderItemObject) => {
    const benefitSuggestion = row.data as IBenefitSuggestion;
    if (headItem.reference === 'company') {
      return benefitSuggestion.partnershipName;
    }
    if (headItem.reference === 'desiredOutcome') {
      return benefitSuggestion.outcomeDescription;
    }

    if (headItem.reference === 'status') {
      return benefitSuggestion.isApproved ? 'Approved' : 'Not Approved';
    }

    if (headItem.reference === 'vote' && benefitSuggestion.isApproved) {
      const existingUpvote = benefitSuggestion.benefitUpvoteCounts.find(
        (benefitUpvote) =>
          benefitUpvote.benefitSuggestionId === benefitSuggestion.id &&
          benefitUpvote.userId === user.id
      );
      return (
        <ThumbsWrapper>
          <ISpan
            onClick={() =>
              handleVote(
                benefitSuggestion.id,
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
            benefitSuggestion.benefitUpvoteCounts.filter(
              (benefitCount) => benefitCount.isUpvoted
            ).length
          }
        </ThumbsWrapper>
      );
    }

    if (headItem.reference === 'link') {
      return (
        <Link
          href={ensureHttpsProtocol(benefitSuggestion.partnershipLink)}
          target="_blank"
        >
          <LockIcon />
        </Link>
      );
    }

    return '';
  };

  useEffect(() => {
    if (filterCleared) {
      reload();
      setFilterCleared(false);
    }
  }, [filter, filterCleared]);

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
            color={filterOpen ? 'secondary' : 'default'}
            variant="contained"
            onClick={toggleFilter}
            startIcon={<SlidersHorizontalIcon width="18" height="18" />}
          >
            Filters
          </Button>,
        ]}
      >
        <Stack>
          <Collapse removeGap in={filterOpen}>
            <BenefitsPageFilter>
              <BenefitsPageFilterContainer>
                <Input
                  type="text"
                  label="Search"
                  placeholder="Search For Benefit"
                  value={filter.search}
                  onValue={(search) => {
                    setFilter((prevState: any) => ({ ...prevState, search }));
                  }}
                />
                <Input
                  type="select"
                  label="Category"
                  placeholder="Please Select"
                  value={filter.category}
                  onSearch={debouncedCategories}
                  onValue={(category) => setFilter({ ...filter, category })}
                  options={categories}
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
              </BenefitsPageFilterContainer>
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
          <CheckboxTable
            head={DBenefitsIHead}
            items={benefits}
            renderItem={renderItem}
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
          <Button color="primary" variant="contained" onClick={openAsModal}>
            Suggest
          </Button>,
        ]}
      >
        <Stack>
          <CheckboxTable
            head={DSuggestionsIHead2}
            items={suggestions}
            renderItem={renderItemSuggestions}
          />
          <Pagination
            style={{ justifyContent: 'right' }}
            onChange={(_e, x) => handlePageChangeS(x)}
            page={sPage}
            count={sPageCount}
          />
        </Stack>
      </CardWithText>
      {asModal && (
        <AddSuggestionModal
          reload={reloadS}
          onClose={() => {
            reloadS();
            closeAsModal();
          }}
        />
      )}
      {/* {ebModal && <ExportBenefitsModal onClose={closeEbModal} />} */}
    </BenefitsPageMain>
  );
};

export default BenefitsPage;
