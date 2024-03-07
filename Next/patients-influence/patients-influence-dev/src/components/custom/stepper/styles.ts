import styled from '@emotion/styled';
import {
  StepConnector,
  stepConnectorClasses,
  Stepper,
  Theme,
} from '@mui/material';
import Stack from 'components/system/stack';
import { Card } from 'components/ui';

export const StepperMain = styled(Card)<{ theme?: Theme }>`
  ${({ theme }) => `
    height: 100%;
    min-height: 80vh;

    ${theme.breakpoints.down('xl')} {
      height: 100%;
      min-height: 80vh;
    }
  `}
`;

export const StepperContainer = styled(Stepper)`
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

export const StepHelper = styled(Stack)`
  height: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StepContainer = styled.div``;

export const ButtonsMain = styled.div`
    width: 100%;
    display: flex;
    align-items center;
    justify-content: space-between;
`;

export const StepperConnector = styled(StepConnector)<{ theme?: Theme }>`
  ${({ theme }) => `
  top: 6px;
  left: calc(-50% + 11px);
  right: calc(50% + 11px);

  .${stepConnectorClasses.alternativeLabel} {
    &.${stepConnectorClasses.active} {
      .${stepConnectorClasses.line} {
    background: ${theme.palette.primary.main};
      }
    }
  }

  .${stepConnectorClasses.line} {
    border: 5px solid ${theme.palette.common.stepper};
  }

  &.${stepConnectorClasses.completed} {
    .${stepConnectorClasses.line} {
      border-color: ${theme.palette.primary.main};
    }
  }

  &.${stepConnectorClasses.active} {
    .${stepConnectorClasses.line} {
      border-color: ${theme.palette.primary.main};
    }
  }
 `}
`;

type TStepFinalProps = {
  theme?: Theme;
  status?: number;
};

export const StepFinal = styled.div<TStepFinalProps>`
  ${({ theme, status }) => `
  width: 24px;
  height: 24px;
  background: ${theme.palette.common.stepper};
  border-radius: 50px;
  padding: ${theme.spacing(0.8)};
  
  svg { 
    cursor: default;
    width: 100%;
    height: 100%;
    color: ${status && status > 4 ? '#448DC9' : 'white'} !important;
  }

  `}
`;
