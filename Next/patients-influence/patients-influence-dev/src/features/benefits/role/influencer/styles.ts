import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { ThumbsUpIcon } from 'components/svg';
import { Grid, Stack } from 'components/system';

export const BenefitsPageMain = styled(Stack)<{ theme?: Theme }>``;

export const BenefitsPageCharts = styled(Grid)<{ theme?: Theme }>`
  display: flex;
  width: 100%;
  overflow-x: scroll;
  padding-bottom: 20px;

  & > div {
    min-width: 165px !important;
    width: 165px !important;
  }
`;

export const BenefitsPageFilter = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
        border-radius: 4px;
        border: 1px solid ${theme.palette.common.black}20;
        padding: ${theme.spacing(5)};
    `}
`;

export const BenefitsPageFilterActions = styled(Stack)<{
  theme?: Theme;
}>`
  ${({ theme }) => `
    justify-content: flex-end;
    & > * {
      min-width: 100px;
    }

    ${theme.breakpoints.down('sm')} {
      display: grid;
      grid-template-columns: 1fr;
      gap: ${theme.spacing(5)};
    } 
`}
`;

export const BenefitsPageFilterContainer = styled.div<{ theme?: Theme }>`
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

export const TableTooltip = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        background: ${theme.palette.common.white};
        color: #4f4f4f;
        padding: ${theme.spacing(4)} ${theme.spacing(4)};
        font-size: 16px;
        margin: -10px;
        box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.45);
        border-radius: 8px;
        letter-spacing: 1px;
        white-space: normal; /* Allow wrapping */
        max-width: 500px;

        span {
          text-decoration: underline;
          color: #4f4f4f;
        }
    `}
`;

export const ISpan = styled.span`
  cursor: pointer;
`;

export const ThumbsWrapper = styled.div<{ theme?: Theme }>`
  display: flex;
  gap: 5px;
`;

export const ThumbsIcon = styled(ThumbsUpIcon)<{ active: boolean }>`
  ${({ active }) => `
    path {
      fill: ${active ? '#37428A' : '#6D728E'}
    }
`}
`;
