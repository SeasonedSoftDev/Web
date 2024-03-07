import React from 'react';
import { TDayScaleCellProps } from 'components/custom/calendar-card/elements/day-scale-cell/types';
import { SDayScaleCellMain } from 'components/custom/calendar-card/elements/day-scale-cell/styles';

const DayScaleCell = ({ startDate, today, ...props }: TDayScaleCellProps) => (
  <SDayScaleCellMain startDate={startDate} today={today} {...props} />
);

export default DayScaleCell;
