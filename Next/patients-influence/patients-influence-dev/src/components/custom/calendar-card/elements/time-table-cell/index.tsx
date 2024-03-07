import React from 'react';
import { TTimeTableCellProps } from 'components/custom/calendar-card/elements/time-table-cell/types';
import { STimeTableCellMain } from 'components/custom/calendar-card/elements/time-table-cell/styles';

const TimeTableCell = ({ ...props }: TTimeTableCellProps) => (
  <STimeTableCellMain {...props} />
);

export default TimeTableCell;
