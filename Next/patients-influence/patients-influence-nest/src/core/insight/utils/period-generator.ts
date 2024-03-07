import { Logger } from '@nestjs/common';
import { GraphPeriod } from '../enums/graph-period.enum';
import { IPeriodUtilOptions } from '../interfaces/period-util-options.interface';
import { calculateDaysAgo } from './time-interval';
import {
  addDays,
  addHours,
  differenceInDays,
  differenceInHours,
  endOfDay,
  startOfDay,
} from 'date-fns';
import { convertToMilliseconds } from 'src/utils';

export function getYearlyNPeriods(
  numYears: number,
  options: IPeriodUtilOptions = {
    includeOngoingPeriod: false,
    roundDateToDay: false,
    roundDateToMonth: false,
  },
): { dateFrom: Date; dateTo: Date }[] {
  const periods: { dateFrom: Date; dateTo: Date }[] = [];
  const today = new Date();

  for (let i = 0; i < numYears; i++) {
    const yearStart = new Date(today.getFullYear() - i, 0, 1, 0, 0, 0, 0);
    const yearEnd = new Date(today.getFullYear() - i, 11, 31, 23, 59, 59, 999);

    if (options.includeOngoingPeriod) {
      // Include the ongoing year
      periods.push({
        dateFrom: yearStart,
        dateTo: new Date(),
      });
    }

    periods.push({
      dateFrom: yearStart,
      dateTo: yearEnd,
    });
  }

  return periods;
}

export function getLast12MonthsPeriods(
  options: IPeriodUtilOptions = {
    includeOngoingPeriod: false,
    roundDateToDay: false,
    roundDateToMonth: false,
  },
): { dateFrom: Date; dateTo: Date }[] {
  const periods: { dateFrom: Date; dateTo: Date }[] = [];
  const today = new Date();

  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(
      today.getFullYear(),
      today.getMonth() - i,
      1,
      0,
      0,
      0,
      0,
    );
    const monthEnd = new Date(
      today.getFullYear(),
      today.getMonth() - i + 1,
      0,
      23,
      59,
      59,
      999,
    );

    if (options.includeOngoingPeriod && i === 0) {
      // Include the ongoing month
      periods.push({
        dateFrom: monthStart,
        dateTo: new Date(),
      });
    }

    periods.push({
      dateFrom: monthStart,
      dateTo: monthEnd,
    });
  }

  return periods;
}

