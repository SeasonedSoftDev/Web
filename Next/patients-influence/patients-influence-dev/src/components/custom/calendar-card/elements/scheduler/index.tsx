import React from 'react';
import { Modal } from 'components/custom';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Appointments,
  AppointmentTooltip,
  // DateNavigator,
  // TodayButton,
  // Toolbar,
} from '@devexpress/dx-react-scheduler-material-ui';
import { Button } from 'components/ui';
import {
  SSchedulerMain,
  SSchedulerWeekView,
} from 'components/custom/calendar-card/elements/scheduler/styles';
import { TSchedulerProps } from 'components/custom/calendar-card/elements/scheduler/types';
import {
  DayScaleCell,
  TimeTableCell,
  TimeScaleLabel,
} from 'components/custom/calendar-card/elements';

const Scheduler = ({ date, onClose, ...props }: TSchedulerProps) => (
  <Modal
    title="Schedule"
    actions={[
      <Button
        onClick={onClose}
        color="primary"
        variant="contained"
        size="large"
      >
        Close
      </Button>,
    ]}
    size="large"
    onClose={onClose}
    {...props}
  >
    <SSchedulerMain data={[]} height={600}>
      <ViewState currentDate={date} />
      <SSchedulerWeekView
        startDayHour={5}
        endDayHour={22}
        dayScaleCellComponent={DayScaleCell}
        cellDuration={60}
        timeTableCellComponent={TimeTableCell}
        timeScaleLabelComponent={TimeScaleLabel}
      />
      {/* <Toolbar />
      <DateNavigator /> */}
      <Appointments />
      <AppointmentTooltip />
    </SSchedulerMain>
  </Modal>
);

export default Scheduler;
