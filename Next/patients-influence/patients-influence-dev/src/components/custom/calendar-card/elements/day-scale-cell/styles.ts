import styled from '@emotion/styled';
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';
import { Theme } from '@mui/material';
import { DDayScaleCellClasses } from 'components/custom/calendar-card/elements/day-scale-cell/data';

export const SDayScaleCellMain = styled(WeekView.DayScaleCell)<{
  startDate: Date;
  today?: boolean;
  theme?: Theme;
}>`
  ${({ theme, today }) => `
    ${DDayScaleCellClasses.dayView} {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: ${theme.spacing(2)};
        gap: ${theme.spacing(1)};
        ${DDayScaleCellClasses.dayOfWeek} {
            text-transform: uppercase;
            font-size: 10px;
            font-weight: 500;
            font-family: 'Inter', sans-serif;
            color: ${
              today ? theme.palette.primary.main : theme.palette.common.gray[6]
            };
        }
        ${DDayScaleCellClasses.dayOfMonth} {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 24px;
            font-weight: 300;
            font-family: 'Inter', sans-serif;
            background-color: ${
              today ? theme.palette.primary.main : 'transparent'
            };
            color: ${
              today ? theme.palette.common.white : theme.palette.common.gray[6]
            };
        }
    }
  `}
`;
