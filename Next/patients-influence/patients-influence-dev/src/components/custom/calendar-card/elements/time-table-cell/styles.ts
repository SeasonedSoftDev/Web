import styled from '@emotion/styled';
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';
import { DTimeTableCellClasses } from 'components/custom/calendar-card/elements/time-table-cell/data';

export const STimeTableCellMain = styled(WeekView.TimeTableCell)`
  ${({ theme }) => `
    &${DTimeTableCellClasses.cell} {
      height: 50px;
    }
    `}
`;
