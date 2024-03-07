import React, { FC, useEffect, useState } from 'react';
import {
  CalendarCardMain,
  CalendarCardGrid,
  CalendarCardCell,
  CalendarCardCellDate,
  CalendarCardDay,
  CalendarCardDays,
  CalendarReset,
  CalendarTitle,
} from 'components/custom/calendar-card/styles';
import {
  TCalendarCardProps,
  TCalendarDate,
} from 'components/custom/calendar-card/types';
import { getCalendarDates } from 'utilities/calendar';
import { format } from 'date-fns';
import { useModal } from 'hooks';
import {
  CalendarControls,
  Scheduler,
} from 'components/custom/calendar-card/elements';
import { RestartAlt } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { CampaignAPI } from 'api';
import moment from 'moment';

interface Props {
  x: TCalendarDate;
  date: Date;
  data: any[];
  handleClick: (x: TCalendarDate) => () => void;
}

const CustomPopover: FC<Props> = ({ x, date, handleClick, data }) => {
  const isHighlighted = x.date.toISOString() === date.toISOString();
  const currentDateData = data.filter((d) => {
    const dDate = moment(d.date).format('DD/MM/YYYY');
    const xDate = moment(x.date).format('DD/MM/YYYY');

    return dDate === xDate;
  });

  const mappedString = currentDateData.map(
    (d) =>
      `${d.platformProduct ? 'Survey' : 'Campaign'}: ${d.name} - ${d.type}s`
  );

  return (
    <CalendarCardCell
      key={date.getMilliseconds()}
      // eslint-disable-next-line react/no-array-index-key
      onClick={handleClick(x)}
      isHighlighted={isHighlighted}
      hasBlueDot={currentDateData && currentDateData.length > 0}
    >
      <Tooltip title={mappedString.join('; ')}>
        <CalendarCardCellDate currentMonth={x.currentMonth} today={x.today}>
          {format(x.date, 'd')}
        </CalendarCardCellDate>
      </Tooltip>
    </CalendarCardCell>
  );
};

const CalendarCard = ({ ...props }: TCalendarCardProps) => {
  const [scModal, scModalOpen, scModalClose] = useModal(false);
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);

  const getData = async () => {
    const res = await CampaignAPI.getAllCampaignsAndSurveysDates();

    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const days: TCalendarDate[] = getCalendarDates(date);

  const handleClick = (x: TCalendarDate) => () => {
    setDate(x.date);
    scModalOpen();
  };

  const handleDate = (v: Date) => {
    setDate(v);
  };

  const handleToday = () => {
    setDate(new Date());
  };

  return (
    <CalendarCardMain
      title={
        <CalendarTitle>
          Calendar
          <Tooltip title="Reset to today's date">
            <CalendarReset onClick={handleToday}>
              <RestartAlt />
            </CalendarReset>
          </Tooltip>
        </CalendarTitle>
      }
      actions={[
        <CalendarControls
          date={date}
          onBack={handleDate}
          onForward={handleDate}
        />,
      ]}
      {...props}
    >
      <CalendarCardDays columns={7}>
        <CalendarCardDay weekend>SUN</CalendarCardDay>
        <CalendarCardDay>MON</CalendarCardDay>
        <CalendarCardDay>TUE</CalendarCardDay>
        <CalendarCardDay>WED</CalendarCardDay>
        <CalendarCardDay>THU</CalendarCardDay>
        <CalendarCardDay>FRI</CalendarCardDay>
        <CalendarCardDay weekend>SAT</CalendarCardDay>
      </CalendarCardDays>
      <CalendarCardGrid columns={7}>
        {days.map((x, index) => {
          const day = x.date.getDate();
          const month = x.date.getMonth();
          const year = x.date.getFullYear();
          const comboNumber = +`${day}${month}${year}${index}`;

          return (
            <CustomPopover
              key={comboNumber}
              date={date}
              x={x}
              handleClick={handleClick}
              data={data}
            />
          );
        })}
      </CalendarCardGrid>
      {scModal && <Scheduler onClose={scModalClose} date={date} />}
    </CalendarCardMain>
  );
};

export default CalendarCard;
