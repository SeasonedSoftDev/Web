import React, { useEffect, useState } from 'react';
import {
  SurveysPageMain,
  SurveysInfluencerPageCharts,
} from 'features/surveys/styles';
import { DSurveysInfluencerHead } from 'features/surveys/data';
import {
  CardWithChart,
  CardWithText,
  CheckboxTable,
  NewCheckboxTable,
} from 'components/custom';
import {
  FinishedIcon,
  InpreparationIcon,
  LockIcon,
  OngoingIcon,
  SurveysSmallIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { Pagination } from 'components/ui';
import { Stack } from 'components/system';
import { TTableRenderItemObject } from 'components/custom/table/types';
import { useMenu, useModal, usePagination } from 'hooks';
import { InsightsAPI, SurveyAPI } from 'api';
import { BackupTableRounded } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { formatLongString } from 'utilities/string-converter';
import Link from 'next/link';
import { useAppContext } from 'context';
import { ensureHttpsProtocol } from 'utilities/converters';
import InfluencerProductStatusChips from 'components/custom/InfluencerProductStatusChips';
import { ProductOrderInfluencerStatus } from 'api/platformProduct/enums';
import Chip from 'components/ui/chip';
import { ActionsMenu, CardWrapper, ISpan, TableTooltip } from './styles';
import InfluencerSurveyActions from './elements/available-actions';

const SurveysPage = () => {
  // const [filter, setFilter] = useState<any>(DGenerateSurveyFilter());

  // const [filterOpen, setFilterOpen] = useState(false);

  const [tabs, setTabs] = useState(0);

  const [filterASurveyParams, setFilterASurveyParams] = useState({
    status: 0,
  });

  const [filterOSurveyParams, setFilterOSurveyParams] = useState({
    status: 1,
  });

  const [availableSurveys, setAvailableSurveys] = useState<any[]>([]);
  const [checkedAvailableSurveys, setCheckedAvailableSurveys] = useState<any[]>(
    []
  );

  const [ongoingSurveys, setOngoingSurveys] = useState<any[]>([]);
  const [checkedOngoingSurveys, setCheckedOngoingSurveys] = useState<any[]>([]);

  const [tModal, openTModal, closeTModal] = useModal(false);
  const [oSModal, openOSModal, closeOSModal] = useModal(false);

  const [menuAS, openAS, setOpenAS, buttonASRef, positionAS] = useMenu(false);
  const [menuOS, openOS, setOpenOS, buttonOSRef, positionOS] = useMenu(false);

  const handleMenuAS = () => {
    setOpenAS((prevState: boolean) => !prevState);
  };

  const handleMenuOS = () => {
    setOpenOS((prevState: boolean) => !prevState);
  };

  const toggleASurvey = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedAvailableSurveys([...checkedAvailableSurveys, rowId]);
    } else {
      setCheckedAvailableSurveys(
        checkedAvailableSurveys.filter((id) => id !== rowId)
      );
    }
  };

  const toggleOSurvey = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedOngoingSurveys([...checkedOngoingSurveys, rowId]);
    } else {
      setCheckedOngoingSurveys(
        checkedOngoingSurveys.filter((id) => id !== rowId)
      );
    }
  };

  // This is for future profing, influencer currently does not have bulk actions
  const toggleAllCheckedASurveys = (checked: boolean) => {
    if (checked) {
      const currentPageIds = availableSurveys.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedAvailableSurveys, ...currentPageIds])
      );
      setCheckedAvailableSurveys(newSelectedRows);
    } else {
      const currentPageIds = availableSurveys.map((row: any) => row.id);
      const newSelectedRows = checkedAvailableSurveys.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedAvailableSurveys(newSelectedRows);
    }
  };

  const toggleAllCheckedOSurveys = (checked: boolean) => {
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

  // const toggleFilter = () => {
  //   setFilterOpen(!filterOpen);
  // };

  // const clearFilters = () => {
  //   setFilter(DGenerateSurveyFilter());
  // };

  const {
    pagesCount: pagesASCount,
    page: aSPage,
    setTotalResults: setTotalASResults,
    handlePageChange: handleASPageChange,
    reload: aSReload,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta } = await SurveyAPI.getSurveys({
        limit: params.limit,
        skip: params.skip,
        ...filterASurveyParams,
      });

      setPage(params.page);

      setAvailableSurveys(result);
      setTotalASResults(meta.countFiltered);
    },
  });

  const {
    pagesCount: pagesOSCount,
    page: oSPage,
    setTotalResults: setTotalOSResults,
    handlePageChange: handleOSPageChange,
    reload: oSReload,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta } = await SurveyAPI.getSurveys({
        limit: params.limit,
        skip: params.skip,
        ...filterOSurveyParams,
      });

      setPage(params.page);

      setOngoingSurveys(result);
      setTotalOSResults(meta.countFiltered);
    },
  });

  const bulkASActions = [
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openTModal();
        handleMenuAS();
      },
    },
  ];

  const bulkOSActions = [
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openOSModal();
        handleMenuOS();
      },
    },
  ];

  const [surveysOverTime1, setSurveysOverTime1] = useState<any>([]);
  const [surveysOverTime2, setSurveysOverTime2] = useState<any>([]);
  const [surveysOverTime3, setSurveysOverTime3] = useState<any>([]);

  const { user } = useAppContext();

  const getSurveysOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response =
        await InsightsAPI.getInfluencersInfluencerSurveysOverTimeData(user.id, {
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

  useEffect(() => {
    getSurveysOverTimeData({
      status: 0,
      statusAtPointOfTime: true,
      useStrictPeriod: false,
      numberOfPoints: 30,
      graphType: 'cumulative',
      includeData: ['changePercentageMonth'],
    })
      .then((response) => {
        setSurveysOverTime1(response);
      })
      .catch((error) => console.error(error));
    getSurveysOverTimeData({
      status: 1,
      statusAtPointOfTime: true,
      useStrictPeriod: false,
      numberOfPoints: 30,
      graphType: 'cumulative',
      includeData: ['changePercentageMonth'],
    })
      .then((response) => {
        setSurveysOverTime2(response);
      })
      .catch((error) => console.error(error));
    getSurveysOverTimeData({
      status: 2,
      statusAtPointOfTime: true,
      useStrictPeriod: false,
      numberOfPoints: 30,
      graphType: 'cumulative',
      includeData: ['changePercentageMonth'],
    })
      .then((response) => {
        setSurveysOverTime3(response);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleReloads = async () => {
    oSReload();
    aSReload();
  };

  const renderASItem = ({ headItem, row, cell }: TTableRenderItemObject) => {
    if (headItem.reference === 'name') {
      return row.data.name;
      // return row.data.exampleImages &&
      //   row.data.exampleImages.length &&
      //   row.data.exampleImages[0].imageUrl ? (
      //   <CampaignsCard
      //     image={row.data.exampleImages[0].imageUrl}
      //     company={row.data.name}
      //     app="App placeholder"
      //   />
      // ) : (
      //   row.data.name
      // );
    }
    if (headItem.reference === 'company') {
      return row.data.platformProductOrder.client.company.name;
    }
    if (headItem.reference === 'product') {
      return row.data.products
        .map((product: any) => product.product.name)
        .join(', ');
    }

    if (headItem.reference === 'platform') {
      switch (row.data.socialPlatformId) {
        case 1:
          return 'Instagram';
        default:
          return '';
      }
    }

    if (headItem.reference === 'amount') {
      return `CHF ${row.data.platformProductOrder.platformProductOrderInfluencers[0].agreedAmount}`;
    }

    if (headItem.reference === 'postType') {
      return row.data.postType.name;
    }

    if (headItem.reference === 'status') {
      if (
        row.data.platformProductOrder.platformProductOrderInfluencers[0]
          .status === ProductOrderInfluencerStatus.ToBeAnswered &&
        row.data.platformProductOrder.status === 0
      ) {
        return <Chip type="default" size="small" label="Pending" />;
      }
      return (
        <InfluencerProductStatusChips
          status={
            row.data.platformProductOrder.platformProductOrderInfluencers[0]
              .status
          }
        />
      );
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

    if (headItem.reference === 'link') {
      return row.data.link ? (
        <Link href={ensureHttpsProtocol(row.data.link)}>
          <LockIcon />
        </Link>
      ) : (
        ''
      );
    }
    if (headItem.reference === 'actions') {
      if (row.data.platformProductOrder.status === 0) {
        return (
          <InfluencerSurveyActions data={row.data} reload={handleReloads} />
        );
      }
      return <InfluencerSurveyActions data={row.data} reload={handleReloads} />;
    }

    return '';
  };

  const renderItem = ({ cell }: TTableRenderItemObject) => '';

  return (
    <SurveysPageMain>
      <SurveysInfluencerPageCharts>
        <CardWrapper>
          <CardWithChart
            title="Available"
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
                surveysOverTime1?.data &&
                surveysOverTime1.data.map((element: any) => element.value),
              labels:
                surveysOverTime1?.data &&
                surveysOverTime1?.data.map((element: any) => element.value),
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
                surveysOverTime2?.data &&
                surveysOverTime2.data.map((element: any) => element.value),
              labels:
                surveysOverTime2?.data &&
                surveysOverTime2?.data.map((element: any) => element.value),
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
                surveysOverTime3?.data &&
                surveysOverTime3.data.map((element: any) => element.value),
              labels:
                surveysOverTime3?.data &&
                surveysOverTime3?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
      </SurveysInfluencerPageCharts>
      <CardWithText
        title="Available Surveys"
        style={
          window.innerWidth < 600
            ? { padding: '1.25rem', boxShadow: 'unset' }
            : { padding: '1.25rem', boxShadow: '0px 2px 5px #00000010' }
        }
        actions={
          [
            // <Button
            //   color={filterOpen ? 'secondary' : 'default'}
            //   variant="contained"
            //   onClick={toggleFilter}
            //   startIcon={<SlidersHorizontalIcon width="18" height="18" />}
            // >
            //   Filters
            // </Button>,
          ]
        }
      >
        <Stack>
          {/* <Collapse removeGap in={filterOpen}>
            <SurveysPageFilter>
              <SurveysPageFilterContainer>
                <Input
                  type="select"
                  label="Company"
                  placeholder="Please Select"
                  value={filter.company}
                  onValue={(company) => setFilter({ ...filter, company })}
                />
                <Input
                  type="select"
                  label="Platform"
                  placeholder="Please Select"
                  value={filter.platform}
                  onValue={(platform) => setFilter({ ...filter, platform })}
                />
                <Input
                  type="select"
                  label="Type"
                  placeholder="Please Select"
                  value={filter.type}
                  onValue={(type) => setFilter({ ...filter, type })}
                />
                <Input
                  type="min-max"
                  label="Amount"
                  value={filter.amount}
                  onValue={(amount) => setFilter({ ...filter, amount })}
                />
              </SurveysPageFilterContainer>
              <SurveysPageFilterActions direction="horizontal">
                <Button color="primary" variant="contained">
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
          </Collapse> */}
          <NewCheckboxTable
            head={DSurveysInfluencerHead}
            items={availableSurveys}
            renderItem={renderASItem}
            checkedRows={checkedAvailableSurveys}
            onSingleSelect={toggleASurvey}
            onSelectAll={toggleAllCheckedASurveys}
            tableColModal={tModal}
            closeTableColModal={closeTModal}
            renderElements={
              <>
                <ISpan onClick={handleMenuAS} ref={buttonASRef}>
                  <VerticalDotsIcon />
                </ISpan>
                {openAS && (
                  <ActionsMenu
                    position={positionAS}
                    items={bulkASActions}
                    ref={menuAS}
                  />
                )}
              </>
            }
          />
          <Pagination
            style={{
              paddingTop: 'unset',
              marginTop: 'auto',
              justifyContent: 'right',
            }}
            onChange={(_e, x) => handleASPageChange(x)}
            page={aSPage}
            count={pagesASCount}
          />
        </Stack>
      </CardWithText>
      <CardWithText
        title="Ongoing Surveys"
        style={
          window.innerWidth < 600
            ? { padding: '1.25rem', boxShadow: 'unset' }
            : { padding: '1.25rem', boxShadow: '0px 2px 5px #00000010' }
        }
      >
        <Stack>
          <NewCheckboxTable
            head={DSurveysInfluencerHead}
            items={ongoingSurveys}
            renderItem={renderASItem}
            checkedRows={checkedOngoingSurveys}
            onSingleSelect={toggleOSurvey}
            onSelectAll={toggleAllCheckedOSurveys}
            tableColModal={oSModal}
            closeTableColModal={closeOSModal}
            renderElements={
              <>
                <ISpan onClick={handleMenuOS} ref={buttonOSRef}>
                  <VerticalDotsIcon />
                </ISpan>
                {openOS && (
                  <ActionsMenu
                    position={positionOS}
                    items={bulkOSActions}
                    ref={menuOS}
                  />
                )}
              </>
            }
          />
          <Pagination
            style={{
              paddingTop: 'unset',
              marginTop: 'auto',
              justifyContent: 'right',
            }}
            onChange={(_e, x) => handleOSPageChange(x)}
            page={oSPage}
            count={pagesOSCount}
          />
        </Stack>
      </CardWithText>
    </SurveysPageMain>
  );
};

export default SurveysPage;
