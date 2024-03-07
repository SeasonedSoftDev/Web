import React, { useCallback, useEffect, useState } from 'react';
import {
  IncomePageMain,
  IncomePageCharts,
  IncomePageChartsGrid,
  IncomePageFilter,
  IncomePageFilterActions,
  IncomePageFilterContainer,
  WithdrawContainer,
  WithdrawGrid,
  WithdrawGridLeft,
  WithdrawGridRight,
  WithdrawNameContainer,
  AmbassadorInput,
} from 'features/income/styles';
import { DGenerateAmbassadorIncomeFilter } from 'features/income/role/ambasador/data';
import {
  CardWithChart,
  CardWithText,
  CheckboxTable,
  CurrencyFeedback,
  Tabs,
} from 'components/custom';
import {
  SlidersHorizontalIcon,
  CampaignsIcon,
  SMLAIcon,
  SurveysAIcon,
  ReportsAIcon,
  IncomeSmallIcon,
} from 'components/svg';
import { faker } from '@faker-js/faker';
import { Button, Card, Input, InputGroup, Pagination } from 'components/ui';
import { Collapse, Stack } from 'components/system';
import { useModal, useSnackbar } from 'hooks';
import { ExportIncomeModal } from 'features/income/role/ambasador/elements';
import Note from 'components/custom/note';
import FinanceAPI from 'api/finance';
import { AmbassadorAPI } from 'api';
import { useAppContext } from 'context';
import { fetchAndCacheData } from 'utilities/local-storage';
import { CardWrapper } from './styles';

