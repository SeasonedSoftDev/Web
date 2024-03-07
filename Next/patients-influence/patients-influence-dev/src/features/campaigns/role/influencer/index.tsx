import React, { useEffect, useState } from 'react';
import {
  CampaignsPageMain,
  CampaignsInfluencerPageCharts,
} from 'features/campaigns/styles';
import {
  DCampaignsInfluencerHead,
  DCampaignsInfluencerHead2,
  DGenerateCampaignsFilter,
} from 'features/campaigns/data';
import {
  CardWithChart,
  CardWithText,
  CheckboxTable,
  NewCheckboxTable,
  Table,
} from 'components/custom';
import {
  CampaignsSmallIcon,
  DeleteIcon,
  EditIcon,
  FinishedIcon,
  InfoIcon,
  InpreparationIcon,
  ManageIcon,
  OngoingIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { faker } from '@faker-js/faker';
import { Pagination } from 'components/ui';
import { Stack } from 'components/system';
import { TTableRenderItemObject } from 'components/custom/table/types';
import { useMenu, useModal, usePagination } from 'hooks';
import { CampaignAPI, InsightsAPI } from 'api';
import Chip from 'components/ui/chip';
import { BackupTableRounded } from '@mui/icons-material';
import { hasEndDatePassed } from 'utilities/calendar';
import { useAppContext } from 'context';
import InfluencerProductStatusChips from 'components/custom/InfluencerProductStatusChips';
import { ProductOrderInfluencerStatus } from 'api/platformProduct/enums';
import { fetchAndCacheData } from 'utilities/local-storage';
import { ISpan, ActionsMenu, CardWrapper } from './styles';
import InfluencerActions from './elements/influencer-actions';
import { IInfluencerCampaingResponse, IProductOrderCampaing } from './types';
// import { fetchAndCacheData } from 'utilities/local-storage';

const CampaignsPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  const [tabs, setTabs] = useState(0);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const [inPrepCampaings, setInPrepCampaigns] = useState<
    IProductOrderCampaing[]
  >([]);

  const [ongoingCampaings, setOngoingCampaigns] = useState<
    IProductOrderCampaing[]
  >([]);

  const [checkedInPrepCampaings, setCheckedInPrepCampaings] = useState<
    number[]
  >([]);
  const [checkedOngoingCampaings, setCheckedOngoingCampaings] = useState<
    number[]
  >([]);
  const [filterACampaignParams, setFilterACampaignParams] = useState({
    status: 0,
  });

  const [filterOCampaignParams, setFilterOCampaignParams] = useState({
    status: 1,
  });

  const [tModal, openTModal, closeTModal] = useModal(false);
  const [oCModal, openOCModal, closeOCModal] = useModal(false);

  const [menuIP, openIP, setOpenIP, buttonIPRef, positionIP] = useMenu(false);
  const [menuOC, openOC, setOpenOC, buttonOCRef, positionOC] = useMenu(false);

  const handleMenuIP = () => {
    setOpenIP((prevState: boolean) => !prevState);
  };
  const handleMenuOC = () => {
    setOpenOC((prevState: boolean) => !prevState);
  };

  // This is for future profing, influencer currently does not have bulk actions
  const toggleIPCampaign = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedInPrepCampaings([...checkedInPrepCampaings, rowId]);
    } else {
      setCheckedInPrepCampaings(
        checkedInPrepCampaings.filter((id) => id !== rowId)
      );
    }
  };

  // This is for future profing, influencer currently does not have bulk actions
  const toggleAllCheckedIPCampaigns = (checked: boolean) => {
    if (checked) {
      const currentPageIds = inPrepCampaings.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedInPrepCampaings, ...currentPageIds])
      );
      setCheckedInPrepCampaings(newSelectedRows);
    } else {
      const currentPageIds = inPrepCampaings.map((row: any) => row.id);
      const newSelectedRows = checkedInPrepCampaings.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedInPrepCampaings(newSelectedRows);
    }
  };

  const toggleOngoingCampaign = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedOngoingCampaings([...checkedOngoingCampaings, rowId]);
    } else {
      setCheckedOngoingCampaings(
        checkedOngoingCampaings.filter((id) => id !== rowId)
      );
    }
  };

  // This is for future profing, influencer currently does not have bulk actions
  const toggleAllCheckedOngoingCampaigns = (checked: boolean) => {
    if (checked) {
      const currentPageIds = ongoingCampaings.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedOngoingCampaings, ...currentPageIds])
      );
      setCheckedOngoingCampaings(newSelectedRows);
    } else {
      const currentPageIds = ongoingCampaings.map((row: any) => row.id);
      const newSelectedRows = checkedOngoingCampaings.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedOngoingCampaings(newSelectedRows);
    }
  };

  const {
    pagesCount: pagesACCount,
    page: aCPage,
    setTotalResults: setTotalACResults,
    handlePageChange: handleACPageChange,
    reload: aCReload,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta }: IInfluencerCampaingResponse =
        await CampaignAPI.getCampaigns({
          limit: params.limit,
          skip: params.skip,
          ...filterACampaignParams,
        });

      setPage(params.page);

      setInPrepCampaigns(result);
      setTotalACResults(meta.countFiltered);
    },
  });

  const {
    pagesCount: pagesOCCount,
    page: oCPage,
    setTotalResults: setTotalOCResults,
    handlePageChange: handleOCPageChange,
    reload: oCReload,
  } = usePagination({
    limit: 10,
    page: 1,
    onChange: async (params, setPage) => {
      const { result, meta }: IInfluencerCampaingResponse =
        await CampaignAPI.getCampaigns({
          limit: params.limit,
          skip: params.skip,
          ...filterOCampaignParams,
        });

      setPage(params.page);

      setOngoingCampaigns(result);
      setTotalOCResults(meta.countFiltered);
    },
  });

  const bulkIPActions = [
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
      icon: <EditIcon />,
      label: 'Edit',
      action: () => {},
    },
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openTModal();
        handleMenuIP();
      },
    },
    // {
    //   icon: <DeleteIcon />,
    //   label: 'Dec',
    //   action: () => {
    //     if (checkedCampaigns.length) {
    //       openRemoveBulkCampaignsModal();
    //     } else {
    //       push('Please select campaigns you want to delete', {
    //         variant: 'warning',
    //       });
    //     }
    //     handleMenuI();
    //   },
    // },
  ];

  const bulkOCActions = [
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
      icon: <EditIcon />,
      label: 'Edit',
      action: () => {},
    },
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openOCModal();
        handleMenuOC();
      },
    },
    // {
    //   icon: <DeleteIcon />,
    //   label: 'Dec',
    //   action: () => {
    //     if (checkedCampaigns.length) {
    //       openRemoveBulkCampaignsModal();
    //     } else {
    //       push('Please select campaigns you want to delete', {
    //         variant: 'warning',
    //       });
    //     }
    //     handleMenuI();
    //   },
    // },
  ];

  const renderACItem = ({ headItem, row, cell }: TTableRenderItemObject) => {
    const availableCampaing = row.data as IProductOrderCampaing;
    if (headItem.reference === 'name') {
      return availableCampaing.name;
      // return availableCampaing.exampleImages &&
      //   availableCampaing.exampleImages.length &&
      //   availableCampaing.exampleImages[0].imageUrl ? (
      //   <CampaignsCard
      //     image={availableCampaing.exampleImages[0].imageUrl}
      //     company={availableCampaing.name}
      //     app="App placeholder"
      //   />
      // ) : (
      //   availableCampaing.name
      // );
    }
    if (headItem.reference === 'company') {
      return availableCampaing.platformProductOrder.client.company.name;
    }
    if (headItem.reference === 'product') {
      return availableCampaing.products
        .map((product: any) => product.product.name)
        .join(', ');
    }

    if (headItem.reference === 'platform') {
      switch (availableCampaing.socialPlatformId) {
        case 1:
          return 'Instagram';
        default:
          return '';
      }
    }

    if (headItem.reference === 'amount') {
      return `CHF ${availableCampaing.platformProductOrder.platformProductOrderInfluencers[0].agreedAmount}`;
    }

    if (headItem.reference === 'postType') {
      return availableCampaing.postType.name;
    }

    if (headItem.reference === 'status') {
      if (
        (availableCampaing.dateEnd &&
          !hasEndDatePassed(availableCampaing.dateEnd)) ||
        !availableCampaing.dateEnd
      ) {
        if (
          availableCampaing.platformProductOrder
            .platformProductOrderInfluencers[0].status ===
            ProductOrderInfluencerStatus.ToBeSubmitted &&
          availableCampaing.platformProductOrder.status === 0
        ) {
          return <Chip type="default" size="small" label="Pending" />;
        }

        return (
          <InfluencerProductStatusChips
            status={
              availableCampaing.platformProductOrder
                .platformProductOrderInfluencers[0].status
            }
          />
        );
      }
      return <Chip type="danger" size="small" label="Ended" />;
    }
    if (headItem.reference === 'actions') {
      if (availableCampaing.platformProductOrder.status === 0) {
        return <InfluencerActions data={availableCampaing} reload={aCReload} />;
      }
      return <InfluencerActions data={availableCampaing} reload={oCReload} />;
    }

    return '';
  };

  const renderItem = ({ cell }: TTableRenderItemObject) => '';

  const [campaignsOverTime1, setCampaignsOverTime1] = useState<any>([]);
  const [campaignsOverTime2, setCampaignsOverTime2] = useState<any>([]);
  const [campaignsOverTime3, setCampaignsOverTime3] = useState<any>([]);

  const { user } = useAppContext();

  const getCampaignsOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response =
        await InsightsAPI.getInfluencersInfluencerCampaignsOverTimeData(
          user.id,
          {
            ...queryParams,
          }
        );

      if (response.data) {
        return response;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      throw new Error('Error: Failed to fetch data!');
    }
  };

  const getInfluencerCampaignGraphDataAsync =
    (
      status: number,
      setDataFunction: (data: any) => void,
      key: string,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getCampaignsOverTimeData({
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
    getInfluencerCampaignGraphDataAsync(
      0,
      setCampaignsOverTime1,
      'setCampaignsOverTime1'
    )();

    getInfluencerCampaignGraphDataAsync(
      1,
      setCampaignsOverTime2,
      'setCampaignsOverTime2'
    )();

    getInfluencerCampaignGraphDataAsync(
      2,
      setCampaignsOverTime3,
      'setCampaignsOverTime3'
    )();
  }, []);

  return (
    <CampaignsPageMain>
      <CampaignsInfluencerPageCharts>
        <CardWrapper>
          <CardWithChart
            title="Available"
            icon={<InpreparationIcon />}
            smallIcon={<CampaignsSmallIcon />}
            percent={
              campaignsOverTime1?.changePercentageMonth || Number(0).toFixed(2)
            }
            count={
              campaignsOverTime1?.data
                ? campaignsOverTime1?.data[campaignsOverTime1.data.length - 1]
                    .value
                : 0
            }
            chartData={{
              values:
                campaignsOverTime1?.data &&
                campaignsOverTime1.data.map((element: any) => element.value),
              labels:
                campaignsOverTime1?.data &&
                campaignsOverTime1?.data.map((element: any) => element.value),
            }}
          />
        </CardWrapper>
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
      </CampaignsInfluencerPageCharts>
      <CardWithText
        title="Available Campaigns"
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
            <CampaignsPageFilter>
              <CampaignsPageFilterContainer>
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
                  label="Post Type"
                  placeholder="Please Select"
                  value={filter.postType}
                  onValue={(postType) => setFilter({ ...filter, postType })}
                />
                <InputGroup
                  label="Date"
                  inputRatio="1fr 1fr"
                  elements={[
                    {
                      type: 'date',
                      placeholder: 'From',
                      value: filter.startDate,
                      onValue: (startDate) =>
                        setFilter({ ...filter, startDate }),
                    },
                    {
                      type: 'date',
                      placeholder: 'To',
                      value: filter.endDate,
                      onValue: (endDate) => setFilter({ ...filter, endDate }),
                    },
                  ]}
                />
              </CampaignsPageFilterContainer>
              <CampaignsPageFilterActions direction="horizontal">
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
              </CampaignsPageFilterActions>
            </CampaignsPageFilter>
          </Collapse> */}
          <NewCheckboxTable
            head={DCampaignsInfluencerHead}
            items={inPrepCampaings}
            renderItem={renderACItem}
            checkedRows={checkedInPrepCampaings}
            onSingleSelect={toggleIPCampaign}
            onSelectAll={toggleAllCheckedIPCampaigns}
            tableColModal={tModal}
            closeTableColModal={closeTModal}
            renderElements={
              <>
                <ISpan onClick={handleMenuIP} ref={buttonIPRef}>
                  <VerticalDotsIcon />
                </ISpan>
                {openIP && (
                  <ActionsMenu
                    position={positionIP}
                    items={bulkIPActions}
                    ref={menuIP}
                  />
                )}
              </>
            }
          />
          <Pagination
            style={{
              paddingTop: 'unset',
              marginTop: 'auto',
              justifyContent: 'rigth',
            }}
            onChange={(_e, x) => handleACPageChange(x)}
            page={aCPage}
            count={pagesACCount}
          />
        </Stack>
      </CardWithText>
      <CardWithText
        title="Ongoing Campaigns"
        style={
          window.innerWidth < 600
            ? { padding: '1.25rem', boxShadow: 'unset' }
            : { padding: '1.25rem', boxShadow: '0px 2px 5px #00000010' }
        }
      >
        <Stack>
          <NewCheckboxTable
            head={DCampaignsInfluencerHead}
            items={ongoingCampaings}
            renderItem={renderACItem}
            checkedRows={checkedOngoingCampaings}
            onSingleSelect={toggleOngoingCampaign}
            onSelectAll={toggleAllCheckedOngoingCampaigns}
            tableColModal={oCModal}
            closeTableColModal={closeOCModal}
            renderElements={
              <>
                <ISpan onClick={handleMenuOC} ref={buttonOCRef}>
                  <VerticalDotsIcon />
                </ISpan>
                {openOC && (
                  <ActionsMenu
                    position={positionOC}
                    items={bulkOCActions}
                    ref={menuOC}
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
            onChange={(_e, x) => handleOCPageChange(x)}
            page={oCPage}
            count={pagesOCCount}
          />
        </Stack>
      </CardWithText>
    </CampaignsPageMain>
  );
};

export default CampaignsPage;
