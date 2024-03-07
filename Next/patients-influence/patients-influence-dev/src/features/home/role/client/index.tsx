import React, { useEffect, useState } from 'react';
import {
  HomePageMain,
  HomePageCharts,
  HomePageChartsLabel,
  HomePageChartsGrid,
} from 'features/home/styles';
import { CardWithChart } from 'components/custom';
import {
  CampaignsSmallIcon,
  FinishedIcon,
  InpreparationIcon,
  OngoingIcon,
  OrderedIcon,
  ReportsSmallIcon,
  SMLSmallIcon,
  SurveysSmallIcon,
  TotalIcon,
  WithoutReportIcon,
} from 'components/svg';
import SubscriptionIcon from 'components/svg/subscriptions';
import { useAppContext } from 'context';
import GraphsAPI from 'api/graphs';
import { useSnackbar } from 'hooks';
import { SMLApi } from 'api';
import { fetchAndCacheData } from 'utilities/local-storage';
import { CardWrapper } from './styles';

const HomePage = () => {
  const { user } = useAppContext();
  const { push } = useSnackbar();

  // Campaigns
  const [campaignsOverTime1, setCampaignsOverTime1] = useState<any>([]);
  const [campaignsOverTime2, setCampaignsOverTime2] = useState<any>([]);
  const [campaignsOverTime3, setCampaignsOverTime3] = useState<any>([]);
  const [campaignsOverTime4, setCampaignsOverTime4] = useState<any>([]);

  // Reports
  const [reportsOverTime1, setReportsOverTime1] = useState<any>([]);
  const [reportsOverTime2, setReportsOverTime2] = useState<any>([]);
  const [reportsOverTime3, setReportsOverTime3] = useState<any>([]);
  const [reportsOverTime4, setReportsOverTime4] = useState<any>([]);

  // SMLs
  const [smlOvertime1, setSmlOverTime1] = useState<any>([]);
  const [smlOvertime2, setSmlOverTime2] = useState<any>([]);
  const [smlOvertime3, setSmlOverTime3] = useState<any>([]);
  const [smlOvertime4, setSmlOverTime4] = useState<any>([]);

  // Surveys
  const [surveysOverTime1, setSurveysOverTime1] = useState<any>([]);
  const [surveysOverTime2, setSurveysOverTime2] = useState<any>([]);
  const [surveysOverTime3, setSurveysOverTime3] = useState<any>([]);
  const [surveysOverTime4, setSurveysOverTime4] = useState<any>([]);

  // eslint-disable-next-line consistent-return
  const getGraphData = async (queryParams: any) => {
    try {
      const response = await GraphsAPI.getGraphs(user.id, { ...queryParams });

      if (response.data) {
        return response;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.error(error);
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
          getGraphData({
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

  // eslint-disable-next-line consistent-return
  const getClientProductsInfluencersOverTimeData = async (queryParams: any) => {
    try {
      const response = await GraphsAPI.getClientProductsInfluencersOverTimeData(
        user.id,
        { ...queryParams }
      );

      if (response.data) {
        return response;
      }

      throw new Error('Error: Failed to fetch data!');
    } catch (error) {
      console.error(error);
    }
  };

  const getClientProductsInfluencersGraphDataAsync =
    (
      product: number,
      setDataFunction: (data: any) => void,
      key: string,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getClientProductsInfluencersOverTimeData({
            product,
            startFromUserRegistration: true,
            statusAtPointOfTime: true,
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
      0,
      0,
      setCampaignsOverTime1,
      'setCampaignsOverTime1'
    )();
    getClientGraphDataAsync(
      0,
      1,
      setCampaignsOverTime2,
      'setCampaignsOverTime2'
    )();
    getClientGraphDataAsync(
      0,
      2,
      setCampaignsOverTime3,
      'setCampaignsOverTime3'
    )();
    getClientProductsInfluencersGraphDataAsync(
      0,
      setCampaignsOverTime4,
      'setCampaignsOverTime4'
    )();
    getClientGraphDataAsync(
      3,
      undefined,
      setReportsOverTime1,
      'setReportsOverTime1'
    )();
    getClientGraphDataAsync(3, 4, setReportsOverTime2, 'setReportsOverTime2')();
    getClientGraphDataAsync(3, 5, setReportsOverTime3, 'setReportsOverTime3')();
    getClientGraphDataAsync(3, 6, setReportsOverTime4, 'setReportsOverTime4')();
    getClientGraphDataAsync(2, 4, setSmlOverTime2, 'setSmlOverTime2')();
    getClientGraphDataAsync(2, 5, setSmlOverTime3, 'setSmlOverTime3')();
    getClientGraphDataAsync(2, 6, setSmlOverTime4, 'setSmlOverTime4')();
    getClientGraphDataAsync(1, 0, setSurveysOverTime1, 'setSurveysOverTime1')();
    getClientGraphDataAsync(1, 1, setSurveysOverTime2, 'setSurveysOverTime2')();
    getClientGraphDataAsync(1, 2, setSurveysOverTime3, 'setSurveysOverTime3')();
    getClientProductsInfluencersGraphDataAsync(
      1,
      setSurveysOverTime4,
      'setSurveysOverTime4'
    )();
  }, []);

  const getAllSmlGraphData = async (queryParams: any): Promise<any> => {
    try {
      const response = await GraphsAPI.getClientRecommendedOverTimeData(
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

  const getAllSmlGraphDataAsync =
    (
      setDataFunction: (data: any) => void,
      key: string,
      forceUpdate: boolean = false
    ) =>
    async () => {
      const result = await fetchAndCacheData(
        () =>
          getAllSmlGraphData({
            startFromUserRegistration: true,
            statusAtPointOfTime: true,
            numberOfPoints: 30,
            useStrictPeriod: false,
            graphType: 'cumulative',
            includeData: ['changePercentageMonth'],
          }),
        key,
        forceUpdate
      );

      setDataFunction(result);
    };

  useEffect(() => {
    getAllSmlGraphDataAsync(setSmlOverTime1, 'setSmlOverTime1')();
  }, [user?.id]);

  return (
    <HomePageMain>
      <HomePageCharts>
        <HomePageChartsLabel>Campaigns </HomePageChartsLabel>
        <HomePageChartsGrid>
          <CardWrapper>
            <CardWithChart
              title="In preparation"
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
              title="Influencers"
              icon={<TotalIcon />}
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
      <HomePageCharts>
        <HomePageChartsLabel>Reports </HomePageChartsLabel>
        <HomePageChartsGrid>
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
              title="Ordered"
              icon={<OrderedIcon />}
              smallIcon={<ReportsSmallIcon />}
              percent={
                reportsOverTime2?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                reportsOverTime2?.data
                  ? reportsOverTime2?.data[reportsOverTime2.data.length - 1]
                      .value
                  : 0
              }
              chartData={{
                values:
                  reportsOverTime2?.data &&
                  reportsOverTime2?.data.map((element: any) => element.value),
                labels:
                  reportsOverTime2?.data &&
                  reportsOverTime2?.data.map((element: any) => element.value),
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
              title="Delivered"
              icon={<FinishedIcon />}
              smallIcon={<ReportsSmallIcon />}
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
        </HomePageChartsGrid>
      </HomePageCharts>
      <HomePageCharts>
        <HomePageChartsLabel>Social Media Listening </HomePageChartsLabel>
        <HomePageChartsGrid>
          <CardWrapper>
            <CardWithChart
              title="Recommended"
              icon={<OrderedIcon />}
              smallIcon={<SMLSmallIcon />}
              percent={
                smlOvertime1?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                smlOvertime1?.data
                  ? smlOvertime1?.data[smlOvertime1.data.length - 1].value
                  : 0
              }
              chartData={{
                values:
                  smlOvertime1.data &&
                  smlOvertime1.data.map((element: any) => element.value),
                labels:
                  smlOvertime1.data &&
                  smlOvertime1.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Ordered"
              icon={<OrderedIcon />}
              smallIcon={<SMLSmallIcon />}
              percent={
                smlOvertime2?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                smlOvertime2?.data
                  ? smlOvertime2?.data[smlOvertime2.data.length - 1].value
                  : 0
              }
              chartData={{
                values:
                  smlOvertime2.data &&
                  smlOvertime2.data.map((element: any) => element.value),
                labels:
                  smlOvertime2.data &&
                  smlOvertime2.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Ongoing"
              icon={<OngoingIcon />}
              smallIcon={<SMLSmallIcon />}
              percent={
                smlOvertime3?.changePercentageMonth || Number(0).toFixed(2)
              }
              count={
                smlOvertime3?.data
                  ? smlOvertime3?.data[smlOvertime3.data.length - 1].value
                  : 0
              }
              chartData={{
                values:
                  smlOvertime3.data &&
                  smlOvertime3.data.map((element: any) => element.value),
                labels:
                  smlOvertime3.data &&
                  smlOvertime3.data.map((element: any) => element.value),
              }}
            />
          </CardWrapper>
          <CardWrapper>
            <CardWithChart
              title="Subscriptions"
              icon={<SubscriptionIcon />}
              smallIcon={<SMLSmallIcon />}
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
        </HomePageChartsGrid>
      </HomePageCharts>
      <HomePageCharts>
        <HomePageChartsLabel>Surveys </HomePageChartsLabel>
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
              title="Participants"
              icon={<TotalIcon />}
              smallIcon={<SurveysSmallIcon />}
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
        </HomePageChartsGrid>
      </HomePageCharts>
    </HomePageMain>
  );
};

export default HomePage;
