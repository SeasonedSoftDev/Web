import React, { useEffect, useState } from 'react';
import {
  ReportsPageMain,
  ReportsPageCharts,
  ReportsPageFilter,
  ReportsPageFilterActions,
} from 'features/reports/styles';
import {
  CardWithChart,
  CardWithText,
  Menu,
  Tabs,
  NewCheckboxTable,
} from 'components/custom';
import {
  ContactIcon,
  CreateIcon,
  DeleteIcon,
  DeliverIcon,
  EditIcon,
  FinishedIcon,
  InfoIcon,
  ManageIcon,
  OrderedIcon,
  ReadyIcon,
  ReportsSmallIcon,
  RevenueIcon,
  ScheduleIcon,
  SlidersHorizontalIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { Button, Input, InputGroup, Pagination } from 'components/ui';
import { Grid, Stack } from 'components/system';
import { Collapse, Tooltip } from '@mui/material';
import {
  DGenerateReportsFilter,
  DReportsClientHead,
} from 'features/reports/data';
import { TTableRenderItemObject } from 'components/custom/table/types';
import {
  ExportReportsModal,
  CreateReportsModal,
} from 'features/reports/role/admin/elements';
import { useMenu, useModal, usePagination, useSnackbar } from 'hooks';
import { useRouter } from 'next/router';
import { CampaignAPI } from 'api';
import { BackupTableRounded } from '@mui/icons-material';
import { formatLongString } from 'utilities/string-converter';
import { ICampaignReport } from 'api/campaign/types';
import { fetchAndCacheData } from 'utilities/local-storage';
import OrderedActions from './elements/ordered-actions';
import {
  ISpan,
  ActionsMenu as CustomActionsMenu,
  TableTooltip,
  CardWrapper,
} from './styles';
import PromptModal from './elements/prompt-modal';

const ReportsPage = () => {
  const [filter, setFilter] = useState<any>(DGenerateReportsFilter());

  const [filterOpen, setFilterOpen] = useState(false);

  const [tabsValue, setTabsValue] = useState(0);

  const [tabs, setTabs] = useState(0);

  const [reportsO, setReportsO] = useState<ICampaignReport[]>([]);
  const [reportsR, setReportsR] = useState<ICampaignReport[]>([]);
  const [reportsD, setReportsD] = useState<ICampaignReport[]>([]);

  const [checkedReportsO, setCheckedReportsO] = useState<number[]>([]);
  const [checkedReportsR, setCheckedReportsR] = useState<number[]>([]);
  const [checkedReportsD, setCheckedReportsD] = useState<number[]>([]);

  const [erModal, openErModal, closeErModal] = useModal(false);
  const [crModal, openCrModal, closeCrModal] = useModal(false);

  const [menuTBS, openTBS, setOpenTBS] = useMenu(false);
  const [menuAF, openAF, setOpenAF] = useMenu(false);

  const { push } = useSnackbar();
  const router = useRouter();

  const [menuO, openO, setOpenO, buttonRefO, positionO] = useMenu(false);
  const [menuR, openR, setOpenR, buttonRefR, positionR] = useMenu(false);
  const [menuD, openD, setOpenD, buttonRefD, positionD] = useMenu(false);

  const handleMenuO = () => {
    setOpenO(!openO);
  };
  const handleMenuR = () => {
    setOpenR(!openR);
  };

  const handleMenuD = () => {
    setOpenD(!openD);
  };

  const [
    removeBulkOCampaignReportsModal,
    openRemoveBulkOCampaignReportsModal,
    closeRemoveBulkOCampaignReportsModal,
  ] = useModal(false);
  const [
    removeBulkRCampaignReportsModal,
    openRemoveBulkRCampaignReportsModal,
    closeRemoveBulkRCampaignReportsModal,
  ] = useModal(false);
  const [
    removeBulkDCampaignReportsModal,
    openRemoveBulkDCampaignReportsModal,
    closeRemoveBulkDCampaignReportsModal,
  ] = useModal(false);

  const [tModalO, openTModalO, closeTModalO] = useModal(false);
  const [tModalR, openTModalR, closeTModalR] = useModal(false);
  const [tModalD, openTModalD, closeTModalD] = useModal(false);

  const [filterParams, setFilterParams] = useState({});

  const toggleReportO = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedReportsO([...checkedReportsO, rowId]);
    } else {
      setCheckedReportsO(checkedReportsO.filter((id) => id !== rowId));
    }
  };

  const toggleReportR = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedReportsR([...checkedReportsR, rowId]);
    } else {
      setCheckedReportsR(checkedReportsR.filter((id) => id !== rowId));
    }
  };

  const toggleReportD = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedReportsD([...checkedReportsD, rowId]);
    } else {
      setCheckedReportsD(checkedReportsD.filter((id) => id !== rowId));
    }
  };

  const toggleAllCheckedReportsO = (checked: boolean) => {
    if (checked) {
      const currentPageIds = reportsO.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedReportsO, ...currentPageIds])
      );
      setCheckedReportsO(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = reportsO.map((row: any) => row.id);
      const newSelectedRows = checkedReportsO.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedReportsO(newSelectedRows);
    }
  };

  const toggleAllCheckedReportsR = (checked: boolean) => {
    if (checked) {
      const currentPageIds = reportsR.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedReportsR, ...currentPageIds])
      );
      setCheckedReportsR(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = reportsR.map((row: any) => row.id);
      const newSelectedRows = checkedReportsR.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedReportsR(newSelectedRows);
    }
  };

  const toggleAllCheckedReportsD = (checked: boolean) => {
    if (checked) {
      const currentPageIds = reportsD.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedReportsD, ...currentPageIds])
      );
      setCheckedReportsD(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = reportsD.map((row: any) => row.id);
      const newSelectedRows = checkedReportsD.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedReportsD(newSelectedRows);
    }
  };

  const { pagesCount, page, setTotalResults, handlePageChange, reload } =
    usePagination({
      limit: 10,
      page: 1,
      onChange: async (params, setPage) => {
        const { result, meta } = await CampaignAPI.getReports({
          limit: params.limit,
          skip: params.skip,
          reportType: 1,
          status: 4,
          ...filterParams,
        });

        setPage(params.page);

        setReportsO(result);
        setTotalResults(meta.countFiltered);
      },
    });

  const {
    pagesCount: pagesCountR,
    page: pageR,
    setTotalResults: setTotalResultsR,
    handlePageChange: handlePageChangeR,
    reload: reloadR,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta } = await CampaignAPI.getReports({
        limit: params.limit,
        skip: params.skip,
        reportType: 1,
        status: 5,
        ...filterParams,
      });

      setPage(params.page);

      setReportsR(result);
      setTotalResultsR(meta.countFiltered);
    },
  });

  const {
    pagesCount: pagesCountD,
    page: pageD,
    setTotalResults: setTotalResultsD,
    handlePageChange: handlePageChangeD,
    reload: reloadD,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta } = await CampaignAPI.getReports({
        limit: params.limit,
        skip: params.skip,
        reportType: 1,
        status: 6,
        ...filterParams,
      });

      setPage(params.page);

      setReportsD(result);
      setTotalResultsD(meta.countFiltered);
    },
  });

  const handleBulkOCampaignReportsRemoval = async () => {
    try {
      await CampaignAPI.deleteManyCampaignReports({
        reportIds: checkedReportsO,
      });
      reload();
      setCheckedReportsO([]);

      push('Campaigns reports successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleBulkRCampaignReportsRemoval = async () => {
    try {
      await CampaignAPI.deleteManyCampaignReports({
        reportIds: checkedReportsR,
      });
      reloadR();
      setCheckedReportsR([]);

      push('Campaigns reports successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleBulkDCampaignReportsRemoval = async () => {
    try {
      await CampaignAPI.deleteManyCampaignReports({
        reportIds: checkedReportsD,
      });
      reloadD();
      setCheckedReportsD([]);

      push('Campaigns reports successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const [reportsOverTime1, setReportsOverTimeData1] = useState<any>([]);
  const [reportsOverTime2, setReportsOverTimeData2] = useState<any>([]);
  const [reportsOverTime3, setReportsOverTimeData3] = useState<any>([]);
  const [reportsOverTime4, setReportsOverTimeData4] = useState<any>([]);

  const getReportsOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response = await CampaignAPI.getReportsOverTimeData({
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

  const getReportsRevenueOverTimeData = async (
    queryParams: any
  ): Promise<any> => {
    try {
      const response = await CampaignAPI.getReportsRevenueOverTimeData({
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

  const getReportsGraphDataAsync =
    (status: number, setDataFunction: (data: any) => void, key: string) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getReportsOverTimeData({
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

  const getReportsRevenueGraphDataAsync =
    (setDataFunction: (data: any) => void, key: string) => async () => {
      const result = await fetchAndCacheData(
        () =>
          getReportsRevenueOverTimeData({
            useStrictPeriod: false,
            numberOfPoints: 30,
            graphType: 'cumulative',
            includeData: ['changePercentageMonth'],
          }),
        key
      );

      setDataFunction(result);
    };

  useEffect(() => {
    getReportsGraphDataAsync(
      4,
      setReportsOverTimeData1,
      'setReportsOverTimeData1'
    )();
    getReportsGraphDataAsync(
      5,
      setReportsOverTimeData2,
      'setReportsOverTimeData2'
    )();
    getReportsGraphDataAsync(
      6,
      setReportsOverTimeData3,
      'setReportsOverTimeData3'
    )();
    getReportsRevenueGraphDataAsync(
      setReportsOverTimeData4,
      'setReportsOverTimeData4'
    )();
  }, []);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(DGenerateReportsFilter());
  };

  const bulkOActions = [
    // Saving for future reference
    // {
    //   icon: <InfoIcon />,
    //   label: 'Info',
    //   action: () => {},
    // },
    {
      icon: <ManageIcon />,
      label: 'Manage',
      action: () => router.push('/services/reports/manage'),
    },
    {
      icon: <CreateIcon />,
      label: 'Create',
      action: () => {},
    },
    {
      icon: <ContactIcon />,
      label: 'Contact',
      action: () => {},
    },
    {
      icon: <EditIcon />,
      label: 'Create',
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
        openTModalO();
        handleMenuO();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        if (checkedReportsO.length) {
          openRemoveBulkOCampaignReportsModal();
        } else {
          push('Please select reports you want to delete', {
            variant: 'warning',
          });
        }
        handleMenuO();
      },
    },
  ];

  const bulkRActions = [
    // Saving for future reference
    // {
    //   icon: <InfoIcon />,
    //   label: 'Info',
    //   action: () => {},
    // },
    {
      icon: <ManageIcon />,
      label: 'Manage',
      action: () => router.push('/services/reports/manage'),
    },
    {
      icon: <CreateIcon />,
      label: 'Create',
      action: () => {},
    },
    {
      icon: <ContactIcon />,
      label: 'Contact',
      action: () => {},
    },
    {
      icon: <EditIcon />,
      label: 'Create',
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
        openTModalR();
        handleMenuR();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        if (checkedReportsR.length) {
          openRemoveBulkRCampaignReportsModal();
        } else {
          push('Please select reports you want to delete', {
            variant: 'warning',
          });
        }
        handleMenuR();
      },
    },
  ];

  const bulkDActions = [
    // Saving for future reference
    // {
    //   icon: <InfoIcon />,
    //   label: 'Info',
    //   action: () => {},
    // },
    {
      icon: <ManageIcon />,
      label: 'Manage',
      action: () => router.push('/services/reports/manage'),
    },
    {
      icon: <CreateIcon />,
      label: 'Create',
      action: () => {},
    },
    {
      icon: <ContactIcon />,
      label: 'Contact',
      action: () => {},
    },
    {
      icon: <EditIcon />,
      label: 'Create',
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
        openTModalD();
        handleMenuD();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        if (checkedReportsD.length) {
          openRemoveBulkDCampaignReportsModal();
        } else {
          push('Please select reports you want to delete', {
            variant: 'warning',
          });
        }
        handleMenuD();
      },
    },
  ];

  const renderItem = ({ headItem, row }: TTableRenderItemObject) => {
    const report = row.data as ICampaignReport;
    if (headItem.reference === 'campaign') {
      return report.campaign.name;
    }
    if (headItem.reference === 'type') {
      return report.reportType === 1 ? 'Yes' : 'No';
    }
    if (headItem.reference === 'budget') {
      if (report.platformProductOrder.budget) {
        return `CHF ${report.platformProductOrder.budget}`;
      }
    }
    if (headItem.reference === 'costPerClick') {
      return report.costPerClick;
    }
    if (headItem.reference === 'costPerTarget') {
      return report.costPerTarget;
    }
    if (headItem.reference === 'additionalInformation') {
      return report.description;
    }
    if (headItem.reference === 'date') {
      return report.createdAt.slice(0, 10);
    }
    if (headItem.reference === 'product') {
      if (report.campaign.products && report.campaign.products.length) {
        const productNamesString = report.campaign.products
          .map((product) => product.product.name)
          .join(', ');

        const formattedElipsisString = formatLongString(productNamesString, 50);
        return (
          <Tooltip
            style={{ cursor: 'pointer' }}
            title={<TableTooltip>{productNamesString}</TableTooltip>}
          >
            <span>{formattedElipsisString}</span>
          </Tooltip>
        );
      }
    }

    if (headItem.reference === 'actions') {
      return <OrderedActions data={report} reload={reload} />;
    }

    return '';
  };

  return (
    <ReportsPageMain>
      <ReportsPageCharts>
        <CardWrapper>
          <CardWithChart
            title="Ordered"
            icon={<OrderedIcon />}
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
            title="Ready"
            icon={<ReadyIcon />}
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
            title="Delivered"
            icon={<FinishedIcon />}
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
            title="Revenue"
            icon={<RevenueIcon />}
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
      </ReportsPageCharts>
      <CardWithText
        title="Reports"
        actions={[
          <Button
            color={filterOpen ? 'secondary' : 'default'}
            variant="contained"
            onClick={toggleFilter}
            startIcon={<SlidersHorizontalIcon width="18" height="18" />}
          >
            Filters
          </Button>,
          <Button color="default" variant="contained" onClick={openErModal}>
            Export
          </Button>,
          <Button color="primary" variant="contained" onClick={openCrModal}>
            Create Report
          </Button>,
        ]}
      >
        <Stack>
          <Collapse in={filterOpen}>
            <ReportsPageFilter>
              <Tabs
                tabs={['Report', 'Client']}
                value={tabs}
                onValue={setTabs}
              />
              {tabs === 0 && (
                <Grid columns={4}>
                  <Input
                    type="text"
                    label="Search"
                    placeholder="Select Enter"
                    value={filter.search}
                    onValue={(search) => setFilter({ ...filter, search })}
                  />
                  <Input
                    type="select"
                    label="Type"
                    placeholder="Select Select"
                    value={filter.type}
                    onValue={(type) => setFilter({ ...filter, type })}
                    options={[
                      {
                        value: 0,
                        label: 'Basic',
                      },
                      {
                        value: 1,
                        label: 'Premium',
                      },
                      {
                        value: 2,
                        label: 'Custom',
                      },
                    ]}
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
                    label="Influencers"
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
                    label="Website clicks"
                    value={filter.websiteClicks}
                    onValue={(websiteClicks) =>
                      setFilter({ ...filter, websiteClicks })
                    }
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
                    label="Cost per Click"
                    value={filter.costPerClick}
                    onValue={(costPerClick) =>
                      setFilter({ ...filter, costPerClick })
                    }
                  />
                  <Input
                    type="min-max"
                    label="Cost per Target"
                    value={filter.costPerTarget}
                    onValue={(costPerTarget) =>
                      setFilter({ ...filter, costPerTarget })
                    }
                  />
                  <Input
                    type="select"
                    label="Labels"
                    placeholder="Please Select"
                    value={filter.labels}
                    onValue={(labels) => setFilter({ ...filter, labels })}
                  />
                </Grid>
              )}
              {tabs === 1 && (
                <Grid columns={4}>
                  <Input
                    type="select"
                    label="Industry"
                    placeholder="Please Select"
                    value={filter.industry}
                    onValue={(industry) => setFilter({ ...filter, industry })}
                  />
                  <Input
                    type="select"
                    label="Company"
                    placeholder="Please Select"
                    value={filter.company}
                    onValue={(company) => setFilter({ ...filter, company })}
                  />
                  <Input
                    type="select"
                    label="Client"
                    placeholder="Please Select"
                    value={filter.client}
                    onValue={(client) => setFilter({ ...filter, client })}
                  />
                  <Input
                    type="select"
                    label="Ambassador"
                    placeholder="Please Select"
                    value={filter.ambassador}
                    onValue={(ambassador) =>
                      setFilter({ ...filter, ambassador })
                    }
                  />
                  <Input
                    type="select"
                    label="Product"
                    placeholder="Please Select"
                    value={filter.product}
                    onValue={(product) => setFilter({ ...filter, product })}
                  />
                </Grid>
              )}

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
            tabs={['Ordered', 'Ready', 'Delivered']}
            value={tabsValue}
            onValue={setTabsValue}
          />
          {tabsValue === 0 && (
            <>
              <NewCheckboxTable
                head={DReportsClientHead}
                items={reportsO}
                renderItem={renderItem}
                checkedRows={checkedReportsO}
                onSingleSelect={toggleReportO}
                onSelectAll={toggleAllCheckedReportsO}
                tableColModal={tModalO}
                closeTableColModal={closeTModalO}
                renderElements={
                  <>
                    <ISpan onClick={handleMenuO} ref={buttonRefO}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openO && (
                      <CustomActionsMenu
                        position={positionO}
                        items={bulkOActions}
                        ref={menuO}
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
          {tabsValue === 1 && (
            <>
              <NewCheckboxTable
                head={DReportsClientHead}
                items={reportsR}
                renderItem={renderItem}
                checkedRows={checkedReportsR}
                onSingleSelect={toggleReportR}
                onSelectAll={toggleAllCheckedReportsR}
                tableColModal={tModalR}
                closeTableColModal={closeTModalR}
                renderElements={
                  <>
                    <ISpan onClick={handleMenuR} ref={buttonRefR}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openR && (
                      <CustomActionsMenu
                        position={positionR}
                        items={bulkRActions}
                        ref={menuR}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handlePageChangeR(x)}
                page={pageR}
                count={pagesCountR}
              />
            </>
          )}
          {tabsValue === 2 && (
            <>
              <NewCheckboxTable
                head={DReportsClientHead}
                items={reportsD}
                renderItem={renderItem}
                checkedRows={checkedReportsD}
                onSingleSelect={toggleReportD}
                onSelectAll={toggleAllCheckedReportsD}
                tableColModal={tModalD}
                closeTableColModal={closeTModalD}
                renderElements={
                  <>
                    <ISpan onClick={handleMenuD} ref={buttonRefD}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openD && (
                      <CustomActionsMenu
                        position={positionD}
                        items={bulkDActions}
                        ref={menuD}
                      />
                    )}
                  </>
                }
              />
              <Pagination
                style={{ justifyContent: 'right' }}
                onChange={(_e, x) => handlePageChangeD(x)}
                page={pageD}
                count={pagesCountD}
              />
            </>
          )}
          {/* Saving for future reference */}
          {/* <Stack direction="horizontal">
            <Button color="primary" variant="contained" onClick={handleMenuTBC}>
              Ordered
            </Button>
            <Button color="primary" variant="contained" onClick={handleMenuTBS}>
              Ready
            </Button>
            <Button color="primary" variant="contained" onClick={handleMenuAF}>
              Delivered
            </Button>
          </Stack> */}
          {/* {openTBC && (
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
                  action: () => router.push('/services/reports/manage'),
                },
                {
                  icon: <CreateIcon />,
                  label: 'Create',
                  action: () => {},
                },
                {
                  icon: <ContactIcon />,
                  label: 'Contact',
                  action: () => {},
                },
                {
                  icon: <EditIcon />,
                  label: 'Create',
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
              ref={menuTBC}
            />
          )} */}
          {openTBS && (
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
                  action: () => router.push('/services/reports/manage'),
                },
                {
                  icon: <DeliverIcon />,
                  label: 'Deliver',
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
              ref={menuTBS}
            />
          )}
          {openAF && (
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
                  action: () => router.push('/services/reports/manage'),
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
              ref={menuAF}
            />
          )}
        </Stack>
      </CardWithText>
      {removeBulkOCampaignReportsModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkOCampaignReportsModal()}
          handleAction={handleBulkOCampaignReportsRemoval}
        />
      )}
      {removeBulkRCampaignReportsModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkRCampaignReportsModal()}
          handleAction={handleBulkRCampaignReportsRemoval}
        />
      )}
      {removeBulkDCampaignReportsModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkDCampaignReportsModal()}
          handleAction={handleBulkDCampaignReportsRemoval}
        />
      )}
      {erModal && (
        <ExportReportsModal
          onClose={closeErModal}
          checkedReportsD={checkedReportsD}
          checkedReportsO={checkedReportsO}
          checkedReportsR={checkedReportsR}
        />
      )}
      {crModal && (
        <CreateReportsModal onClose={closeCrModal} refresh={reload} />
      )}
    </ReportsPageMain>
  );
};

export default ReportsPage;
