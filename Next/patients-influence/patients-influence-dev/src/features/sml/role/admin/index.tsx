import React, { useEffect, useState } from 'react';
import {
  SmlPageMain,
  SmlPageCharts,
  SmlPageFilter,
  SmlPageFilterActions,
} from 'features/sml/styles';
import {
  CardWithChart,
  CardWithText,
  Tabs,
  NewCheckboxTable,
} from 'components/custom';
import {
  ContactIcon,
  DeleteIcon,
  EditIcon,
  FinishedIcon,
  ManageIcon,
  OrderedIcon,
  ReadyIcon,
  RevenueIcon,
  ScheduleIcon,
  SlidersHorizontalIcon,
  SMLSmallIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { Button, Input, InputGroup, Pagination } from 'components/ui';
import { Grid, Stack } from 'components/system';
import { Collapse } from '@mui/material';
import { DGenerateAdminSmlFilter } from 'features/sml/data';
import { TTableRenderItemObject } from 'components/custom/table/types';
import {
  ExportSmlModal,
  CreateSmlModal,
  OrderSmlModal,
  CreateSmlTabsModal,
} from 'features/sml/role/admin/elements';
import { useMenu, useModal, usePagination, useSnackbar } from 'hooks';
import { useRouter } from 'next/router';
import { SMLApi } from 'api';
import { BackupTableRounded } from '@mui/icons-material';
import { fetchAndCacheData } from 'utilities/local-storage';
import OrderedActions from './elements/ordered-sml-actions';
import { OSMLHeadAdmin } from './data';
import { ISpan, ActionsMenu as CustomActionsMenu, CardWrapper } from './styles';
import PromptModal from './elements/prompt-modal';

const SmlPage = () => {
  const { push } = useSnackbar();

  const [filter, setFilter] = useState<any>(DGenerateAdminSmlFilter());

  const [filterOpen, setFilterOpen] = useState(false);

  const [tabsValue, setTabsValue] = useState(0);

  const [esModal, openEsModal, closeEsModal] = useModal(false);
  const [csModal, openCsModal, closeCsModal] = useModal(false);
  const [osModal, openOsModal, closeOsModal] = useModal(false);
  const [cstModal, openCstModal, closeCstModal] = useModal(false);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(DGenerateAdminSmlFilter());
  };

  const [menuTBSO, openTBSO, setOpenTBSO, buttonTBSORef, positionTBSO] =
    useMenu(false);
  const [menuTBSR, openTBSR, setOpenTBSR, buttonTBSRRef, positionTBSR] =
    useMenu(false);
  const [menuTBSD, openTBSD, setOpenTBSD, buttonTBSDRef, positionTBSD] =
    useMenu(false);

  const handleMenuTBS = () => {
    setOpenTBSO(!openTBSO);
  };
  const handleMenuTBSR = () => {
    setOpenTBSR(!openTBSR);
  };
  const handleMenuTBSD = () => {
    setOpenTBSD(!openTBSD);
  };

  const [tabs, setTabs] = useState(0);

  const [smlO, setSmlO] = useState<any>([]);
  const [formattedSMLO, setFormattedSMLO] = useState<any>([]);
  const [checkedSMLO, setCheckedSMLO] = useState<any>([]);
  const [smlR, setSmlR] = useState<any>([]);
  const [formattedSMLR, setFormattedSMLR] = useState<any>([]);
  const [checkedSMLR, setCheckedSMLR] = useState<any>([]);
  const [smlD, setSmlD] = useState<any>([]);
  const [formattedSMLD, setFormattedSMLD] = useState<any>([]);
  const [checkedSMLD, setCheckedSMLD] = useState<any>([]);
  const [filterParams, setFilterParams] = useState({});

  const [
    removeBulkOSMLsModal,
    openRemoveBulkOSMLsModal,
    closeRemoveBulkOSMLsModal,
  ] = useModal(false);

  const [
    removeBulkRSMLsModal,
    openRemoveBulkRSMLsModal,
    closeRemoveBulkRSMLsModal,
  ] = useModal(false);

  const [
    removeBulkDSMLsModal,
    openRemoveBulkDSMLsModal,
    closeRemoveBulkDSMLsModal,
  ] = useModal(false);

  const [getSmlData1, setSmlData1] = useState<any>([]);
  const [getSmlData2, setSmlData2] = useState<any>([]);
  const [getSmlData3, setSmlData3] = useState<any>([]);
  const [getSmlData4, setSmlData4] = useState<any>([]);

  const { pagesCount, page, setTotalResults, handlePageChange, reload } =
    usePagination({
      limit: 10,
      page: 1,
      onChange: async (params, setPage) => {
        const { result, meta } = await SMLApi.getSMLs({
          limit: params.limit,
          skip: params.skip,
          status: 4,
          ...filterParams,
        });

        setPage(params.page);

        setSmlO(result);
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
      const { result, meta } = await SMLApi.getSMLs({
        limit: params.limit,
        skip: params.skip,
        status: 5,
        ...filterParams,
      });

      setPage(params.page);

      setSmlR(result);
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
      const { result, meta } = await SMLApi.getSMLs({
        limit: params.limit,
        skip: params.skip,
        status: 6,
        ...filterParams,
      });

      setPage(params.page);

      setSmlD(result);
      setTotalResultsD(meta.countFiltered);
    },
  });

  const [tModalO, openTModalO, closeTModalO] = useModal(false);
  const [tModalR, openTModalR, closeTModalR] = useModal(false);
  const [tModalD, openTModalD, closeTModalD] = useModal(false);

  useEffect(() => {
    if (smlO && smlO.length > 0) {
      const result = [];
      for (let i = 0; i < smlO.length; i += 1) {
        for (
          let j = 0;
          j <
          smlO[i].platformProductOrder.platformProductOrderDiseaseAreas.length;
          j += 1
        ) {
          const obj = {
            id: smlO[i].id,
            diseaseArea:
              smlO[i].platformProductOrder.platformProductOrderDiseaseAreas[j]
                .diseaseArea,
            subscriptionLength: smlO[i].subscriptionLength,
            monthlyTokens: smlO[i].monthlyTokens,
            budget: smlO[i].platformProductOrder.budget,
            SMLPlatforms: { value: 0, label: 'Instagram' },
            smlDescription: smlO[i].smlDescription,
            client: smlO[i].platformProductOrder.client,
            originalData: smlO[i],
          };
          result.push(obj);
        }
      }
      if (result && result.length > 0) {
        setFormattedSMLO(result);
      }
    }
  }, [smlO]);

  useEffect(() => {
    if (smlR && smlR.length > 0) {
      const result = [];
      for (let i = 0; i < smlR.length; i += 1) {
        for (
          let j = 0;
          j <
          smlR[i].platformProductOrder.platformProductOrderDiseaseAreas.length;
          j += 1
        ) {
          const obj = {
            id: smlR[i].id,
            diseaseArea:
              smlR[i].platformProductOrder.platformProductOrderDiseaseAreas[j]
                .diseaseArea,
            subscriptionLength: smlR[i].subscriptionLength,
            monthlyTokens: smlR[i].monthlyTokens,
            budget: smlR[i].platformProductOrder.budget,
            SMLPlatforms: { value: 0, label: 'Instagram' },
            smlDescription: smlR[i].smlDescription,
            client: smlR[i].platformProductOrder.client,
            originalData: smlR[i],
          };
          result.push(obj);
        }
      }
      if (result && result.length > 0) {
        setFormattedSMLR(result);
      }
    }
  }, [smlR]);

  useEffect(() => {
    if (smlD && smlD.length > 0) {
      const result = [];
      for (let i = 0; i < smlD.length; i += 1) {
        for (
          let j = 0;
          j <
          smlD[i].platformProductOrder.platformProductOrderDiseaseAreas.length;
          j += 1
        ) {
          const obj = {
            id: smlD[i].id,
            diseaseArea:
              smlD[i].platformProductOrder.platformProductOrderDiseaseAreas[j]
                .diseaseArea,
            subscriptionLength: smlD[i].subscriptionLength,
            monthlyTokens: smlD[i].monthlyTokens,
            budget: smlD[i].platformProductOrder.budget,
            SMLPlatforms: { value: 0, label: 'Instagram' },
            smlDescription: smlD[i].smlDescription,
            client: smlD[i].platformProductOrder.client,
            originalData: smlD[i],
          };
          result.push(obj);
        }
      }
      if (result && result.length > 0) {
        setFormattedSMLD(result);
      }
    }
  }, [smlD]);

  const toggleSMLO = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedSMLO([...checkedSMLO, rowId]);
    } else {
      setCheckedSMLO(checkedSMLO.filter((id: any) => id !== rowId));
    }
  };

  const toggleSMLR = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedSMLR([...checkedSMLR, rowId]);
    } else {
      setCheckedSMLR(checkedSMLR.filter((id: any) => id !== rowId));
    }
  };

  const toggleSMLD = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedSMLD([...checkedSMLD, rowId]);
    } else {
      setCheckedSMLD(checkedSMLD.filter((id: any) => id !== rowId));
    }
  };

  const toggleAllCheckedSMLO = (checked: boolean) => {
    if (checked) {
      const currentPageIds = formattedSMLO.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedSMLO, ...currentPageIds])
      );
      setCheckedSMLO(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = formattedSMLO.map((row: any) => row.id);
      const newSelectedRows = checkedSMLO.filter(
        (rowId: any) => !currentPageIds.includes(rowId)
      );
      setCheckedSMLO(newSelectedRows);
    }
  };

  const toggleAllCheckedSMLR = (checked: boolean) => {
    if (checked) {
      const currentPageIds = formattedSMLR.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedSMLR, ...currentPageIds])
      );
      setCheckedSMLR(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = formattedSMLR.map((row: any) => row.id);
      const newSelectedRows = checkedSMLR.filter(
        (rowId: any) => !currentPageIds.includes(rowId)
      );
      setCheckedSMLR(newSelectedRows);
    }
  };

  const toggleAllCheckedSMLD = (checked: boolean) => {
    if (checked) {
      const currentPageIds = formattedSMLD.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedSMLD, ...currentPageIds])
      );
      setCheckedSMLD(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = formattedSMLD.map((row: any) => row.id);
      const newSelectedRows = checkedSMLD.filter(
        (rowId: any) => !currentPageIds.includes(rowId)
      );
      setCheckedSMLD(newSelectedRows);
    }
  };

  const handleBulkOSMLsRemoval = async () => {
    try {
      await SMLApi.deleteManySMLs({
        smlIds: checkedSMLO,
      });
      reload();
      setCheckedSMLO([]);

      push('SMLs successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleBulkRSMLsRemoval = async () => {
    try {
      await SMLApi.deleteManySMLs({
        smlIds: checkedSMLR,
      });
      reloadR();
      setCheckedSMLR([]);

      push('SMLs successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleBulkFSMLsRemoval = async () => {
    try {
      await SMLApi.deleteManySMLs({
        smlIds: checkedSMLR,
      });
      reloadR();
      setCheckedSMLR([]);

      push('SMLs successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const renderItem = ({ headItem, row }: TTableRenderItemObject) => {
    if (headItem.reference === 'client') {
      if (row.data.client) {
        const { client } = row.data;
        if (client.user) {
          return `${client.user.firstName} ${client.user.lastName}`;
        }
      }
    }

    if (headItem.reference === 'budget') {
      return `CHF ${row.data.budget}`;
    }

    if (headItem.reference === 'diseaseArea') {
      if (row.data.diseaseArea) {
        return row.data.diseaseArea.name;
      }
    }

    if (headItem.reference === 'subscription') {
      return `${row.data.subscriptionLength} Months`;
    }

    if (headItem.reference === 'tokens') {
      return `${row.data.monthlyTokens} Tokens`;
    }

    // if (headItem.reference === 'endDate') {
    //   const originalDate = new Date(row.data.createdAt);
    //   const newDate = new Date(row.data.createdAt);
    //   const subLength = parseInt(row.data.subscriptionLength, 10);

    //   newDate.setUTCMonth(newDate.getUTCMonth() + subLength);

    //   return newDate.toISOString().slice(0, 10);
    // }

    if (headItem.reference === 'actions') {
      return (
        <OrderedActions
          data={row.data.originalData}
          reload={reload}
          style={{ width: '100%' }}
        />
      );
    }

    return '';
  };

  const bulkTBSActions = [
    {
      icon: <ReadyIcon />,
      label: 'Ready',
      action: () => {},
    },
    // {
    //   icon: <InfoIcon />,
    //   label: 'Info',
    //   action: () => {},
    // },
    {
      icon: <ManageIcon />,
      label: 'Manage',
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
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openTModalO();
        handleMenuTBS();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        if (checkedSMLO.length) {
          openRemoveBulkOSMLsModal();
        } else {
          push('Please select campaigns you want to delete', {
            variant: 'warning',
          });
        }
        handleMenuTBS();
      },
    },
  ];

  const bulkRActions = [
    {
      icon: <ReadyIcon />,
      label: 'Ready',
      action: () => {},
    },
    // {
    //   icon: <InfoIcon />,
    //   label: 'Info',
    //   action: () => {},
    // },
    {
      icon: <ManageIcon />,
      label: 'Manage',
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
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openTModalR();
        handleMenuTBS();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        if (checkedSMLR.length) {
          openRemoveBulkRSMLsModal();
        } else {
          push('Please select campaigns you want to delete', {
            variant: 'warning',
          });
        }
        handleMenuTBS();
      },
    },
  ];

  const bulkDActions = [
    {
      icon: <ReadyIcon />,
      label: 'Ready',
      action: () => {},
    },
    // {
    //   icon: <InfoIcon />,
    //   label: 'Info',
    //   action: () => {},
    // },
    {
      icon: <ManageIcon />,
      label: 'Manage',
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
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openTModalD();
        handleMenuTBSD();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        if (checkedSMLD.length) {
          openRemoveBulkDSMLsModal();
        } else {
          push('Please select campaigns you want to delete', {
            variant: 'warning',
          });
        }
        handleMenuTBSD();
      },
    },
  ];

  const getAllSmlGraphData = async (queryParams: any): Promise<any> => {
    try {
      const response = await SMLApi.getAllSmlGraphData({
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

  const getAllSmlRevenueGraphData = async (queryParams: any): Promise<any> => {
    try {
      const response = await SMLApi.getAllSmlRevenueGraphData({
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

  const getSMLGraphDataAsync =
    (status: number, setDataFunction: (data: any) => void, key: string) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getAllSmlGraphData({
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

  const getSMLRevenueGraphDataAsync =
    (setDataFunction: (data: any) => void, key: string) => async () => {
      const result = await fetchAndCacheData(
        () =>
          getAllSmlRevenueGraphData({
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
    getSMLGraphDataAsync(4, setSmlData1, 'setSmlData1')();
    getSMLGraphDataAsync(5, setSmlData2, 'setSmlData2')();
    getSMLGraphDataAsync(6, setSmlData3, 'setSmlData3')();
    getSMLRevenueGraphDataAsync(setSmlData4, 'setSmlData4')();
  }, []);

  return (
    <SmlPageMain>
      <SmlPageCharts>
        <CardWrapper>
          <CardWithChart
            title="Ordered"
            icon={<OrderedIcon />}
            smallIcon={<SMLSmallIcon />}
            percent={getSmlData1?.changePercentageMonth || Number(0).toFixed(2)}
            count={
              getSmlData1?.data
                ? getSmlData1?.data[getSmlData1.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                getSmlData1.data &&
                getSmlData1.data.map((element: any) => element.value),
              labels:
                getSmlData1.data &&
                getSmlData1.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Ready"
            icon={<ReadyIcon />}
            smallIcon={<SMLSmallIcon />}
            percent={getSmlData2?.changePercentageMonth || Number(0).toFixed(2)}
            count={
              getSmlData2?.data
                ? getSmlData2?.data[getSmlData2.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                getSmlData2.data &&
                getSmlData2.data.map((element: any) => element.value),
              labels:
                getSmlData2.data &&
                getSmlData2.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Delivered"
            icon={<FinishedIcon />}
            smallIcon={<SMLSmallIcon />}
            percent={getSmlData3?.changePercentageMonth || Number(0).toFixed(2)}
            count={
              getSmlData3?.data
                ? getSmlData3?.data[getSmlData3.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                getSmlData3.data &&
                getSmlData3.data.map((element: any) => element.value),
              labels:
                getSmlData3.data &&
                getSmlData3.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Revenue"
            icon={<RevenueIcon />}
            smallIcon={<SMLSmallIcon />}
            percent={getSmlData4?.changePercentageMonth || Number(0).toFixed(2)}
            count={
              getSmlData4?.data
                ? getSmlData4?.data[getSmlData4.data.length - 1].value
                : 0
            }
            chartData={{
              values:
                getSmlData4.data &&
                getSmlData4.data.map((element: any) => element.value),
              labels:
                getSmlData4.data &&
                getSmlData4.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
      </SmlPageCharts>
      <CardWithText
        title="Social Media Listening"
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
            Create SML
          </Button>,
        ]}
      >
        <Stack>
          <Collapse in={filterOpen}>
            <SmlPageFilter>
              <Tabs tabs={['SML', 'Client']} value={tabs} onValue={setTabs} />
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
                    type="select"
                    label="Disease Area"
                    placeholder="Please Select"
                    value={filter.diseaseArea}
                    onValue={(diseaseArea) =>
                      setFilter({ ...filter, diseaseArea })
                    }
                  />
                  <Input
                    type="select"
                    label="Social Media Platform"
                    placeholder="Please Select"
                    value={filter.socialMediaPlatform}
                    onValue={(socialMediaPlatform) =>
                      setFilter({ ...filter, socialMediaPlatform })
                    }
                  />
                  <Input
                    type="min-max"
                    label="Budget"
                    value={filter.budget}
                    onValue={(budget) => setFilter({ ...filter, budget })}
                  />
                  <InputGroup
                    label="Date Joined"
                    inputRatio="1fr 1fr"
                    elements={[
                      {
                        value: filter.startDateStart,
                        onValue: (startDateStart) =>
                          setFilter({ ...filter, startDateStart }),
                        type: 'date',
                        placeholder: 'From',
                      },
                      {
                        value: filter.startDateEnd,
                        onValue: (startDateEnd) =>
                          setFilter({ ...filter, startDateEnd }),
                        type: 'date',
                        placeholder: 'To',
                      },
                    ]}
                  />
                  <InputGroup
                    label="Date Joined"
                    inputRatio="1fr 1fr"
                    elements={[
                      {
                        value: filter.endDateStart,
                        onValue: (endDateStart) =>
                          setFilter({ ...filter, endDateStart }),
                        type: 'date',
                        placeholder: 'From',
                      },
                      {
                        value: filter.endDateEnd,
                        onValue: (endDateEnd) =>
                          setFilter({ ...filter, endDateEnd }),
                        type: 'date',
                        placeholder: 'To',
                      },
                    ]}
                  />
                  <Input
                    type="min-max"
                    label="Subscription"
                    value={filter.subscription}
                    onValue={(subscription) =>
                      setFilter({ ...filter, subscription })
                    }
                  />
                  <Input
                    type="min-max"
                    label="Tokens"
                    value={filter.tokens}
                    onValue={(tokens) => setFilter({ ...filter, tokens })}
                  />
                  <Input
                    type="select"
                    label="Labels"
                    placeholder="Please Select"
                    value={filter.labels}
                    onValue={(labels) => setFilter({ ...filter, labels })}
                  />
                  <Input
                    type="select"
                    label="Schedule"
                    placeholder="Please Select"
                    value={filter.schedule}
                    onValue={(schedule) => setFilter({ ...filter, schedule })}
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
              <SmlPageFilterActions direction="horizontal">
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
              </SmlPageFilterActions>
            </SmlPageFilter>
          </Collapse>
          <Tabs
            tabs={['Ordered', 'Ready', 'Delivered']}
            value={tabsValue}
            onValue={setTabsValue}
          />
          {tabsValue === 0 ? (
            <>
              <NewCheckboxTable
                head={OSMLHeadAdmin}
                items={formattedSMLO}
                renderItem={renderItem}
                checkedRows={checkedSMLO}
                onSingleSelect={toggleSMLO}
                onSelectAll={toggleAllCheckedSMLO}
                tableColModal={tModalO}
                closeTableColModal={closeTModalO}
                renderElements={
                  <>
                    <ISpan onClick={handleMenuTBS} ref={buttonTBSORef}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openTBSO && (
                      <CustomActionsMenu
                        position={positionTBSO}
                        items={bulkTBSActions}
                        ref={menuTBSO}
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
                head={OSMLHeadAdmin}
                items={formattedSMLR}
                renderItem={renderItem}
                checkedRows={checkedSMLR}
                onSingleSelect={toggleSMLR}
                onSelectAll={toggleAllCheckedSMLR}
                tableColModal={tModalR}
                closeTableColModal={closeTModalR}
                renderElements={
                  <>
                    <ISpan onClick={handleMenuTBSR} ref={buttonTBSRRef}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openTBSR && (
                      <CustomActionsMenu
                        position={positionTBSR}
                        items={bulkRActions}
                        ref={menuTBSR}
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
          ) : undefined}

          {tabsValue === 2 ? (
            <>
              <NewCheckboxTable
                head={OSMLHeadAdmin}
                items={formattedSMLD}
                renderItem={renderItem}
                checkedRows={checkedSMLD}
                onSingleSelect={toggleSMLD}
                onSelectAll={toggleAllCheckedSMLD}
                tableColModal={tModalD}
                closeTableColModal={closeTModalD}
                renderElements={
                  <>
                    <ISpan onClick={handleMenuTBSD} ref={buttonTBSDRef}>
                      <VerticalDotsIcon />
                    </ISpan>
                    {openTBSD && (
                      <CustomActionsMenu
                        position={positionTBSD}
                        items={bulkDActions}
                        ref={menuTBSD}
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
          ) : undefined}

          {/* <Stack direction="horizontal">
            <Button variant="contained" onClick={handleMenuTBS}>
              Ordered actions
            </Button> 
            <Button variant="contained" onClick={handleMenuTBC}>
              Ready actions
            </Button>
            <Button variant="contained" onClick={handleMenuSML}>
              Delivered actions
            </Button>
          </Stack> */}
        </Stack>
        {/* {openTBS && (
          <Menu
            items={[
              {
                icon: <ReadyIcon />,
                label: 'Ready',
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
        )} */}
        {/* {openTBC && (
          <Menu
            items={[
              {
                icon: <DeliverIcon />,
                label: 'Deliver',
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
            ref={menuTBC}
          />
        )}
        {openSML && (
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
                action: () => {
                  handleRoute('/services/sml/reports');
                },
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
            ref={menuSML}
          />
        )}
        <Stack direction="horizontal" style={{ marginTop: '50px' }}>
          <Button variant="contained" onClick={openOsModal}>
            Os modal
          </Button>
          <Button variant="contained" onClick={openCstModal}>
            Cst modal
          </Button>
        </Stack> */}
      </CardWithText>
      {esModal && (
        <ExportSmlModal
          onClose={closeEsModal}
          checkedSMLD={checkedSMLD}
          checkedSMLO={checkedSMLO}
          checkedSMLR={checkedSMLR}
        />
      )}
      {csModal && (
        <CreateSmlModal
          onClose={closeCsModal}
          refresh={() => {
            reload();
            reloadD();
            reloadR();
          }}
        />
      )}
      {removeBulkOSMLsModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkOSMLsModal()}
          handleAction={handleBulkOSMLsRemoval}
        />
      )}
      {removeBulkRSMLsModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkRSMLsModal()}
          handleAction={handleBulkRSMLsRemoval}
        />
      )}
      {removeBulkDSMLsModal && (
        <PromptModal
          plural
          onClose={() => closeRemoveBulkDSMLsModal()}
          handleAction={handleBulkFSMLsRemoval}
        />
      )}
      {osModal && <OrderSmlModal onClose={closeOsModal} />}
      {cstModal && <CreateSmlTabsModal onClose={closeCstModal} />}
    </SmlPageMain>
  );
};

export default SmlPage;
