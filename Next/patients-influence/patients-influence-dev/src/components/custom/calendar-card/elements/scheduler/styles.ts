import styled from '@emotion/styled';
import {
  Scheduler,
  WeekView,
} from '@devexpress/dx-react-scheduler-material-ui';

export const SSchedulerMain = styled(Scheduler)`
  ${({ theme }) => `
    .MuiTableCell-root {
        height: 100px;
    }
    `}
`;

export const SSchedulerWeekView = styled(WeekView)`
  ${({ theme }) => `
    .MuiTableCell-root {
        height: 100px;
    }
    `}
`;
