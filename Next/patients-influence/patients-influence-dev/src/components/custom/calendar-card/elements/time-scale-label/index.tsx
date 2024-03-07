import React from 'react';
import { TTimeScaleLabelProps } from 'components/custom/calendar-card/elements/time-scale-label/types';
import { STimeScaleLabelMain } from 'components/custom/calendar-card/elements/time-scale-label/styles';
import moment from 'moment';

const TimeScaleLabel = ({ formatDate, ...props }: TTimeScaleLabelProps) => (
  <STimeScaleLabelMain
    formatDate={(date) => moment(date).format('h A')}
    {...props}
  />
);

export default TimeScaleLabel;
