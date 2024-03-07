import { differenceInDays, differenceInMonths } from 'date-fns';
import { GraphPeriod } from '../enums/graph-period.enum';

export function getMostFittedInterval(oldestDataDate: Date) {
  const currentDate = new Date();

  if (differenceInMonths(currentDate, oldestDataDate) <= 28) {
    return GraphPeriod.Daily;
  } else if (differenceInDays(currentDate, oldestDataDate) > 28) {
    return GraphPeriod.Weekly;
  } else if (differenceInMonths(currentDate, oldestDataDate) > 3) {
    return GraphPeriod.Monthly;
  } else if (differenceInMonths(currentDate, oldestDataDate) > 12) {
    return GraphPeriod.Yearly;
  }
}