const IncomePage = () => {
  const [tab, setTab] = useState(0);

  const [filter, setFilter] = useState<any>(DGenerateAmbassadorIncomeFilter());

  const [filterOpen, setFilterOpen] = useState(false);

  const [eiModal, openEiModal, closeEiModal] = useModal(false);

  const [disabledWithdraw, setDisabledWithdraw] = useState<boolean>(false);

  const [campaignsOverTime4, setCampaignsOverTime4] = useState<any>([]);
  const [reportsOverTime4, setReportsOverTime4] = useState<any>([]);
  const [smlOvertime4, setSmlOverTime4] = useState<any>([]);
  const [surveysOverTime4, setSurveysOverTime4] = useState<any>([]);

  const { push } = useSnackbar();
  const { user } = useAppContext();

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(DGenerateAmbassadorIncomeFilter());
  };

  useEffect(() => {
    if (
      (!filter.firstName ||
        !filter.lastName ||
        !filter.bankName ||
        !filter.bankAddress ||
        !filter.amountW ||
        !filter.password) &&
      (!filter.iban || (!filter.swift && !filter.accountNumber))
    ) {
      setDisabledWithdraw(true);
    } else {
      setDisabledWithdraw(false);
    }
  }, [filter]);

  const handleWithdrawRequest = useCallback(async () => {
    try {
      await FinanceAPI.createWithdrawRequest({
        amount: filter.amountW,
        bankAccountFirstName: filter.firstName,
        bankAccountLastName: filter.lastName,
        bankName: filter.bankName,
        bankAddress: filter.bankAddress,
        iban: filter.iban,
        swift: filter.swift,
        accountNumber: filter.accountNumber,
        password: filter.password,
      }).then(() => {
        push('Withdraw request created successfully!', { variant: 'success' });
        clearFilters();
      });
    } catch (error: any) {
      push(error.response.data.message, { variant: 'error' });
    }
  }, [filter]);

  // eslint-disable-next-line consistent-return
  const getClientsProfitOverTimeData = async (queryParams: any) => {
    try {
      const response = await AmbassadorAPI.getClientsProfitOverTimeData(
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
      console.error(error);
    }
  };

  const getClientProfitGraphDataAsync =
    (
      product: number,
      setDataFunction: (data: any) => void,
      key: string,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getClientsProfitOverTimeData({
            useStrictPeriod: false,
            product,
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
    getClientProfitGraphDataAsync(
      0,
      setCampaignsOverTime4,
      'setCampaignsOverTime4'
    )();
    getClientProfitGraphDataAsync(
      1,
      setSurveysOverTime4,
      'setSurveysOverTime4'
    )();
    getClientProfitGraphDataAsync(2, setSmlOverTime4, 'setSmlOverTime4')();

    getClientProfitGraphDataAsync(
      3,
      setReportsOverTime4,
      'setReportsOverTime4'
    )();
  }, []);

  return (
    <IncomePageMain>
      <IncomePageCharts>
        <IncomePageChartsGrid>
          <CardWrapper>
            <CardWithChart
              title="Campaigns"
              icon={<CampaignsIcon />}
              smallIcon={<IncomeSmallIcon />}
              percent={
                campaignsOverTime4?.changePercentageMonth ||
                Number(0).toFixed(2)
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
          <CardWrapper>
            <CardWithChart
              title="SML"
              icon={<SMLAIcon />}
              smallIcon={<IncomeSmallIcon />}
              percent={
                smlOvertime4.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                smlOvertime4?.data
                  ? smlOvertime4?.data[smlOvertime4.data.length - 1].value
                  : 0
              }
              chartData={{
                values:
                  smlOvertime4.data &&
                  smlOvertime4.data.map((element: any) => element.value),
                labels:
                  smlOvertime4.data &&
                  smlOvertime4.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Surveys"
              icon={<SurveysAIcon />}
              smallIcon={<IncomeSmallIcon />}
              percent={
                surveysOverTime4?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                surveysOverTime4?.data
                  ? surveysOverTime4?.data[surveysOverTime4.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  surveysOverTime4.data &&
                  surveysOverTime4.data.map((element: any) => element.value),
                labels:
                  surveysOverTime4.data &&
                  surveysOverTime4.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Reports"
              icon={<ReportsAIcon />}
              smallIcon={<IncomeSmallIcon />}
              percent={
                reportsOverTime4?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                reportsOverTime4?.data
                  ? reportsOverTime4?.data[reportsOverTime4.data.length - 1]
                      .value
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
        </IncomePageChartsGrid>
      </IncomePageCharts>
      <Card>
        <Tabs
          value={tab}
          onValue={setTab}
          tabs={['Account Statement', 'Withdraw']}
        />
        {tab === 0 ? (
          <CardWithText
            title="Account Statement"
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
              <Button color="default" variant="contained" onClick={openEiModal}>
                Export
              </Button>,
            ]}
          >
            <Stack>
              <Collapse removeGap in={filterOpen}>
                <IncomePageFilter>
                  <IncomePageFilterContainer>
                    <Input
                      type="text"
                      label="Search"
                      placeholder="Please Enter"
                      value={filter.search}
                      onValue={(search) => setFilter({ ...filter, search })}
                    />
                    <Input
                      type="select"
                      label="Product"
                      placeholder="Please Select"
                      value={filter.product}
                      onValue={(product) => setFilter({ ...filter, product })}
                    />
                    <Input
                      type="select"
                      label="Client"
                      placeholder="Please Select"
                      value={filter.client}
                      onValue={(client) => setFilter({ ...filter, client })}
                    />
                    <InputGroup
                      label="Date"
                      inputRatio="1fr 1fr"
                      elements={[
                        {
                          value: filter.startDate,
                          onValue: (startDate) =>
                            setFilter({ ...filter, startDate }),
                          type: 'date',
                          placeholder: 'Start date',
                        },
                        {
                          value: filter.endDate,
                          onValue: (endDate) =>
                            setFilter({ ...filter, endDate }),
                          type: 'date',
                          placeholder: 'End date',
                        },
                      ]}
                    />
                    <AmbassadorInput
                      type="min-max"
                      label="Amount"
                      value={filter.amount}
                      onValue={(amount) => setFilter({ ...filter, amount })}
                    />
                  </IncomePageFilterContainer>
                  <IncomePageFilterActions direction="horizontal">
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
                  </IncomePageFilterActions>
                </IncomePageFilter>
              </Collapse>
              <CheckboxTable
                head={[
                  {
                    reference: 'statement',
                    label: 'Statement',
                    visible: true,
                  },
                  {
                    reference: 'client',
                    label: 'Client',
                    visible: true,
                  },
                  {
                    reference: 'date',
                    label: 'Date',
                    visible: true,
                  },
                  {
                    reference: 'amount',
                    label: 'Amount',
                    visible: true,
                  },
                ]}
                items={[]}
                renderItem={() => {}}
              />

              <Pagination style={{ justifyContent: 'right' }} count={0} />
            </Stack>
          </CardWithText>
        ) : (
          <WithdrawContainer>
            <Stack>
              <WithdrawGrid>
                <WithdrawGridLeft>
                  <Stack>
                    <WithdrawNameContainer direction="horizontal">
                      <Input
                        type="text"
                        label="First Name"
                        placeholder="Please Enter"
                        value={filter.firstName}
                        onValue={(firstName) =>
                          setFilter({ ...filter, firstName })
                        }
                        required
                      />
                      <Input
                        type="text"
                        label="Last Name"
                        placeholder="Please Enter"
                        value={filter.lastName}
                        onValue={(lastName) =>
                          setFilter({ ...filter, lastName })
                        }
                        required
                      />
                    </WithdrawNameContainer>
                    <Input
                      type="text"
                      label="Bank Name"
                      placeholder="Please Enter"
                      value={filter.bankName}
                      onValue={(bankName) => setFilter({ ...filter, bankName })}
                      required
                    />
                    <Input
                      type="text"
                      label="Bank Address"
                      placeholder="Please Enter"
                      value={filter.bankAddress}
                      onValue={(bankAddress) =>
                        setFilter({ ...filter, bankAddress })
                      }
                      required
                    />
                    <Input
                      type="text"
                      label="IBAN"
                      placeholder="Please Enter"
                      value={filter.iban}
                      onValue={(iban) => setFilter({ ...filter, iban })}
                      disabled={filter.swift || filter.accountNumber}
                    />
                    <Input
                      type="text"
                      label="SWIFT/BIC"
                      placeholder="Please Enter"
                      value={filter.swift}
                      onValue={(swift) => setFilter({ ...filter, swift })}
                      disabled={filter.iban}
                    />
                    <Input
                      type="text"
                      label="Account Number"
                      placeholder="Please Enter"
                      value={filter.accountNumber}
                      onValue={(accountNumber) =>
                        setFilter({ ...filter, accountNumber })
                      }
                      disabled={filter.iban}
                    />
                  </Stack>
                </WithdrawGridLeft>
                <WithdrawGridRight>
                  <Stack>
                    <Input
                      label="Enter Amount (Available amount is 0.00)"
                      type="number"
                      startAdornment="CHF"
                      value={filter.amountW}
                      onValue={(amount) =>
                        setFilter({ ...filter, amountW: amount })
                      }
                    />
                    <CurrencyFeedback value={filter.amountW} />
                    <Input
                      type="password"
                      label="Confirm Password"
                      placeholder="Password"
                      value={filter.password}
                      onValue={(password) => setFilter({ ...filter, password })}
                    />
                    <Note showIcon>
                      Enter your password to make sure it is really you.
                    </Note>
                    <Button
                      color="primary"
                      variant="contained"
                      disabled={disabledWithdraw}
                      onClick={handleWithdrawRequest}
                    >
                      Withdraw
                    </Button>
                  </Stack>
                </WithdrawGridRight>
              </WithdrawGrid>
            </Stack>
          </WithdrawContainer>
        )}
      </Card>
      {eiModal && <ExportIncomeModal onClose={closeEiModal} />}
    </IncomePageMain>
  );
};

export default IncomePage;
