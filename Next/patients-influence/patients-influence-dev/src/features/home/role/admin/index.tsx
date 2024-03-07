import React, { useEffect, useRef, useState } from 'react';
import {
  HomePageMain,
  HomePageCharts,
  HomePageChartsLabel,
  HomePageChartsGrid,
} from 'features/home/styles';
import { CardWithChart } from 'components/custom';
import {
  ContactedIcon,
  IdentifiedIcon,
  RegisteredIcon,
  TotalIcon,
  DailyIcon,
  YearlyIcon,
  MonthlyIcon,
  WeeklyIcon,
  UserIcon,
  InstagramIcon,
  TwitterIcon,
  TiktokIcon,
  HospitalIcon,
  RevenueIcon,
  FinishedIcon,
  OngoingIcon,
  InpreparationIcon,
  CostIcon,
  ProfitIcon,
  MarginIcon,
  CampaignsSmallIcon,
  SurveysSmallIcon,
  FinanceSmallIcon,
} from 'components/svg';
import { faker } from '@faker-js/faker';
import { CampaignAPI, ClientAPI, InfluencerAPI, SurveyAPI } from 'api';
import { useSnackbar } from 'hooks';
import FinanceAPI from 'api/finance';
import { fetchAndCacheData } from 'utilities/local-storage';
import { CardWrapper } from './styles';

