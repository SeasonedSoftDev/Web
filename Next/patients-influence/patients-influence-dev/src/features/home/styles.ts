import styled from '@emotion/styled';
import { Grid, Stack } from 'components/system';
import { Theme } from '@mui/material';

export const HomePageMain = styled(Stack)`
  width: 100%;
`;

export const HomePageCharts = styled.div`
  width: 100%;
`;

export const HomePageChartsLabel = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;
    font-weight: 600;
    margin-bottom: ${theme.spacing(2)};
    color: ${theme.palette.primary.main};
    font-size: 16px;
    `}
`;

export const HomePageChartsGrid = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
  display: flex;
  flex-wrap: wrap;
  // grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${theme.spacing(5)};

  ${theme.breakpoints.down('xl')} {
    grid-template-columns: 1fr 1fr;
  }
  
  ${theme.breakpoints.down('sm')} {
    grid-template-columns: 1fr;
  }
`}
`;

export const HomeInfluencerPageGrid = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: ${theme.spacing(5)};

      
      ${theme.breakpoints.down('xl')} {
        grid-template-columns: 1fr;
      }
  `}
`;

export const HomeItem = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      `}
`;
