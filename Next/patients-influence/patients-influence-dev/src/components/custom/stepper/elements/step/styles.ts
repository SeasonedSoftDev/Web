import styled from '@emotion/styled';
import { Step, Theme } from '@mui/material';

export const StepMain = styled(Step)<{ theme?: Theme }>`
  ${({ theme }) => `
  ${theme.breakpoints.down('xs')} {
    padding-left: unset;
    padding-right: unset;
  }

  & .Mui-active {
    z-index: 2;
    & svg {
      // color: #c3dbee !important;
      color: #c3dbee;
    }
  }

  & svg {
    cursor: pointer;
    color: #c3dbee;
  }
`}
`;