const HomePage = () => {
  const [getDailyInfluencers, setDailyInfluencers] = useState<any>([]);
  const [getWeeklyInfluencers, setWeeklyInfluencers] = useState<any>([]);
  const [getMonthlyInfluencers, setMonthlyInfluencers] = useState<any>([]);
  const [getYearlyInfluencers, setYearlyInfluencers] = useState<any>([]);

  const [clientsOverTime1, setClientsOverTimeData1] = useState<any>([]);
  const [clientsOverTime2, setClientsOverTimeData2] = useState<any>([]);
  const [clientsOverTime3, setClientsOverTimeData3] = useState<any>([]);
  const [clientsOverTime4, setClientsOverTimeData4] = useState<any>([]);

  const [campaignsOverTime1, setCampaignsOverTimeData1] = useState<any>([]);
  const [campaignsOverTime2, setCampaignsOverTimeData2] = useState<any>([]);
  const [campaignsOverTime3, setCampaignsOverTimeData3] = useState<any>([]);
  const [campaignsOverTime4, setCampaignsOverTimeData4] = useState<any>([]);

  const [getInstagramInfluencers, setInstagramInfluencers] = useState<any>([]);

  const [surveysOverTime1, setSurveysOverTimeData1] = useState<any>([]);
  const [surveysOverTime2, setSurveysOverTimeData2] = useState<any>([]);
  const [surveysOverTime3, setSurveysOverTimeData3] = useState<any>([]);
  const [surveysOverTime4, setSurveysOverTimeData4] = useState<any>([]);

  const [_clientsRegistered, _setClientsRegistered] = useState<any>([]);
  const [_clientsScheduled, _setClientsScheduled] = useState<any>([]);
  const [clientsRegisteredDaily, setClientsRegisteredDaily] = useState<any>([]);
  const [clientsRegisteredWeekly, setClientsRegisteredWeekly] = useState<any>(
    []
  );
  const [clientsRegisteredMonthly, setClientsRegisteredMonthly] = useState<any>(
    []
  );
  const [clientsRegisteredYearly, setClientsRegisteredYearly] = useState<any>(
    []
  );

  const { push } = useSnackbar();

  const isMounted = useRef(false);

  const [filterParams, _setFilterParams] = useState({});

  const [filterRParams, _setFilterRParams] = useState({});

  // const [getSmlData1, setSmlData1] = useState<any>([]);
  // const [getSmlData2, setSmlData2] = useState<any>([]);
  // const [getSmlData3, setSmlData3] = useState<any>([]);
  // const [getSmlData4, setSmlData4] = useState<any>([]);

  // const [reportsOverTime1, setReportsOverTimeData1] = useState<any>([]);
  // const [reportsOverTime2, setReportsOverTimeData2] = useState<any>([]);
  // const [reportsOverTime3, setReportsOverTimeData3] = useState<any>([]);
  // const [reportsOverTime4, setReportsOverTimeData4] = useState<any>([]);

  const [financeOverTime1, setFinanceOverTimeData1] = useState<any>([]);
  const [financeOverTime2, setFinanceOverTimeData2] = useState<any>([]);
  const [financeOverTime3, setFinanceOverTimeData3] = useState<any>([]);
  const [financeOverTime4, setFinanceOverTimeData4] = useState<any>([]);

  const calculateRelativeGrowth = (
    data: { timestamp: string; value: number }[]
  ) => {
    const newData = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        const currentValue = data[i].value;
        const currentTimestamp = data[i].timestamp;
        newData.push({ timestamp: currentTimestamp, value: currentValue });
      } else {
        const previousValue = i !== 0 ? data[i - 1].value : data[0].value;
        const currentValue = data[i].value;
        const currentTimestamp = data[i].timestamp;
        const dailyGrowth = currentValue - previousValue;
        // data[i].value = dailyGrowth;
        newData.push({ timestamp: currentTimestamp, value: dailyGrowth });
      }
    }

    return newData;
  };

  const getFinanceRevenueOverTimeData = async (
    queryParams: any
    // eslint-disable-next-line consistent-return
  ): Promise<any> => {
    try {
      const response = await FinanceAPI.getFinanceRevenueOverTimeData({
        ...filterParams,
        ...queryParams,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.error(error);
    }
  };

  const getFinanceCostOverTimeData = async (
    queryParams: any
    // eslint-disable-next-line consistent-return
  ): Promise<any> => {
    try {
      const response = await FinanceAPI.getFinanceCostOverTimeData({
        ...filterParams,
        ...queryParams,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.error(error);
    }
  };

  const getFinanceProfitOverTimeData = async (
    queryParams: any
    // eslint-disable-next-line consistent-return
  ): Promise<any> => {
    try {
      const response = await FinanceAPI.getFinanceProfitOverTimeData({
        ...filterParams,
        ...queryParams,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.error(error);
    }
  };

  const getFinanceMarginOverTimeData = async (
    queryParams: any
    // eslint-disable-next-line consistent-return
  ): Promise<any> => {
    try {
      const response = await FinanceAPI.getFinanceMarginOverTimeData({
        ...filterParams,
        ...queryParams,
      });

      if (response.data) {
        return response.data;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.error(error);
    }
  };

  // TODO FINANCE

  const getFinanceRevenueGraphDataAsync =
    (type: string, setDataFunction: (data: any) => void, key: string) =>
    async () => {
      const params = {
        useStrictPeriod: false,
        numberOfPoints: 30,
        graphType: 'cumulative',
        includeData: ['changePercentageMonth'],
      };

      // TODO Investigate why this is sometimes causing fetchAndCacheData to throw error with JSON
      const result = await fetchAndCacheData(() => {
        switch (type) {
          case 'getFinanceRevenueOverTimeData':
            return getFinanceRevenueOverTimeData(params);
          case 'getFinanceCostOverTimeData':
            return getFinanceCostOverTimeData(params);
          case 'getFinanceProfitOverTimeData':
            return getFinanceProfitOverTimeData(params);
          case 'getFinanceMarginOverTimeData':
            return getFinanceMarginOverTimeData(params);
          default:
            return getFinanceMarginOverTimeData(params);
        }
      }, key);

      setDataFunction(result);
    };

  useEffect(() => {
    getFinanceRevenueGraphDataAsync(
      'getFinanceRevenueOverTimeData',
      setFinanceOverTimeData1,
      'setFinanceOverTimeData1'
    )();

    getFinanceRevenueGraphDataAsync(
      'getFinanceCostOverTimeData',
      setFinanceOverTimeData2,
      'setFinanceOverTimeData2'
    )();

    getFinanceRevenueGraphDataAsync(
      'getFinanceProfitOverTimeData',
      setFinanceOverTimeData3,
      'setFinanceOverTimeData3'
    )();

    getFinanceRevenueGraphDataAsync(
      'getFinanceMarginOverTimeData',
      setFinanceOverTimeData4,
      'setFinanceOverTimeData4'
    )();
  }, []);

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

  useEffect(() => {
    getInfluencerInstagramGraphDataAsync(
      setInstagramInfluencers,
      'setInstagramInfluencers',
      true
    )();
  }, []);

  // const getReportsOverTimeData = async (queryParams: any): Promise<any> => {
  //   try {
  //     const response = await CampaignAPI.getReportsOverTimeData({
  //       ...filterParams,
  //       ...queryParams,
  //     });

  //     if (response.data) {
  //       return response;
  //     }

  //     throw new Error('Error: Failed to fetch data!');
  //   } catch (error) {
  //     throw new Error('Error: Failed to fetch data!');
  //   }
  // };

  // const getReportsRevenueOverTimeData = async (
  //   queryParams: any
  // ): Promise<any> => {
  //   try {
  //     const response = await CampaignAPI.getReportsRevenueOverTimeData({
  //       ...filterParams,
  //       ...queryParams,
  //     });

  //     if (response.data) {
  //       return response;
  //     }

  //     throw new Error('Error: Failed to fetch data!');
  //   } catch (error) {
  //     throw new Error('Error: Failed to fetch data!');
  //   }
  // };

  // const getReportsGraphDataAsync =
  //   (status: number, setDataFunction: (data: any) => void, key: string) =>
  //   async () => {
  //     const result = await fetchAndCacheData(
  //       () =>
  //         getReportsOverTimeData({
  //           status,
  //           statusAtPointOfTime: true,
  //           useStrictPeriod: false,
  //           numberOfPoints: 30,
  //           graphType: 'cumulative',
  //           includeData: ['changePercentageMonth'],
  //         }),
  //       key
  //     );

  //     setDataFunction(result);
  //   };

  // const getReportsRevenueGraphDataAsync =
  //   (setDataFunction: (data: any) => void, key: string) => async () => {
  //     const result = await fetchAndCacheData(
  //       () =>
  //         getReportsRevenueOverTimeData({
  //           useStrictPeriod: false,
  //           numberOfPoints: 30,
  //           graphType: 'cumulative',
  //           includeData: ['changePercentageMonth'],
  //         }),
  //       key
  //     );

  //     setDataFunction(result);
  //   };

  // useEffect(() => {
  //   getReportsGraphDataAsync(
  //     4,
  //     setReportsOverTimeData1,
  //     'setReportsOverTimeData1'
  //   )();
  //   getReportsGraphDataAsync(
  //     5,
  //     setReportsOverTimeData2,
  //     'setReportsOverTimeData2'
  //   )();
  //   getReportsGraphDataAsync(
  //     6,
  //     setReportsOverTimeData3,
  //     'setReportsOverTimeData3'
  //   )();
  //   getReportsRevenueGraphDataAsync(
  //     setReportsOverTimeData4,
  //     'setReportsOverTimeData4'
  //   )();
  // }, []);

  const getCampaignsOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response = await CampaignAPI.getCampaignsOverTimeData({
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

  const getCampaignsRevenueOverTimeData = async (
    queryParams: any
  ): Promise<any> => {
    try {
      const response = await CampaignAPI.getCampaignsRevenueOverTimeData({
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

  const getCampaignGraphDataAsync =
    (status: number, setDataFunction: (data: any) => void, key: string) =>
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
        key
      );

      setDataFunction(result);
    };

  const getCampaignRevenueGraphDataAsync =
    (setDataFunction: (data: any) => void, key: string) => async () => {
      const result = await fetchAndCacheData(
        () =>
          getCampaignsRevenueOverTimeData({
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
    getCampaignGraphDataAsync(
      0,
      setCampaignsOverTimeData1,
      'setCampaignsOverTimeData1'
    )();
    getCampaignGraphDataAsync(
      1,
      setCampaignsOverTimeData2,
      'setCampaignsOverTimeData2'
    )();
    getCampaignGraphDataAsync(
      2,
      setCampaignsOverTimeData3,
      'setCampaignsOverTimeData3'
    )();
    getCampaignRevenueGraphDataAsync(
      setCampaignsOverTimeData4,
      'setCampaignsOverTimeData4'
    )();
  }, []);

  const getClientsOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response = await ClientAPI.getClientsOverTimeData({
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

  const getClientGraphDataAsync =
    (
      industryId: number,
      setDataFunction: (data: any) => void,
      key: string,
      reformatToAbsoluteGraphData: boolean = false,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getClientsOverTimeData({
            industryId,
            useStrictPeriod: false,
            numberOfPoints: 30,
            graphType: 'cumulative',
            includeData: ['changePercentageMonth'],
          }),
        key,
        forceUpdate
      );

      if (reformatToAbsoluteGraphData) {
        result.data = calculateRelativeGrowth(result.data);
      }

      setDataFunction(result);
    };

  // const last30daysValues = clientsOverTime1?.data?.slice(-30);

  // const sumOfLast30DaysValues = last30daysValues?.reduce(
  //   (accumulator: number, currentValue: { value: number }) =>
  //     accumulator + currentValue.value,
  //   0
  // );

  // const last12WeeksValues = clientsOverTime2?.data?.slice(-84);

  // const sumOfLast12WeeksValues = last12WeeksValues?.reduce(
  //   (accumulator: number, currentValue: { value: number }) =>
  //     accumulator + currentValue.value,
  //   0
  // );

  // const lastYearValues = clientsOverTime3?.data?.slice(-365);

  // const sumOfLastYearValues = lastYearValues?.reduce(
  //   (accumulator: number, currentValue: { value: number }) =>
  //     accumulator + currentValue.value,
  //   0
  // );

  // const last6yearsdaysValues = clientsOverTime4?.data?.slice(-2191);

  // const sumOfLast6yearsDaysValues = last6yearsdaysValues?.reduce(
  //   (accumulator: number, currentValue: { value: number }) =>
  //     accumulator + currentValue.value,
  //   0
  // );

  const getSurveysOverTimeData = async (queryParams: any): Promise<any> => {
    try {
      const response = await SurveyAPI.getSurveyOvertimeData({
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

  const getSurveysRevenueOverTimeData = async (
    queryParams: any
  ): Promise<any> => {
    try {
      const response = await SurveyAPI.getSurveyRevenueOvertimeData({
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

  const getSurveyGraphDataAsync =
    (status: number, setDataFunction: (data: any) => void, key: string) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getSurveysOverTimeData({
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

  const getSurveyRevenueGraphDataAsync =
    (setDataFunction: (data: any) => void, key: string) => async () => {
      const result = await fetchAndCacheData(
        () =>
          getSurveysRevenueOverTimeData({
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
    getSurveyGraphDataAsync(
      0,
      setSurveysOverTimeData1,
      'setSurveysOverTimeData1'
    )();

    getSurveyGraphDataAsync(
      1,
      setSurveysOverTimeData2,
      'setSurveysOverTimeData2'
    )();

    getSurveyGraphDataAsync(
      2,
      setSurveysOverTimeData3,
      'setSurveysOverTimeData3'
    )();

    getSurveyRevenueGraphDataAsync(
      setSurveysOverTimeData4,
      'setSurveysOverTimeData4'
    )();
  }, []);

  // eslint-disable-next-line consistent-return
  // const getAllSmlGraphData = async (queryParams: any): Promise<any> => {
  //   try {
  //     const response = await SMLApi.getAllSmlGraphData({
  //       ...filterParams,
  //       ...queryParams,
  //     });

  //     if (response.data) {
  //       return response.data;
  //     }

  //     throw new Error('Error: Failed to fetch data!');
  //   } catch (error) {
  //     throw new Error('Error: Failed to fetch data!');
  //   }
  // };

  // const getAllSmlRevenueGraphData = async (queryParams: any): Promise<any> => {
  //   try {
  //     const response = await SMLApi.getAllSmlRevenueGraphData({
  //       ...filterParams,
  //       ...queryParams,
  //     });

  //     if (response.data) {
  //       return response.data;
  //     }

  //     throw new Error('Error: Failed to fetch data!');
  //   } catch (error) {
  //     throw new Error('Error: Failed to fetch data!');
  //   }
  // };

  // // TODO SOCIAL

  // const getSMLGraphDataAsync =
  //   (status: number, setDataFunction: (data: any) => void, key: string) =>
  //   async () => {
  //     const result = await fetchAndCacheData(
  //       () =>
  //         getAllSmlGraphData({
  //           status,
  //           statusAtPointOfTime: true,
  //           useStrictPeriod: false,
  //           numberOfPoints: 30,
  //           graphType: 'cumulative',
  //           includeData: ['changePercentageMonth'],
  //         }),
  //       key
  //     );

  //     setDataFunction(result);
  //   };

  // const getSMLRevenueGraphDataAsync =
  //   (setDataFunction: (data: any) => void, key: string) => async () => {
  //     const result = await fetchAndCacheData(
  //       () =>
  //         getAllSmlRevenueGraphData({
  //           useStrictPeriod: false,
  //           numberOfPoints: 30,
  //           graphType: 'cumulative',
  //           includeData: ['changePercentageMonth'],
  //         }),
  //       key
  //     );

  //     setDataFunction(result);
  //   };

  // useEffect(() => {
  //   getSMLGraphDataAsync(4, setSmlData1, 'setSmlData1')();
  //   getSMLGraphDataAsync(5, setSmlData2, 'setSmlData2')();
  //   getSMLGraphDataAsync(6, setSmlData3, 'setSmlData3')();
  //   getSMLRevenueGraphDataAsync(setSmlData4, 'setSmlData4')();
  // }, []);

  const getAllRegisteredClients = async (queryParams: any): Promise<any> => {
    try {
      const response = await ClientAPI.getDregisteredClientsGraphData({
        ...filterRParams,
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

  const getDiscoverClientGraphDataAsync =
    (
      graphPeriod: string,
      setDataFunction: (data: any) => void,
      key: string,
      reformatToAbsoluteGraphData: boolean = false,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const clientResults = await fetchAndCacheData(
        () =>
          getAllRegisteredClients({
            useStrictPeriod: true,
            graphPeriod,
            graphType: 'cumulative',
            roundDateToDay: true,
            includeOngoingPeriod: true,
          }),
        key,
        forceUpdate
      );

      if (reformatToAbsoluteGraphData) {
        clientResults.data = calculateRelativeGrowth(clientResults.data);
      }

      setDataFunction(clientResults);
    };

  // useEffect(() => {
  //   if (!isMounted.current) {
  //     getDiscoverClientGraphDataAsync(
  //       'daily',
  //       setClientsRegisteredDaily,
  //       'setClientsRegisteredDaily',
  //       true
  //     )();
  //     getDiscoverClientGraphDataAsync(
  //       'weekly',
  //       setClientsRegisteredWeekly,
  //       'setClientsRegisteredWeekly',
  //       true
  //     )();
  //     getDiscoverClientGraphDataAsync(
  //       'monthly',
  //       setClientsRegisteredMonthly,
  //       'setClientsRegisteredMonthly',
  //       true
  //     )();
  //     getDiscoverClientGraphDataAsync(
  //       'yearly',
  //       setClientsRegisteredYearly,
  //       'setClientsRegisteredYearly',
  //       true
  //     )();
  //   }
  //   return () => {
  //     isMounted.current = true;
  //   };
  // }, []);

  // eslint-disable-next-line consistent-return
  const getAllInfluencers = async (queryParams: any): Promise<any> => {
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
      console.error('error', error);
    }
  };

  const getInfluencerGraphDataAsync =
    (
      graphPeriod: string,
      setDataFunction: (data: any) => void,
      key: string,
      reformatToAbsoluteGraphData: boolean = false,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getAllInfluencers({
            useStrictPeriod: true,
            graphPeriod,
            graphType: 'cumulative',
            roundDateToDay: true,
            includeOngoingPeriod: true,
          }),
        key,
        forceUpdate
      );

      if (reformatToAbsoluteGraphData) {
        result.data = calculateRelativeGrowth(result.data);
      }

      setDataFunction(result);
    };

  useEffect(() => {
    getInfluencerGraphDataAsync(
      'daily',
      setDailyInfluencers,
      'setDailyInfluencers',
      true
    )();
    getInfluencerGraphDataAsync(
      'weekly',
      setWeeklyInfluencers,
      'setWeeklyinfluencers',
      true
    )();
    getInfluencerGraphDataAsync(
      'monthly',
      setMonthlyInfluencers,
      'setMonthlyinfluencers',
      true
    )();
    getInfluencerGraphDataAsync(
      'yearly',
      setYearlyInfluencers,
      'setYearlyinfluencers',
      true
    )();

    getDiscoverClientGraphDataAsync(
      'daily',
      setClientsRegisteredDaily,
      'setClientsRegisteredDaily',
      true
    )();
    getDiscoverClientGraphDataAsync(
      'weekly',
      setClientsRegisteredWeekly,
      'setClientsRegisteredWeekly',
      true
    )();
    getDiscoverClientGraphDataAsync(
      'monthly',
      setClientsRegisteredMonthly,
      'setClientsRegisteredMonthly',
      true
    )();
    getDiscoverClientGraphDataAsync(
      'yearly',
      setClientsRegisteredYearly,
      'setClientsRegisteredYearly',
      true
    )();

    getClientGraphDataAsync(
      1,
      setClientsOverTimeData1,
      'setClientsOverTimeData1',
      true
    )();
    getClientGraphDataAsync(
      2,
      setClientsOverTimeData2,
      'setClientsOverTimeData2',
      true
    )();
    getClientGraphDataAsync(
      3,
      setClientsOverTimeData3,
      'setClientsOverTimeData3',
      true
    )();
    getClientGraphDataAsync(
      4,
      setClientsOverTimeData4,
      'setClientsOverTimeData4',
      true
    )();
  }, []);

  const influencersLast30Days = getDailyInfluencers?.data?.slice(-30);

  // const sumOfinfluencersLast30Days = influencersLast30Days?.reduce(
  //   (accumulator: number, currentValue: { value: number }) =>
  //     accumulator + currentValue.value,
  //   0
  // );

  const influencersLast12Weeks = getWeeklyInfluencers?.data?.slice(-84);

  // const sumOfinfluencersLast12Weeks = influencersLast12Weeks?.reduce(
  //   (accumulator: number, currentValue: { value: number }) =>
  //     accumulator + currentValue.value,
  //   0
  // );

  const influencersLastyear = getMonthlyInfluencers?.data?.slice(-365);

  // const sumOfinfluencersLastyear = influencersLastyear?.reduce(
  //   (accumulator: number, currentValue: { value: number }) =>
  //     accumulator + currentValue.value,
  //   0
  // );

  const influencersLastSixYears = getYearlyInfluencers?.data?.slice(-2191);

  // const sumOfinfluencersLastSixYears = influencersLastSixYears?.reduce(
  //   (accumulator: number, currentValue: { value: number }) =>
  //     accumulator + currentValue.value,
  //   0
  // );

  const sumofClients = clientsRegisteredDaily?.data?.reduce(
    (accumulator: number, currentValue: { value: number }) =>
      accumulator + currentValue.value,
    0
  );

  // const [benefitsOverTime1, setBenefitsOverTimeData1] = useState<any>([]);
  // const [benefitsOverTime2, setBenefitsOverTimeData2] = useState<any>([]);
  // const [benefitsOverTime3, setBenefitsOverTimeData3] = useState<any>([]);
  // const [benefitsOverTime4, setBenefitsOverTimeData4] = useState<any>([]);
  // const [benefitsOverTime5, setBenefitsOverTimeData5] = useState<any>([]);
  // const [benefitsOverTime6, setBenefitsOverTimeData6] = useState<any>([]);
  // const [benefitsOverTime7, setBenefitsOverTimeData7] = useState<any>([]);
  // const [benefitsOverTime8, setBenefitsOverTimeData8] = useState<any>([]);
  // const [benefitsOverTime9, setBenefitsOverTimeData9] = useState<any>([]);
  // const [benefitsOverTime10, setBenefitsOverTimeData10] = useState<any>([]);
  // const [benefitsOverTime11, setBenefitsOverTimeData11] = useState<any>([]);
  // const [benefitsOverTime12, setBenefitsOverTimeData12] = useState<any>([]);

  // const getBenefitsOverTimeData = async (queryParams: any): Promise<any> => {
  //   try {
  //     const response = await BenefitsAPI.getBenefitsOverTimeData({
  //       ...filterParams,
  //       ...queryParams,
  //     });

  //     if (response.data) {
  //       return response.data;
  //     }

  //     throw new Error('Error: Failed to fetch data!');
  //   } catch (error) {
  //     throw new Error('Error: Failed to fetch data!');
  //   }
  // };

  // const getBenefitsGraphDataAsync =
  //   (
  //     categoryId: number,
  //     setDataFunction: (data: any) => void,
  //     key: string,
  //     maxResults: number | undefined = undefined
  //   ) =>
  //   async () => {
  //     const result = await fetchAndCacheData(
  //       () =>
  //         getBenefitsOverTimeData({
  //           categoryId,
  //           graphType: 'cumulative',
  //           maxResults,
  //           includeData: ['changePercentageMonth'],
  //         }),
  //       key
  //     );

  //     setDataFunction(result);
  //   };

  // useEffect(() => {
  //   getBenefitsGraphDataAsync(
  //     1,
  //     setBenefitsOverTimeData1,
  //     'setBenefitsOverTimeData1',
  //     1
  //   )();

  //   getBenefitsGraphDataAsync(
  //     2,
  //     setBenefitsOverTimeData2,
  //     'setBenefitsOverTimeData2'
  //   )();

  //   getBenefitsGraphDataAsync(
  //     3,
  //     setBenefitsOverTimeData3,
  //     'setBenefitsOverTimeData3'
  //   )();

  //   getBenefitsGraphDataAsync(
  //     4,
  //     setBenefitsOverTimeData4,
  //     'setBenefitsOverTimeData4'
  //   )();
  //   getBenefitsGraphDataAsync(
  //     5,
  //     setBenefitsOverTimeData5,
  //     'setBenefitsOverTimeData5'
  //   )();

  //   getBenefitsGraphDataAsync(
  //     6,
  //     setBenefitsOverTimeData6,
  //     'setBenefitsOverTimeData6'
  //   )();

  //   getBenefitsGraphDataAsync(
  //     7,
  //     setBenefitsOverTimeData7,
  //     'setBenefitsOverTimeData7'
  //   )();

  //   getBenefitsGraphDataAsync(
  //     8,
  //     setBenefitsOverTimeData8,
  //     'setBenefitsOverTimeData8'
  //   )();

  //   getBenefitsGraphDataAsync(
  //     9,
  //     setBenefitsOverTimeData9,
  //     'setBenefitsOverTimeData9'
  //   )();

  //   getBenefitsGraphDataAsync(
  //     10,
  //     setBenefitsOverTimeData10,
  //     'setBenefitsOverTimeData10'
  //   )();

  //   getBenefitsGraphDataAsync(
  //     11,
  //     setBenefitsOverTimeData11,
  //     'setBenefitsOverTimeData11'
  //   )();

  //   getBenefitsGraphDataAsync(
  //     12,
  //     setBenefitsOverTimeData12,
  //     'setBenefitsOverTimeData12'
  //   )();
  // }, []);

  const getPercentage = (last: number, preLast: number) => {
    if (last === 0 && preLast === 0) {
      const preLastIsZero = last * 100;
      return Number(preLastIsZero).toFixed(2);
    }

    if (last !== 0 && preLast === 0) {
      const preLastIsZero = 100;
      return Number(preLastIsZero).toFixed(2);
    }
    const difference = last - preLast;

    const growthRate = (difference / preLast) * 100;

    return Number(growthRate.toFixed(2));
  };

  return (
    <HomePageMain>
      <HomePageCharts>
        <HomePageChartsLabel>Discover Influencers</HomePageChartsLabel>
        <HomePageChartsGrid>
          <CardWrapper>
            <CardWithChart
              title="Daily"
              icon={<DailyIcon />}
              smallIcon={<UserIcon />}
              percent={
                getDailyInfluencers?.data &&
                getPercentage(
                  getDailyInfluencers?.data[getDailyInfluencers.data.length - 1]
                    .value,
                  getDailyInfluencers?.data[
                    // eslint-disable-next-line no-unsafe-optional-chaining
                    getDailyInfluencers?.data.length - 2
                  ].value
                )
              }
              count={
                getDailyInfluencers?.data
                  ? getDailyInfluencers?.data[
                      getDailyInfluencers.data.length - 1
                    ].value
                  : 0
              }
              chartData={{
                values:
                  getDailyInfluencers?.data &&
                  getDailyInfluencers.data.map((element: any) => element.value),
                labels:
                  getDailyInfluencers?.data &&
                  getDailyInfluencers?.data.map(
                    (element: any) => element.value
                  ),
              }}
            />
          </CardWrapper>

          <CardWrapper>
            {getWeeklyInfluencers ? (
              <CardWithChart
                title="Weekly"
                icon={<WeeklyIcon />}
                smallIcon={<UserIcon />}
                percent={
                  getWeeklyInfluencers.data &&
                  getPercentage(
                    getWeeklyInfluencers?.data[
                      getWeeklyInfluencers.data.length - 1
                    ].value,
                    getWeeklyInfluencers?.data[
                      getWeeklyInfluencers.data.length - 2
                    ].value
                  )
                }
                count={
                  getWeeklyInfluencers?.data
                    ? getWeeklyInfluencers?.data[
                        getWeeklyInfluencers.data.length - 1
                      ].value
                    : 0
                }
                chartData={{
                  values:
                    getWeeklyInfluencers?.data &&
                    getWeeklyInfluencers.data.map(
                      (element: any) => element.value
                    ),
                  labels:
                    getWeeklyInfluencers?.data &&
                    getWeeklyInfluencers?.data.map(
                      (element: any) => element.value
                    ),
                }}
              />
            ) : undefined}
          </CardWrapper>
          <CardWrapper>
            {getMonthlyInfluencers ? (
              <CardWithChart
                title="Monthly"
                icon={<MonthlyIcon />}
                smallIcon={<UserIcon />}
                percent={
                  getMonthlyInfluencers.data &&
                  getPercentage(
                    getMonthlyInfluencers?.data[
                      getMonthlyInfluencers.data.length - 1
                    ].value,
                    getMonthlyInfluencers?.data[
                      getMonthlyInfluencers.data.length - 2
                    ].value
                  )
                }
                count={
                  getMonthlyInfluencers?.data
                    ? getMonthlyInfluencers?.data[
                        getMonthlyInfluencers.data.length - 1
                      ].value
                    : 0
                }
                chartData={{
                  values:
                    getMonthlyInfluencers?.data &&
                    getMonthlyInfluencers.data.map(
                      (element: any) => element.value
                    ),
                  labels:
                    getMonthlyInfluencers?.data &&
                    getMonthlyInfluencers?.data.map(
                      (element: any) => element.value
                    ),
                }}
              />
            ) : undefined}
          </CardWrapper>
          <CardWrapper>
            {getYearlyInfluencers ? (
              <CardWithChart
                title="Yearly"
                icon={<YearlyIcon />}
                smallIcon={<UserIcon />}
                percent={
                  getYearlyInfluencers.data &&
                  getPercentage(
                    getYearlyInfluencers?.data[
                      getYearlyInfluencers.data.length - 1
                    ].value,
                    getYearlyInfluencers?.data[
                      getYearlyInfluencers.data.length - 2
                    ].value
                  )
                }
                count={
                  getYearlyInfluencers?.data
                    ? getYearlyInfluencers?.data[
                        getYearlyInfluencers.data.length - 1
                      ].value
                    : 0
                }
                chartData={{
                  values:
                    getYearlyInfluencers?.data &&
                    getYearlyInfluencers.data.map(
                      (element: any) => element.value
                    ),
                  labels:
                    getYearlyInfluencers?.data &&
                    getYearlyInfluencers?.data.map(
                      (element: any) => element.value
                    ),
                }}
              />
            ) : undefined}
          </CardWrapper>
        </HomePageChartsGrid>
      </HomePageCharts>
      <HomePageCharts>
        <HomePageChartsLabel>Discover Clients</HomePageChartsLabel>
        <HomePageChartsGrid>
          <CardWrapper>
            <CardWithChart
              title="Daily"
              icon={<DailyIcon />}
              percent={
                clientsRegisteredDaily.data &&
                getPercentage(
                  clientsRegisteredDaily?.data[
                    clientsRegisteredDaily.data.length - 1
                  ].value,
                  clientsRegisteredDaily?.data[
                    clientsRegisteredDaily.data.length - 2
                  ].value
                )
              }
              count={
                clientsRegisteredDaily?.data
                  ? clientsRegisteredDaily?.data[
                      clientsRegisteredDaily.data.length - 1
                    ].value
                  : 0
              }
              chartData={{
                values:
                  clientsRegisteredDaily?.data &&
                  clientsRegisteredDaily.data.map(
                    (element: any) => element.value
                  ),
                labels:
                  clientsRegisteredDaily?.data &&
                  clientsRegisteredDaily?.data.map(
                    (element: any) => element.value
                  ),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Weekly"
              icon={<WeeklyIcon />}
              percent={
                clientsRegisteredWeekly.data &&
                getPercentage(
                  clientsRegisteredWeekly?.data[
                    clientsRegisteredWeekly.data.length - 1
                  ].value,
                  clientsRegisteredWeekly?.data[
                    clientsRegisteredWeekly.data.length - 2
                  ].value
                )
              }
              count={
                clientsRegisteredWeekly?.data
                  ? clientsRegisteredWeekly?.data[
                      clientsRegisteredWeekly.data.length - 1
                    ].value
                  : 0
              }
              chartData={{
                values:
                  clientsRegisteredWeekly?.data &&
                  clientsRegisteredWeekly.data.map(
                    (element: any) => element.value
                  ),
                labels:
                  clientsRegisteredWeekly?.data &&
                  clientsRegisteredWeekly?.data.map(
                    (element: any) => element.value
                  ),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Monthly"
              icon={<MonthlyIcon />}
              percent={
                clientsRegisteredMonthly.data &&
                getPercentage(
                  clientsRegisteredMonthly?.data[
                    clientsRegisteredMonthly.data.length - 1
                  ].value,
                  clientsRegisteredMonthly?.data[
                    clientsRegisteredMonthly.data.length - 2
                  ].value
                )
              }
              count={
                clientsRegisteredMonthly?.data
                  ? clientsRegisteredMonthly?.data[
                      clientsRegisteredMonthly.data.length - 1
                    ].value
                  : 0
              }
              chartData={{
                values:
                  clientsRegisteredMonthly?.data &&
                  clientsRegisteredMonthly.data.map(
                    (element: any) => element.value
                  ),
                labels:
                  clientsRegisteredMonthly?.data &&
                  clientsRegisteredMonthly?.data.map(
                    (element: any) => element.value
                  ),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Yearly"
              icon={<YearlyIcon />}
              percent={
                clientsRegisteredYearly.data &&
                getPercentage(
                  clientsRegisteredYearly?.data[
                    clientsRegisteredYearly.data.length - 1
                  ].value,
                  clientsRegisteredYearly?.data[
                    clientsRegisteredYearly.data.length - 2
                  ].value
                )
              }
              count={
                clientsRegisteredYearly?.data
                  ? clientsRegisteredYearly?.data[
                      clientsRegisteredYearly.data.length - 1
                    ].value
                  : 0
              }
              chartData={{
                values:
                  clientsRegisteredYearly?.data &&
                  clientsRegisteredYearly.data.map(
                    (element: any) => element.value
                  ),
                labels:
                  clientsRegisteredYearly?.data &&
                  clientsRegisteredYearly?.data.map(
                    (element: any) => element.value
                  ),
              }}
            />
          </CardWrapper>
        </HomePageChartsGrid>
      </HomePageCharts>
      <HomePageCharts>
        <HomePageChartsLabel>Influencers</HomePageChartsLabel>
        <HomePageChartsGrid>
          <CardWrapper>
            <CardWithChart
              title="Instagram"
              icon={<InstagramIcon />}
              smallIcon={<UserIcon />}
              percent={
                getInstagramInfluencers?.changePercentageMonth ||
                Number(0).toFixed(2)
              }
              count={
                getInstagramInfluencers?.data
                  ? getInstagramInfluencers?.data[
                      getInstagramInfluencers.data.length - 1
                    ].value
                  : 0
              }
              chartData={{
                values:
                  getInstagramInfluencers?.data &&
                  getInstagramInfluencers.data.map(
                    (element: any) => element.value
                  ),
                labels:
                  getInstagramInfluencers?.data &&
                  getInstagramInfluencers?.data.map(
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
                getInstagramInfluencers?.changePercentageMonth ||
                Number(0).toFixed(2)
              }
              count={
                getInstagramInfluencers?.data
                  ? getInstagramInfluencers?.data[
                      getInstagramInfluencers.data.length - 1
                    ].value
                  : 0
              }
              chartData={{
                values:
                  getInstagramInfluencers?.data &&
                  getInstagramInfluencers.data.map(
                    (element: any) => element.value
                  ),
                labels:
                  getInstagramInfluencers?.data &&
                  getInstagramInfluencers?.data.map(
                    (element: any) => element.value
                  ),
              }}
            />
          </CardWrapper>
        </HomePageChartsGrid>
      </HomePageCharts>
      <HomePageCharts>
        <HomePageChartsLabel>Clients</HomePageChartsLabel>
        <HomePageChartsGrid>
          <CardWrapper>
            <CardWithChart
              title="Biotech"
              icon={<IdentifiedIcon />}
              percent={
                clientsOverTime1?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                clientsOverTime1?.data
                  ? clientsOverTime1?.data[clientsOverTime1.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  clientsOverTime1?.data &&
                  clientsOverTime1.data.map((element: any) => element.value),
                labels:
                  clientsOverTime1?.data &&
                  clientsOverTime1?.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Healthtech"
              icon={<ContactedIcon />}
              percent={
                clientsOverTime2?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                clientsOverTime2?.data
                  ? clientsOverTime2?.data[clientsOverTime2.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  clientsOverTime2?.data &&
                  clientsOverTime2.data.map((element: any) => element.value),
                labels:
                  clientsOverTime2?.data &&
                  clientsOverTime2?.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Medtech"
              icon={<RegisteredIcon />}
              percent={
                clientsOverTime3?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                clientsOverTime3?.data
                  ? clientsOverTime3?.data[clientsOverTime3.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  clientsOverTime3?.data &&
                  clientsOverTime3.data.map((element: any) => element.value),
                labels:
                  clientsOverTime3?.data &&
                  clientsOverTime3?.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Hospitals"
              icon={<HospitalIcon />}
              percent={
                clientsOverTime4?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                clientsOverTime4?.data
                  ? clientsOverTime4?.data[clientsOverTime4.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  clientsOverTime4?.data &&
                  clientsOverTime4.data.map((element: any) => element.value),
                labels:
                  clientsOverTime4?.data &&
                  clientsOverTime4?.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
        </HomePageChartsGrid>
      </HomePageCharts>
      <HomePageCharts>
        <HomePageChartsLabel>Campaigns</HomePageChartsLabel>
        <HomePageChartsGrid>
          <CardWrapper>
            <CardWithChart
              title="In Preparation"
              icon={<InpreparationIcon />}
              smallIcon={<CampaignsSmallIcon />}
              percent={
                campaignsOverTime1?.changePercentageMonth ||
                Number(0).toFixed(2)
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
                campaignsOverTime2?.changePercentageMonth ||
                Number(0).toFixed(2)
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
                campaignsOverTime3?.changePercentageMonth ||
                Number(0).toFixed(2)
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
          <CardWrapper>
            <CardWithChart
              title="Revenue"
              icon={<RevenueIcon />}
              smallIcon={<CampaignsSmallIcon />}
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
        </HomePageChartsGrid>
      </HomePageCharts>
      {/* <HomePageCharts>
        <HomePageChartsLabel>Reports</HomePageChartsLabel>
        <HomePageChartsGrid>
          <CardWrapper>
            <CardWithChart
              title="Ordered"
              icon={<OrderedIcon />}
              smallIcon={<ReportsSmallIcon />}
              percent={reportsOverTime1?.changePercentageMonth?.toFixed(2) || 0}
              count={
                reportsOverTime1?.data
                  ? reportsOverTime1?.data[reportsOverTime1.data.length - 1]
                      .value
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
              percent={reportsOverTime2?.changePercentageMonth?.toFixed(2) || 0}
              count={
                reportsOverTime2?.data
                  ? reportsOverTime2?.data[reportsOverTime2.data.length - 1]
                      .value
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
              percent={reportsOverTime3?.changePercentageMonth?.toFixed(2) || 0}
              count={
                reportsOverTime3?.data
                  ? reportsOverTime3?.data[reportsOverTime3.data.length - 1]
                      .value
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
              percent={reportsOverTime4?.changePercentageMonth?.toFixed(2) || 0}
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
        </HomePageChartsGrid>
      </HomePageCharts>
      <HomePageCharts>
        <HomePageChartsLabel>Social Media Listening</HomePageChartsLabel>
        <HomePageChartsGrid>
          <CardWrapper>
            <CardWithChart
              title="Ordered"
              icon={<OrderedIcon />}
              smallIcon={<SMLSmallIcon />}
              percent={getSmlData1?.changePercentageMonth?.toFixed(2) || 0}
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
              percent={getSmlData2?.changePercentageMonth?.toFixed(2) || 0}
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
              percent={getSmlData3?.changePercentageMonth?.toFixed(2) || 0}
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
              percent={getSmlData4?.changePercentageMonth?.toFixed(2) || 0}
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
        </HomePageChartsGrid>
      </HomePageCharts> */}
      <HomePageCharts>
        <HomePageChartsLabel>Surveys</HomePageChartsLabel>
        <HomePageChartsGrid>
          <CardWrapper>
            <CardWithChart
              title="In Preparation"
              icon={<InpreparationIcon />}
              smallIcon={<SurveysSmallIcon />}
              percent={
                surveysOverTime1?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                surveysOverTime1?.data
                  ? surveysOverTime1?.data[surveysOverTime1.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  surveysOverTime1.data &&
                  surveysOverTime1.data.map((element: any) => element.value),
                labels:
                  surveysOverTime1.data &&
                  surveysOverTime1.data.map((element: any) => element.value),
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
                  ? surveysOverTime2?.data[surveysOverTime2.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  surveysOverTime2.data &&
                  surveysOverTime2.data.map((element: any) => element.value),
                labels:
                  surveysOverTime2.data &&
                  surveysOverTime2.data.map((element: any) => element.value),
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
                  ? surveysOverTime3?.data[surveysOverTime3.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  surveysOverTime3.data &&
                  surveysOverTime3.data.map((element: any) => element.value),
                labels:
                  surveysOverTime3.data &&
                  surveysOverTime3.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Revenue"
              icon={<RevenueIcon />}
              smallIcon={<SurveysSmallIcon />}
              percent={
                surveysOverTime4.changePercentageMonth || Number(0).toFixed(2)
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
        </HomePageChartsGrid>
      </HomePageCharts>
      <HomePageCharts>
        <HomePageChartsLabel>Finance</HomePageChartsLabel>
        <HomePageChartsGrid>
          <CardWrapper>
            <CardWithChart
              title="Revenue"
              icon={<RevenueIcon />}
              smallIcon={<FinanceSmallIcon />}
              percent={
                financeOverTime1?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                financeOverTime1?.data
                  ? financeOverTime1?.data[financeOverTime1.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  financeOverTime1?.data &&
                  financeOverTime1?.data.map((element: any) => element.value),
                labels:
                  financeOverTime1?.data &&
                  financeOverTime1?.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Cost"
              icon={<CostIcon />}
              smallIcon={<FinanceSmallIcon />}
              percent={
                financeOverTime2?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                financeOverTime2?.data
                  ? financeOverTime2?.data[financeOverTime2.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  financeOverTime2?.data &&
                  financeOverTime2?.data.map((element: any) => element.value),
                labels:
                  financeOverTime2?.data &&
                  financeOverTime2?.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Profit"
              icon={<ProfitIcon />}
              smallIcon={<FinanceSmallIcon />}
              percent={
                financeOverTime3?.changePercentage || Number(0).toFixed(2)
              }
              count={
                financeOverTime3?.data
                  ? financeOverTime3?.data[financeOverTime3.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  financeOverTime3?.data &&
                  financeOverTime3?.data.map((element: any) => element.value),
                labels:
                  financeOverTime3?.data &&
                  financeOverTime3?.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Margin"
              icon={<MarginIcon />}
              smallIcon={<FinanceSmallIcon />}
              percent={
                financeOverTime4?.changePercentage || Number(0).toFixed(2)
              }
              count={
                financeOverTime4?.data
                  ? financeOverTime4?.data[financeOverTime4.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  financeOverTime4?.data &&
                  financeOverTime4?.data.map((element: any) => element.value),
                labels:
                  financeOverTime4?.data &&
                  financeOverTime4?.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
        </HomePageChartsGrid>
      </HomePageCharts>

      {/* <HomePageCharts>
        <HomePageChartsLabel>Benefits</HomePageChartsLabel>
        <HomePageChartsGrid>
          <BenefitCardWrapper>
            <CardWithChartBenefits
              title="Accessories"
              icon={<AccesoriesIcon />}
              percent={
                benefitsOverTime1?.changePercentageMonth?.toFixed(2) || 0
              }
              count={
                benefitsOverTime1?.data
                  ? benefitsOverTime1?.data[benefitsOverTime1.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  benefitsOverTime1?.data &&
                  benefitsOverTime1?.data.map((element: any) => element.value),
                labels:
                  benefitsOverTime1?.data &&
                  benefitsOverTime1?.data.map((element: any) => element.value),
              }}
            />
          </BenefitCardWrapper>
          <BenefitCardWrapper>
            <CardWithChartBenefits
              title="Apparel & Footwear"
              icon={<ApparelIcon />}
              percent={
                benefitsOverTime2?.changePercentageMonth?.toFixed(2) || 0
              }
              count={
                benefitsOverTime2?.data
                  ? benefitsOverTime2?.data[benefitsOverTime2.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  benefitsOverTime2?.data &&
                  benefitsOverTime2?.data.map((element: any) => element.value),
                labels:
                  benefitsOverTime2?.data &&
                  benefitsOverTime2?.data.map((element: any) => element.value),
              }}
            />
          </BenefitCardWrapper>
          <BenefitCardWrapper>
            <CardWithChartBenefits
              title="Beauty & Personal Care"
              icon={<BeautyIcon />}
              percent={
                benefitsOverTime3?.changePercentageMonth?.toFixed(2) || 0
              }
              count={
                benefitsOverTime3?.data
                  ? benefitsOverTime3?.data[benefitsOverTime3.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  benefitsOverTime3?.data &&
                  benefitsOverTime3?.data.map((element: any) => element.value),
                labels:
                  benefitsOverTime3?.data &&
                  benefitsOverTime3?.data.map((element: any) => element.value),
              }}
            />
          </BenefitCardWrapper>
          <BenefitCardWrapper>
            <CardWithChartBenefits
              title="Electronics"
              icon={<ElectronicsIcon />}
              percent={
                benefitsOverTime4?.changePercentageMonth?.toFixed(2) || 0
              }
              count={
                benefitsOverTime4?.data
                  ? benefitsOverTime4?.data[benefitsOverTime4.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  benefitsOverTime4?.data &&
                  benefitsOverTime4?.data.map((element: any) => element.value),
                labels:
                  benefitsOverTime4?.data &&
                  benefitsOverTime4?.data.map((element: any) => element.value),
              }}
            />
          </BenefitCardWrapper>
          <BenefitCardWrapper>
            <CardWithChartBenefits
              title="Food & Beverage"
              icon={<FoodIcon />}
              percent={
                benefitsOverTime5?.changePercentageMonth?.toFixed(2) || 0
              }
              count={
                benefitsOverTime5?.data
                  ? benefitsOverTime5?.data[benefitsOverTime5.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  benefitsOverTime5?.data &&
                  benefitsOverTime5?.data.map((element: any) => element.value),
                labels:
                  benefitsOverTime5?.data &&
                  benefitsOverTime5?.data.map((element: any) => element.value),
              }}
            />
          </BenefitCardWrapper>
          <BenefitCardWrapper>
            <CardWithChartBenefits
              title="Furniture"
              icon={<FurnitureIcon />}
              percent={
                benefitsOverTime6?.changePercentageMonth?.toFixed(2) || 0
              }
              count={
                benefitsOverTime6?.data
                  ? benefitsOverTime6?.data[benefitsOverTime6.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  benefitsOverTime6?.data &&
                  benefitsOverTime6?.data.map((element: any) => element.value),
                labels:
                  benefitsOverTime6?.data &&
                  benefitsOverTime6?.data.map((element: any) => element.value),
              }}
            />
          </BenefitCardWrapper>
          <BenefitCardWrapper>
            <CardWithChartBenefits
              title="Health & Wellness"
              icon={<HealthIcon />}
              percent={
                benefitsOverTime7?.changePercentageMonth?.toFixed(2) || 0
              }
              count={
                benefitsOverTime7?.data
                  ? benefitsOverTime7?.data[benefitsOverTime7.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  benefitsOverTime7?.data &&
                  benefitsOverTime7?.data.map((element: any) => element.value),
                labels:
                  benefitsOverTime7?.data &&
                  benefitsOverTime7?.data.map((element: any) => element.value),
              }}
            />
          </BenefitCardWrapper>
          <BenefitCardWrapper>
            <CardWithChartBenefits
              title="Leasure"
              icon={<LeisureIcon />}
              percent={
                benefitsOverTime8?.changePercentageMonth?.toFixed(2) || 0
              }
              count={
                benefitsOverTime8?.data
                  ? benefitsOverTime8?.data[benefitsOverTime8.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  benefitsOverTime8?.data &&
                  benefitsOverTime8?.data.map((element: any) => element.value),
                labels:
                  benefitsOverTime8?.data &&
                  benefitsOverTime8?.data.map((element: any) => element.value),
              }}
            />
          </BenefitCardWrapper>
          <BenefitCardWrapper>
            <CardWithChartBenefits
              title="Nutrition"
              icon={<NutritionIcon />}
              percent={
                benefitsOverTime9?.changePercentageMonth?.toFixed(2) || 0
              }
              count={
                benefitsOverTime9?.data
                  ? benefitsOverTime9?.data[benefitsOverTime9.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  benefitsOverTime9?.data &&
                  benefitsOverTime9?.data.map((element: any) => element.value),
                labels:
                  benefitsOverTime9?.data &&
                  benefitsOverTime9?.data.map((element: any) => element.value),
              }}
            />
          </BenefitCardWrapper>
          <BenefitCardWrapper>
            <CardWithChartBenefits
              title="Pet Care"
              icon={<PetCareIcon />}
              percent={
                benefitsOverTime10?.changePercentageMonth?.toFixed(2) || 0
              }
              count={
                benefitsOverTime10?.data
                  ? benefitsOverTime10?.data[benefitsOverTime10.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  benefitsOverTime10?.data &&
                  benefitsOverTime10?.data.map((element: any) => element.value),
                labels:
                  benefitsOverTime10?.data &&
                  benefitsOverTime10?.data.map((element: any) => element.value),
              }}
            />
          </BenefitCardWrapper>
          <BenefitCardWrapper>
            <CardWithChartBenefits
              title="Services"
              icon={<ServicesBIcon />}
              percent={
                benefitsOverTime11?.changePercentageMonth?.toFixed(2) || 0
              }
              count={
                benefitsOverTime11?.data
                  ? benefitsOverTime11?.data[benefitsOverTime11.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  benefitsOverTime11?.data &&
                  benefitsOverTime11?.data.map((element: any) => element.value),
                labels:
                  benefitsOverTime11?.data &&
                  benefitsOverTime11?.data.map((element: any) => element.value),
              }}
            />
          </BenefitCardWrapper>
          <BenefitCardWrapper>
            <CardWithChartBenefits
              title="Travel"
              icon={<TravelIcon />}
              percent={
                benefitsOverTime12?.changePercentageMonth?.toFixed(2) || 0
              }
              count={
                benefitsOverTime12?.data
                  ? benefitsOverTime12?.data[benefitsOverTime12.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  benefitsOverTime12?.data &&
                  benefitsOverTime12?.data.map((element: any) => element.value),
                labels:
                  benefitsOverTime12?.data &&
                  benefitsOverTime12?.data.map((element: any) => element.value),
              }}
            />
          </BenefitCardWrapper>
        </HomePageChartsGrid>
      </HomePageCharts> */}
    </HomePageMain>
  );
};

export default HomePage;