export function getPeriods(
  graphPeriod: GraphPeriod,
  dateTo = new Date(),
  options: IPeriodUtilOptions = {
    includeOngoingPeriod: false,
    roundDateToDay: false,
    roundDateToMonth: false,
  },
  logger?: Logger,
) {
  const periods: { dateFrom: Date; dateTo: Date }[] = [];
  const dateToCopy = new Date(dateTo);
  if (options.includeOngoingPeriod) {
    if (graphPeriod === GraphPeriod.Daily) {
      dateToCopy.setDate(dateToCopy.getDate() + 1);
    } else if (graphPeriod == GraphPeriod.Weekly) {
      dateToCopy.setDate(dateToCopy.getDate() + 7);
    } else if (graphPeriod == GraphPeriod.Monthly) {
      dateToCopy.setMonth(dateToCopy.getMonth() + 1);
    } else if (graphPeriod == GraphPeriod.Yearly) {
      dateToCopy.setFullYear(dateToCopy.getFullYear() + 1);
    }
  }
  if (options.roundDateToDay) {
    dateToCopy.setHours(0, 0, 0, 0);
  }
  if (options.roundDateToMonth) {
    if (options.includeOngoingPeriod) {
      dateToCopy.setMonth(dateToCopy.getMonth() + 1);
    }
    dateToCopy.setDate(1);
    dateToCopy.setHours(0, 0, 0, 0);
  }
  const dateFrom = new Date(dateToCopy);
  const dateToFinal = new Date(dateToCopy);
  // * the line below decides if dateTo has to satisfy lt or lte prisma query
  dateToCopy.setMilliseconds(dateToCopy.getMilliseconds() - 1);

  let periodsInPast: number;
  let periodLength: number;
  let dateFromFirst: Date;
  let iteration = 0;

  switch (graphPeriod) {
    case GraphPeriod.Daily:
      // const dateToFinalTemp = new Date(dateToFinal);
      // ! periodsInPast = 30; // 30 days max
      periodsInPast = calculateDaysAgo(dateToCopy, '1M');
      periodLength = 1; // 1-day period
      // periodsInPast = (dateToFinalTemp.getTime() - (dateToFinalTemp.setMonth(dateToFinalTemp.getMonth() - 1)));
      dateFromFirst = new Date(
        dateToFinal.getTime() - periodsInPast * convertToMilliseconds('1d'),
      );

      break;
    case GraphPeriod.Weekly:
      // * each month has ~4 weeks or ~30 days, so we go approx. 3 months in the past, not exactly
      // 3 * 30 || 3 * 4 * 7;
      // ! periodsInPast = 3 * 30; // 90 days max
      // ! OLD periodsInPast = calculateDaysAgo(dateToCopy, '3M');
      periodsInPast = calculateDaysAgo(dateToCopy, '12w'); // 12w ~ 3M
      periodLength = 7; // 7-day period
      dateFromFirst = new Date(
        dateToFinal.getTime() - periodsInPast * convertToMilliseconds('1d'),
      );

      break;
    case GraphPeriod.Monthly:
      // ! periodsInPast = 365; // 365 days or 1 year max
      periodsInPast = calculateDaysAgo(dateToCopy, '1Y');
      periodLength = 30; // 30-day or 1-month period
      dateFromFirst = new Date(
        dateToFinal.getTime() - periodsInPast * convertToMilliseconds('1d'),
      );

      const wantedMonths = getLast12MonthsPeriods({
        includeOngoingPeriod: false,
        roundDateToDay: false,
        roundDateToMonth: false,
      });

      return wantedMonths.sort(
        (a, b) => a.dateFrom.getTime() - b.dateFrom.getTime(),
      );

    case GraphPeriod.Yearly:
      const yearlyPeriods = getYearlyNPeriods(6, {
        includeOngoingPeriod: false,
        roundDateToDay: false,
        roundDateToMonth: false,
      });

      // console.log('Yearly Periods:', yearlyPeriods);
      return yearlyPeriods.sort(
        (a, b) => a.dateFrom.getTime() - b.dateFrom.getTime(),
      );
    // // ! periodsInPast = 6 * 365; // 6 years max
    // periodsInPast = calculateDaysAgo(dateToCopy, '6Y');
    // periodLength = 365; // 1-year period
    // dateFromFirst = new Date(
    //   dateToFinal.getTime() - periodsInPast * convertToMilliseconds('1d'),
    // );

    // console.log(dateFromFirst, periodsInPast);
    // break;
    default:
      break;
  }

  while (
    dateFrom > dateFromFirst &&
    ((options.numOfLastPeriods !== undefined &&
      iteration !== options.numOfLastPeriods) ||
      options.numOfLastPeriods === undefined)
  ) {
    dateFrom.setDate(dateFrom.getDate() - periodLength);
    periods.push({
      // ! it is important to initialize a new Date object
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateToCopy),
    });
    (logger ?? console).debug(
      JSON.stringify({
        iteration: ++iteration,
        dateFrom: dateFrom.toLocaleString('hr'),
        dateTo: dateToCopy.toLocaleString('hr'),
      }),
    );
    dateToCopy.setDate(dateToCopy.getDate() - periodLength);
  }

  const periodsSorted = periods.sort(
    (a, b) => a.dateFrom.getTime() - b.dateFrom.getTime(),
  );

  return periodsSorted;
}

export function getNPeriods(
  filterFromDate: Date,
  filterToDate: Date,
  oldestData: Date,
  newestData: Date,
  N: number,
) {
  if (oldestData === null && newestData === null) {
    return [];
  }
  // OLD:
  /* if (!filterFromDate && !filterToDate && !oldestData && !newestData) {
    throw new Error('At least one date must be defined');
  } */

  // const fromDate = filterFromDate || oldestData || new Date(); // default to current date if no date is provided
  // const toDate = filterToDate || newestData || new Date(); // default to current date if no date is provided
  const fromDate = filterFromDate || oldestData || new Date();
  const toDate = filterToDate || new Date();

  const totalDays = differenceInDays(toDate, fromDate);
  const totalHours = differenceInHours(toDate, fromDate);

  const dates: { dateFrom: Date; dateTo: Date }[] = [];

  if (totalHours < 24) {
    // use hours if the total difference is less than 24 hours
    let step = Math.floor(totalHours / (N - 1));

    if (step < 1) {
      N = totalHours + 1; // limit the number of data points to the available hours
      step = 1;
    }

    for (let i = 0; i < N; i++) {
      const dateStart = addHours(fromDate, i * step);
      let dateEnd: Date;

      if (i < N - 1) {
        dateEnd = addHours(fromDate, (i + 1) * step);
        dateEnd.setMilliseconds(dateEnd.getMilliseconds() - 1);
      } else {
        dateEnd = toDate;
      }

      dates.push({
        // ! it is important to initialize a new Date object
        dateFrom: new Date(dateStart),
        dateTo: new Date(dateEnd),
      });
    }
  } else {
    // use days if the total difference is 24 hours or more
    let step = Math.floor(totalDays / (N - 1));

    if (step < 1) {
      N = totalDays + 1; // limit the number of data points to the available days
      step = 1;
    }

    for (let i = 0; i < N; i++) {
      const dateStart = addDays(fromDate, i * step);
      let dateEnd: Date;

      if (i < N - 1) {
        dateEnd = addDays(fromDate, (i + 1) * step);
        dateEnd.setMilliseconds(dateEnd.getMilliseconds() - 1);
      } else {
        dateEnd = toDate;
      }

      dates.push({
        // ! it is important to initialize a new Date object
        dateFrom: new Date(dateStart),
        dateTo: new Date(dateEnd),
      });
    }
  }

  return dates;
}
