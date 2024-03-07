import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Card } from 'components/ui';
import { gradient } from 'utilities/style';

const sizeToWidth = {
  small: '276px',
  medium: '316px', // Add more sizes as needed
  large: '428px',
};

export const CardWithChartMain = styled(Card)<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
    // // min-width: 0;
    width: 100%;
    height: 100%;
    // max-width: 316px;
  `}
`;

export const CardWithChartText = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 100%;
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
    `}
`;

export const CardWithChartIcon = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${gradient(45, [
          theme.palette.primary.dark,
          theme.palette.secondary.light,
        ])};
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.palette.common.white};
        svg {
            display: block;
            width: 24px;
            height: 24px;
        }
        aspect-ratio: 1/1;
    `}
`;

export const CardWithChartTitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        font-size: 16px;
        font-weight: 500;
        color: ${theme.palette.primary.main};
    `}
`;

export const CardWithChartValues = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${theme.spacing(5)};
    `}
`;

export const CardWithChartCount = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        font-size: 18px;
        font-weight: 700;
        color: ${theme.palette.primary.main};
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
        svg {
          display: block;
          width: 16px;
          height: 16px;
          fill: #6D728E !important;

          path {
            fill: #6D728E !important;

          }
        }
    `}
`;

export const CardWithChartGraph = styled.div<{ theme?: Theme }>``;
