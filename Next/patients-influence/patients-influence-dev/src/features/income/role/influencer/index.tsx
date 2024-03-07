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
import { DGenerateIncomeFilter } from 'features/income/role/influencer/data';
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
  SurveysAIcon,
  DonationsIcon,
  AffiliateIcon,
  IncomeSmallIcon,
} from 'components/svg';
import { faker } from '@faker-js/faker';
import { Button, Card, Input, InputGroup, Pagination } from 'components/ui';
import { Collapse, Stack } from 'components/system';
import { useModal, useSnackbar } from 'hooks';
import {
  ExportIncomePModal,
  ExportIncomeSModal,
} from 'features/income/role/influencer/elements';
import Note from 'components/custom/note';
import FinanceAPI from 'api/finance';
import { useAppContext } from 'context';
import { InsightsAPI } from 'api';
import { fetchAndCacheData } from 'utilities/local-storage';
import { CardWrapper } from './styles';

const IncomePage = () => {
  const [tab, setTab] = useState(0);

  const [filter, setFilter] = useState<any>(DGenerateIncomeFilter());

  const [filterOpen, setFilterOpen] = useState(false);

  const [eiPModal, openEipModal, closeEipModal] = useModal(false);
  const [eiSModal, openEisModal, closeEisModal] = useModal(false);

  const [disabledWithdraw, setDisabledWithdraw] = useState<boolean>(false);

  const { push } = useSnackbar();

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(DGenerateIncomeFilter());
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
        amount: parseFloat(filter.amountW).toFixed(2),
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

  const [incomeOverTime1, setIncomeOverTime1] = useState<any>([]);
  const [incomeOverTime2, setIncomeOverTime2] = useState<any>([]);
  const [incomeOverTime3, setIncomeOverTime3] = useState<any>([]);

  const { user } = useAppContext();

  const getIncomeOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response =
        await InsightsAPI.getInfluencerPlatformProductsIncomeData(user.id, {
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

  const getInfluencerIncomeGraphDataAsync =
    (
      platformProduct: number,
      setDataFunction: (data: any) => void,
      key: string,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getIncomeOverTimeData({
            platformProduct,
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

  const getInfluencerAffiliateIncomeData = async (
    queryParams: any
  ): Promise<any> => {
    try {
      const response = await InsightsAPI.getInfluencerAffiliateIncomeData(
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

  const getInfluencerAffiliateIncomeDataAsync =
    (
      setDataFunction: (data: any) => void,
      key: string,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getInfluencerAffiliateIncomeData({
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
    getInfluencerIncomeGraphDataAsync(
      0,
      setIncomeOverTime1,
      'setIncomeOverTime1'
    )();
    getInfluencerIncomeGraphDataAsync(
      1,
      setIncomeOverTime2,
      'setIncomeOverTime2'
    )();

    getInfluencerAffiliateIncomeDataAsync(
      setIncomeOverTime3,
      'setIncomeOverTime3'
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
                incomeOverTime1?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                incomeOverTime1?.data
                  ? incomeOverTime1?.data[incomeOverTime1.data.length - 1].value
                  : 0
              }
              chartData={{
                values:
                  incomeOverTime1?.data &&
                  incomeOverTime1.data.map((element: any) => element.value),
                labels:
                  incomeOverTime1?.data &&
                  incomeOverTime1?.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Surveys"
              icon={<SurveysAIcon />}
              smallIcon={<IncomeSmallIcon />}
              percent={
                incomeOverTime2?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                incomeOverTime2?.data
                  ? incomeOverTime2?.data[incomeOverTime2.data.length - 1].value
                  : 0
              }
              chartData={{
                values:
                  incomeOverTime2?.data &&
                  incomeOverTime2.data.map((element: any) => element.value),
                labels:
                  incomeOverTime2?.data &&
                  incomeOverTime2?.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Affiliate program"
              icon={<AffiliateIcon />}
              smallIcon={<IncomeSmallIcon />}
              percent={
                incomeOverTime3?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                incomeOverTime3?.data
                  ? incomeOverTime3?.data[incomeOverTime3.data.length - 1].value
                  : 0
              }
              chartData={{
                values:
                  incomeOverTime3?.data &&
                  incomeOverTime3.data.map((element: any) => element.value),
                labels:
                  incomeOverTime3?.data &&
                  incomeOverTime3?.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Donations"
              icon={<DonationsIcon />}
              smallIcon={<IncomeSmallIcon />}
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
        </IncomePageChartsGrid>
      </IncomePageCharts>
      <Card>
        <Tabs
          value={tab}
          onValue={setTab}
          tabs={['Account Statement', 'Affiliate Program', 'Withdraw']}
          style={
            window.innerWidth < 500
              ? {
                  maxWidth: '77vw',
                }
              : {}
          }
        />
        {tab === 0 && (
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
              <Button
                color="default"
                variant="contained"
                onClick={openEisModal}
              >
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
                      label="Type"
                      placeholder="Please Enter"
                      value={filter.type}
                      onValue={(type) => setFilter({ ...filter, type })}
                    />
                    <InputGroup
                      label="Date"
                      inputRatio="1fr 1fr"
                      elements={[
                        {
                          value: filter.start,
                          onValue: (start) => setFilter({ ...filter, start }),
                          type: 'date',
                          placeholder: 'Start date',
                        },
                        {
                          value: filter.end,
                          onValue: (end) => setFilter({ ...filter, end }),
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
                    reference: 'type',
                    label: 'Type',
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
        )}
        {tab === 1 && (
          <CardWithText
            title="Affiliate Program"
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
              <Button
                color="default"
                variant="contained"
                onClick={openEipModal}
              >
                Export
              </Button>,
            ]}
          >
            <Stack>
              <Collapse removeGap in={filterOpen}>
                <IncomePageFilter>
                  <IncomePageFilterContainer>
                    <Input
                      type="select"
                      label="Search"
                      placeholder="Please Enter"
                      value={filter.searchForUser}
                      onValue={(searchForUser) =>
                        setFilter({ ...filter, searchForUser })
                      }
                    />
                    <InputGroup
                      label="Start & Finish"
                      inputRatio="200px 200px"
                      elements={[
                        {
                          value: filter.registrationDateStart,
                          onValue: (registrationDateStart) =>
                            setFilter({ ...filter, registrationDateStart }),
                          type: 'date',
                          placeholder: 'Start date',
                        },
                        {
                          value: filter.registrationDateEnd,
                          onValue: (registrationDateEnd) =>
                            setFilter({ ...filter, registrationDateEnd }),
                          type: 'date',
                          placeholder: 'End date',
                        },
                      ]}
                    />
                    <AmbassadorInput
                      type="min-max"
                      label="Amount"
                      value={filter.amountP}
                      onValue={(amountP) => setFilter({ ...filter, amountP })}
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
                    reference: 'name',
                    label: 'Name',
                    visible: true,
                  },
                  {
                    reference: 'registrationDate',
                    label: 'Registration Date',
                    visible: true,
                  },
                  {
                    reference: 'lifetimeValue',
                    label: 'Lifetime Value',
                    visible: true,
                  },
                ]}
                items={[]}
                renderItem={() => {}}
              />

              <Pagination style={{ justifyContent: 'right' }} count={0} />
            </Stack>
          </CardWithText>
        )}
        {tab === 2 && (
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
      {eiPModal && <ExportIncomePModal onClose={closeEipModal} />}
      {eiSModal && <ExportIncomeSModal onClose={closeEisModal} />}
    </IncomePageMain>
  );
};

export default IncomePage;
