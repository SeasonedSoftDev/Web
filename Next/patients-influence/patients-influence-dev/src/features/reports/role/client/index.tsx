import React, { useEffect, useState } from 'react';
import {
  ReportsPageMain,
  ReportsPageCharts,
  ReportsPageFilter,
  ReportsPageFilterActions,
  ReportsPageFilterContainer,
} from 'features/reports/styles';
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
  ManageIcon,
  OngoingIcon,
  OrderedIcon,
  ReportIcon,
  ReportsSmallIcon,
  ScheduleIcon,
  SlidersHorizontalIcon,
  WithoutReportIcon,
} from 'components/svg';
import { Button, Input, InputGroup, Pagination } from 'components/ui';
import { Stack } from 'components/system';
import { Collapse } from '@mui/material';
import {
  DGenerateReportsClientsFilter,
  DReportsClientHead,
} from 'features/reports/data';
import { TTableRenderItemObject } from 'components/custom/table/types';
import {
  ExportReportsModal,
  CreateReportsModal,
  WithoutReportActions,
  OrderedActions,
} from 'features/reports/role/client/elements';
import { useMenu, useModal, usePagination } from 'hooks';
import { useRouter } from 'next/router';
import { CampaignAPI, ClientAPI, EnumsApi, ProductApi } from 'api';
import { useAppContext } from 'context';
import ReccomendedIcon from 'components/svg/recommended';
import ReachIcon from 'components/svg/reach';
import CommnetsIcon from 'components/svg/comments';
import WebsiteClicksIcon from 'components/svg/website-clicks';
import { fetchAndCacheData } from 'utilities/local-storage';
import { CardWrapper } from './styles';

