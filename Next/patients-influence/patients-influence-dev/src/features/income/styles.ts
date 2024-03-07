import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Stack } from 'components/system';
import { Input } from 'components/ui';

export const IncomePageMain = styled(Stack)`
  width: 100%;
`;

export const IncomePageCharts = styled.div`
  width: 100%;
`;

export const IncomePageChartsGrid = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${theme.spacing(5)};
  overflow-x: auto;
  padding-bottom: 10px;

  // ${theme.breakpoints.down('xl')} {
  //   grid-template-columns: 1fr 1fr;
  // }
  // ${theme.breakpoints.down('sm')} {
  //   grid-template-columns: 1fr;
  // }
`}
`;

export const IncomePageFilter = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
        border-radius: 4px;
        border: 1px solid ${theme.palette.common.black}20;
        padding: ${theme.spacing(5)};
    `}
`;

export const IncomePageFilterContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${theme.spacing(5)};

    ${theme.breakpoints.down('xl')} {
      grid-template-columns: 1fr 1fr;
    }

    ${theme.breakpoints.down('lg')} {
      grid-template-columns: repeat(4, 1fr);
    }
    
    ${theme.breakpoints.down('lg')} {
      grid-template-columns: 1fr 1fr;
    }

    ${theme.breakpoints.down('sm')} {
      grid-template-columns: 1fr;
    }
  `}
`;

export const IncomePageFilterActions = styled(Stack)<{
  theme?: Theme;
}>`
  ${({ theme }) => `
    justify-content: flex-end;
    & > * {
      min-width: 100px;
    }

    ${theme.breakpoints.down('sm')} {
      display: grid !important;
      grid-template-columns: 1fr;
      gap: ${theme.spacing(5)};
    }
  `}
`;

export const IconBackground = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 37.5px;
    height: 37.5px;
    border-radius: 37.5px;
    background: ${theme.palette.primary.main};
    display: grid;
    place-items: center;

    * {
      fill: #fff
    }
  `}
`;

export const WithdrawContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
      display: grid;
      grid-template-columns: 1fr;
      padding-bottom: ${theme.spacing(15)};
    `}
`;

export const WithdrawGrid = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: ${theme.spacing(15)} 0;

      ${theme.breakpoints.down('xl')} {
        grid-template-columns: 1fr;
      }
      ${theme.breakpoints.down('lg')} {
        grid-template-columns: 1fr 1fr;
      }
      ${theme.breakpoints.down('md')} {
        grid-template-columns: 1fr;
      }
    `}
`;

export const WithdrawGridLeft = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        padding-right: ${theme.spacing(10)};

        ${theme.breakpoints.down('xl')} {
          padding-right: 0;
          padding-bottom: ${theme.spacing(10)};
        }
        ${theme.breakpoints.down('lg')} {
          padding-right: ${theme.spacing(10)};
          padding-bottom: 0;
        }
        ${theme.breakpoints.down('md')} {
          padding-right: 0;
          padding-bottom: ${theme.spacing(10)};
        }
    `}
`;

export const WithdrawGridRight = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        padding-left: ${theme.spacing(10)};
        border-left: 1px solid ${theme.palette.default.light};

        ${theme.breakpoints.down('xl')} {
          padding-left: 0;
          padding-top: ${theme.spacing(10)};
          border-top: 1px solid ${theme.palette.default.light};
          border-left: unset;
        }
        ${theme.breakpoints.down('lg')} {
          padding-left: ${theme.spacing(10)};
          padding-top: 0;
          border-left: 1px solid ${theme.palette.default.light};
          border-top: unset;
        }
        ${theme.breakpoints.down('md')} {
          padding-left: 0;
          padding-top: ${theme.spacing(10)};
          border-top: 1px solid ${theme.palette.default.light};
          border-left: unset;
        }
    `}
`;

export const WithdrawNameContainer = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
        ${theme.breakpoints.down('sm')} {
          display: grid !important;
          grid-template-columns: 1fr;
        }
    `}
`;

export const AmbassadorInput = styled(Input)`
  span {
    display: none !important;
  }
`;
