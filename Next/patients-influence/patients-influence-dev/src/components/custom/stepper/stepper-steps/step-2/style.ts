import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Stack } from 'components/system';

export const StepContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: grid;
    grid-template-columns: repeat(8, 1fr);
  `}
`;

export const StepForm = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: grid;
    grid-template-columns: 1fr;
    grid-column: 1/4;
    gap: ${theme.spacing(5)};

    ${theme.breakpoints.down('xl')} {
      grid-column: 1/6;
    }

    ${theme.breakpoints.down('lg')} {
      grid-column: 1/5;
    }

    ${theme.breakpoints.down('md')} {
      grid-column: 1/6;
    }

    ${theme.breakpoints.down('sm')} {
      grid-column: 1/9;
    }
  `}
`;

export const StepStack = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('md')} {
      display: grid !important;
      grid-template-columns: 1fr;
    }
  `}
`;

export const StepText = styled.div`
  color: #7e839f;
  font-size: 12px;
`;
