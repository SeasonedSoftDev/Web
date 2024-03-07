import React from 'react';

export type TCalendarDate = {
  currentMonth: boolean;
  date: Date;
  today: boolean;
};

export type TCalendarCardProps = React.HTMLAttributes<HTMLDivElement> & {};