const ReportsPage = () => {
  const [filter, setFilter] = useState<any>(DGenerateReportsClientsFilter());

  const [filterOpen, setFilterOpen] = useState(false);

  const [tabsValue, setTabsValue] = useState(0);

  const [erModal, openErModal, closeErModal] = useModal(false);
  const [crModal, openCrModal, closeCrModal] = useModal(false);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(DGenerateReportsClientsFilter());
  };

  const [menuWr, openWr, setOpenWr] = useMenu(false);
  const [menuO, openO, setOpenO] = useMenu(false);
  const [menuOn, openOn, setOpenOn] = useMenu(false);
  const [menuD, openD, setOpenD] = useMenu(false);

  const handleMenuWr = () => {
    setOpenWr(!openWr);
  };
  const handleMenuO = () => {
    setOpenO(!openO);
  };
  const handleMenuOn = () => {
    setOpenOn(!openOn);
  };
  const handleMenuD = () => {
    setOpenD(!openD);
  };

  const [campaigns, setCampaigns] = useState<any>([]);
  const [filterParams, setFilterParams] = useState({});

  const {
    pagesCount: pagesCountWr,
    page: pageWr,
    setTotalResults: setTotalResultsWr,
    handlePageChange: handlePageChangeWr,
    reload: reloadWr,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta } = await CampaignAPI.getCampaigns({
        limit: params.limit,
        skip: params.skip,
        withNoReportOnly: true,
        ...filterParams,
      });
      setCampaigns(result);
      setTotalResultsWr(meta.countFiltered);
    },
  });

  const renderItemWithoutReport = ({
    headItem,
    row,
  }: TTableRenderItemObject) => {
    if (headItem.reference === 'campaign') {
      return row.data.name;
    }
    if (headItem.reference === 'type') {
      return 'No';
    }
    if (headItem.reference === 'budget') {
      return row.data.platformProductOrder.budget
        ? `CHF ${row.data.platformProductOrder.budget}`
        : '';
    }
    if (headItem.reference === 'additionalInformation') {
      return row.data.description;
    }
    if (headItem.reference === 'actions') {
      return (
        <WithoutReportActions
          data={{ value: row.data.id, label: row.data.name }}
          refresh={reloadWr}
        />
      );
    }

    return '';
  };

  const router = useRouter();

  const [reports, setReports] = useState<any>([]);

  const { pagesCount, page, setTotalResults, handlePageChange, reload } =
    usePagination({
      limit: 10,
      page: 1,
      onChange: async (params, setPage) => {
        const { result, meta } = await CampaignAPI.getReports({
          limit: params.limit,
          skip: params.skip,
          ...filterParams,
        });
        setReports(result);
        setTotalResults(meta.countFiltered);
      },
    });

  const renderItem = ({ headItem, row }: TTableRenderItemObject) => {
    if (headItem.reference === 'campaign') {
      return row.data.campaign.name;
    }
    if (headItem.reference === 'type') {
      return row.data.reportType === 1 ? 'Yes' : 'No';
    }
    if (headItem.reference === 'budget') {
      if (row.data.platformProductOrder.budget) {
        return `CHF ${row.data.platformProductOrder.budget}`;
      }
    }
    if (headItem.reference === 'costPerClick') {
      return row.data.costPerClick;
    }
    if (headItem.reference === 'costPerTarget') {
      return row.data.costPerTarget;
    }
    if (headItem.reference === 'additionalInformation') {
      return row.data.description;
    }

    if (headItem.reference === 'actions') {
      return <OrderedActions data={row.data} reload={reload} />;
    }

    return '';
  };

  const [reportsOverTime1, setReportsOverTime1] = useState<any>([]);
  const [reportsOverTime2, setReportsOverTime2] = useState<any>([]);
  const [reportsOverTime3, setReportsOverTime3] = useState<any>([]);
  const [reportsOverTime4, setReportsOverTime4] = useState<any>([]);
  const [reportsOverTime5, setReportsOverTime5] = useState<any>([]);
  const [reportsOverTime6, setReportsOverTime6] = useState<any>([]);
  const [reportsOverTime7, setReportsOverTime7] = useState<any>([]);
  const [reportsOverTime8, setReportsOverTime8] = useState<any>([]);

  /* Filters */
  const [loading, setLoading] = useState(false);
  const [filtersProducts, setFilterProducts] = useState<any>([]);
  const [filterReports, setFilterReport] = useState<any>([]);

  const getProducts = async (s: string = '') => {
    const { result } = await ProductApi.getProducts(s);

    setFilterProducts(
      result.map((data: any) => ({
        value: data.id,
        label: data.name,
      }))
    );
  };

  const getReportTypes = async () => {
    const result = await EnumsApi.getReportTypes();

    setFilterReport(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const { user } = useAppContext();

  const { id } = user;

  const getClientsOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response = await ClientAPI.getGraphsReport(id, { ...queryParams });

      if (response.data) {
        return response;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      throw new Error('Error: Failed to fetch data!');
    }
  };

  const getClientCampaignsPerformanceOverTimeData = async (
    queryParams: any
  ): Promise<any> => {
    try {
      const response =
        await ClientAPI.getClientCampaignsPerformanceOverTimeData(id, {
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

  const getClientCampaignsPerformanceOverTimeDataAsync =
    (
      performanceType: number,
      status: number,
      setDataFunction: (data: any) => void,
      key: string,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getClientCampaignsPerformanceOverTimeData({
            performanceType,
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

  useEffect(() => {
    getClientGraphDataAsync(
      3,
      undefined,
      setReportsOverTime1,
      'setReportsOverTime1'
    )();
    getClientGraphDataAsync(3, 4, setReportsOverTime2, 'setReportsOverTime2')();
    getClientGraphDataAsync(3, 5, setReportsOverTime3, 'setReportsOverTime3')();
    getClientGraphDataAsync(3, 6, setReportsOverTime4, 'setReportsOverTime4')();
    getClientCampaignsPerformanceOverTimeDataAsync(
      2,
      6,
      setReportsOverTime5,
      'setReportsOverTime5'
    )();
    getClientCampaignsPerformanceOverTimeDataAsync(
      1,
      6,
      setReportsOverTime6,
      'setReportsOverTime6'
    )();
    getClientCampaignsPerformanceOverTimeDataAsync(
      0,
      6,
      setReportsOverTime7,
      'setReportsOverTime7'
    )();
    getClientCampaignsPerformanceOverTimeDataAsync(
      3,
      6,
      setReportsOverTime8,
      'setReportsOverTime8'
    )();
  }, [user.id]);

  useEffect(() => {
    getProducts();
    getReportTypes();
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

  return (
    <ReportsPageMain>
      <ReportsPageCharts>
        <CardWrapper>
          <CardWithChart
            title="Without Report"
            icon={<WithoutReportIcon />}
            smallIcon={<ReportsSmallIcon />}
            percent={
              reportsOverTime1?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              reportsOverTime1?.data
                ? reportsOverTime1?.data[reportsOverTime1.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                reportsOverTime1?.data &&
                reportsOverTime1?.data.map((element: any) => element.value),
              labels:
                reportsOverTime1?.data &&
                reportsOverTime1?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Ordered"
            icon={<OrderedIcon />}
            smallIcon={<ReportsSmallIcon />}
            percent={
              reportsOverTime2?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              reportsOverTime2?.data
                ? reportsOverTime2?.data[reportsOverTime2.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                reportsOverTime2.data &&
                reportsOverTime2.data.map((element: any) => element.value),
              labels:
                reportsOverTime2.data &&
                reportsOverTime2.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Ongoing"
            icon={<OngoingIcon />}
            smallIcon={<ReportsSmallIcon />}
            percent={
              reportsOverTime3?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              reportsOverTime3?.data
                ? reportsOverTime3?.data[reportsOverTime3.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                reportsOverTime3.data &&
                reportsOverTime3.data.map((element: any) => element.value),
              labels:
                reportsOverTime3.data &&
                reportsOverTime3.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Delivered"
            icon={<FinishedIcon />}
            smallIcon={<ReportsSmallIcon />}
            percent={
              reportsOverTime4?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              reportsOverTime4?.data
                ? reportsOverTime4?.data[reportsOverTime4.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                reportsOverTime4.data &&
                reportsOverTime4.data.map((element: any) => element.value),
              labels:
                reportsOverTime4.data &&
                reportsOverTime4.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Reach"
            icon={<ReachIcon />}
            smallIcon={<ReportsSmallIcon />}
            percent={
              reportsOverTime5?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              reportsOverTime5?.data
                ? reportsOverTime5?.data[reportsOverTime5.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                reportsOverTime5.data &&
                reportsOverTime5.data.map((element: any) => element.value),
              labels:
                reportsOverTime5.data &&
                reportsOverTime5.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Likes"
            icon={<ReccomendedIcon />}
            smallIcon={<ReportsSmallIcon />}
            percent={
              reportsOverTime6?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              reportsOverTime6?.data
                ? reportsOverTime6?.data[reportsOverTime6.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                reportsOverTime6.data &&
                reportsOverTime6.data.map((element: any) => element.value),
              labels:
                reportsOverTime6.data &&
                reportsOverTime6.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Comments"
            icon={<CommnetsIcon />}
            smallIcon={<ReportsSmallIcon />}
            percent={
              reportsOverTime7?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              reportsOverTime7?.data
                ? reportsOverTime7?.data[reportsOverTime7.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                reportsOverTime7.data &&
                reportsOverTime7.data.map((element: any) => element.value),
              labels:
                reportsOverTime7.data &&
                reportsOverTime7.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Website Clicks"
            icon={<WebsiteClicksIcon />}
            smallIcon={<ReportsSmallIcon />}
            percent={
              reportsOverTime8?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              reportsOverTime8?.data
                ? reportsOverTime8?.data[reportsOverTime8.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                reportsOverTime8.data &&
                reportsOverTime8.data.map((element: any) => element.value),
              labels:
                reportsOverTime8.data &&
                reportsOverTime8.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
      </ReportsPageCharts>
      <CardWithText
        title="Reports"
        // description="2 New Reports This Month"
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
          // <Button color="default" variant="contained" onClick={openErModal}>
          //   Export
          // </Button>,
          <Button color="primary" variant="contained" onClick={openCrModal}>
            Create Report
          </Button>,
        ]}
      >
        <Stack>
          <Collapse in={filterOpen}>
            <ReportsPageFilter>
              <ReportsPageFilterContainer>
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
                  options={filtersProducts}
                  onSearch={debounce(getProducts, 250)}
                  onNewTag={handleNewProductTag}
                  loading={loading}
                />
                <Input
                  type="multiselect"
                  label="Types"
                  placeholder="Please Select"
                  value={filter.type}
                  onValue={(type) => setFilter({ ...filter, type })}
                  options={filterReports}
                />
                <Input
                  type="min-max"
                  label="Budget"
                  value={filter.budget}
                  onValue={(budget) => setFilter({ ...filter, budget })}
                />
                <InputGroup
                  label="Date"
                  inputRatio="1fr 1fr"
                  elements={[
                    {
                      value: filter.dateStart,
                      onValue: (dateStart) =>
                        setFilter({ ...filter, dateStart }),
                      type: 'date',
                      placeholder: 'From',
                    },
                    {
                      value: filter.dateEnd,
                      onValue: (dateEnd) => setFilter({ ...filter, dateEnd }),
                      type: 'date',
                      placeholder: 'To',
                    },
                  ]}
                />
                <Input
                  type="min-max"
                  label="Numbers of Ifluencers"
                  value={filter.influencers}
                  onValue={(influencers) =>
                    setFilter({ ...filter, influencers })
                  }
                />
                <Input
                  type="min-max"
                  label="Reach"
                  value={filter.reach}
                  onValue={(reach) => setFilter({ ...filter, reach })}
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
                <Input
                  type="min-max"
                  label="Website Clicks"
                  value={filter.websiteClicks}
                  onValue={(websiteClicks) =>
                    setFilter({ ...filter, websiteClicks })
                  }
                />
                <Input
                  type="min-max"
                  label="Engagement"
                  value={filter.engagement}
                  onValue={(engagement) => setFilter({ ...filter, engagement })}
                />
                <Input
                  type="min-max"
                  label="Cost Per Click"
                  value={filter.costPerClick}
                  onValue={(costPerClick) =>
                    setFilter({ ...filter, costPerClick })
                  }
                />
                <Input
                  type="min-max"
                  label="Cost Per Target"
                  value={filter.costPerTarget}
                  onValue={(costPerTarget) =>
                    setFilter({ ...filter, costPerTarget })
                  }
                />
              </ReportsPageFilterContainer>
              <ReportsPageFilterActions direction="horizontal">
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
              </ReportsPageFilterActions>
            </ReportsPageFilter>
          </Collapse>
          <Tabs
            tabs={['Without Report', 'Ordered', 'Ongoing', 'Delivered']}
            value={tabsValue}
            onValue={setTabsValue}
          />

          {tabsValue === 0 && (
            <>
              <CheckboxTable
                head={DReportsClientHead}
                items={campaigns}
                renderItem={renderItemWithoutReport}
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handlePageChangeWr(x)}
                page={pageWr}
                count={pagesCountWr}
              />
            </>
          )}
          {tabsValue === 1 && (
            <>
              <CheckboxTable
                head={DReportsClientHead}
                items={reports}
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
          {tabsValue === 2 && (
            <>
              <CheckboxTable
                head={DReportsClientHead}
                items={[]}
                renderItem={() => {}}
              />
              <Pagination style={{ justifyContent: 'right' }} count={0} />
            </>
          )}
          {tabsValue === 3 && (
            <>
              <CheckboxTable
                head={DReportsClientHead}
                items={[]}
                renderItem={() => {}}
              />
              <Pagination style={{ justifyContent: 'right' }} count={0} />
            </>
          )}
          {/* <Stack direction="horizontal">
            <Button variant="contained" color="primary" onClick={handleMenuWr}>
              Without Report Action
            </Button>
            <Button variant="contained" color="primary" onClick={handleMenuO}>
              Ordered Action
            </Button>
            <Button variant="contained" color="primary" onClick={handleMenuOn}>
              Ongoing Action
            </Button>
            <Button variant="contained" color="primary" onClick={handleMenuD}>
              Delivered Action
            </Button>
          </Stack> */}
        </Stack>
        {openWr && (
          <Menu
            items={[
              {
                icon: <ReportIcon />,
                label: 'Report',
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
            ref={menuWr}
          />
        )}
        {openO && (
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
            ref={menuO}
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
        {openD && (
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
                action: () => router.push('/reports/manage'),
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
            ref={menuD}
          />
        )}
      </CardWithText>
      {erModal && <ExportReportsModal onClose={closeErModal} />}
      {crModal && (
        <CreateReportsModal
          refresh={reload}
          onClose={async () => {
            reload();
            closeCrModal();
          }}
        />
      )}
    </ReportsPageMain>
  );
};

export default ReportsPage;
