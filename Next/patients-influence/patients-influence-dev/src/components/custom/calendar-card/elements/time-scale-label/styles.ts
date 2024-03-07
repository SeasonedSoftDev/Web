import styled from '@emotion/styled';
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';
import { Theme } from '@mui/material';
import { DTimeScaleLabelClasses } from 'components/custom/calendar-card/elements/time-scale-label/data';

export const STimeScaleLabelMain = styled(WeekView.TimeScaleLabel)<{
  theme?: Theme;
}>`
  ${({ theme }) => `
    &${DTimeScaleLabelClasses.label} {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 56px;
      ${DTimeScaleLabelClasses.labelText} {
        font-family: 'Inter', sans-serif;
        font-weight: 300;
        color: ${theme.palette.common.gray[6]};
      }
      &${DTimeScaleLabelClasses.emptyLabel} {
        height: 25px;
      }
    }
  `}
`;
