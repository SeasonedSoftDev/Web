import React from 'react';

export type TCalendarControlsProps = React.HTMLAttributes<HTMLDivElement> & {
  date: Date;
  onBack?: (v: Date) => void;
  onForward?: (v: Date) => void;
};
