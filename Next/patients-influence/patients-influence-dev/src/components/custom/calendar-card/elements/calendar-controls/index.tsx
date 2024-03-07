import React from 'react';
import {
  SCalendarControlsMain,
  SCalendarControlsButton,
  SCalendarControlsDisplay,
} from 'components/custom/calendar-card/elements/calendar-controls/styles';
import { TCalendarControlsProps } from 'components/custom/calendar-card/elements/calendar-controls/types';
import {
  ArrowBackIosNewRounded,
  ArrowForwardIosRounded,
} from '@mui/icons-material';
import moment from 'moment';

const CalendarControls = ({
  date,
  onBack,
  onForward,
  ...props
}: TCalendarControlsProps) => {
  const handleBack = () => {
    if (onBack) {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() - 1);
      onBack(newDate);
    }
  };

  const handleForward = () => {
    if (onForward) {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + 1);
      onForward(newDate);
    }
  };

  return (
    <SCalendarControlsMain {...props}>
      <SCalendarControlsButton
        variant="contained"
        color="primary"
        onClick={handleBack}
      >
        <ArrowBackIosNewRounded />
      </SCalendarControlsButton>
      <SCalendarControlsDisplay>
        {moment(date).format('MMM yyyy')}
      </SCalendarControlsDisplay>
      <SCalendarControlsButton
        variant="contained"
        color="primary"
        onClick={handleForward}
      >
        <ArrowForwardIosRounded />
      </SCalendarControlsButton>
    </SCalendarControlsMain>
  );
};

export default CalendarControls;
