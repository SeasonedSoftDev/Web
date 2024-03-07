import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
} from 'date-fns';

export const getLastIntervals = (date = new Date(), roundDateToDay = false) => {
  // dateCopy is given date or "now"
  const dateCopy = new Date(date);

  // * the line below sets "now" ("date") to "today" ("that day")
  if (roundDateToDay) dateCopy.setHours(0, 0, 0, 0);

  //#region last values of each interval
  const oneDayAgo = new Date(dateCopy);
  oneDayAgo.setHours(dateCopy.getHours() - 24);
  const oneWeekAgo = new Date(dateCopy);
  oneWeekAgo.setDate(dateCopy.getDate() - 24 * 7);
  const oneMonthAgo = new Date(dateCopy);
  oneMonthAgo.setMonth(dateCopy.getMonth() - 1);
  const oneYearAgo = new Date(dateCopy);
  oneYearAgo.setMonth(dateCopy.getFullYear() - 1);
  //#endregion

  //#region before-the-last values of each interval
  const twoDaysAgo = new Date(dateCopy);
  twoDaysAgo.setHours(dateCopy.getHours() - 24 * 2);
  const twoWeeksAgo = new Date(dateCopy);
  twoWeeksAgo.setDate(dateCopy.getDate() - 24 * 7 * 2);
  const twoMonthsAgo = new Date(dateCopy);
  twoMonthsAgo.setMonth(dateCopy.getMonth() - 2);
  const twoYearsAgo = new Date(dateCopy);
  twoYearsAgo.setMonth(dateCopy.getFullYear() - 2);
  //#endregion

  return {
    date: dateCopy,
    dateIsNow:
      // if difference in given time is less than 10ms
      Math.abs(new Date().getMilliseconds() - date.getMilliseconds()) <= 10
        ? true
        : false,
    dateIsRounded: roundDateToDay,
    oneDayAgo,
    oneWeekAgo,
    oneMonthAgo,
    oneYearAgo,
    twoDaysAgo,
    twoWeeksAgo,
    twoMonthsAgo,
    twoYearsAgo,
  };
};

/**
 * Supported time units:
 *  - d (days)
 *  - w (weeks)
 *  - M (months)
 *  - Y (years)
 *
 * @example
 * const days = calculateDaysAgo(new Date(), '1M');
 *
 * @param date current date or any other date
 * @param timeAgo string representation of time, like "1M"
 * @returns difference in days
 */
export const calculateDaysAgo = (date: Date, timeAgo: string) => {
  let dateAgo: Date;

  const number = parseInt(timeAgo.slice(0, -1), 10);
  const unit = timeAgo.slice(-1);

  switch (unit) {
    case 'd':
      dateAgo = addDays(date, -number);
      break;
    case 'w':
      dateAgo = addWeeks(date, -number);
      break;
    case 'M':
      dateAgo = addMonths(date, -number);
      break;
    case 'Y':
      dateAgo = addYears(date, -number);
      break;
    default:
      throw new Error(`Invalid time unit: ${unit}`);
  }

  return differenceInDays(date, dateAgo);
};
