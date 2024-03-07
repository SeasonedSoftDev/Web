import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const PercentIndicatorIcon = styled.svg`
  fill: currentColor;
  width: 6px;
  height: 5px;
`;

export const PercentIndicatorMain = styled.div<{
  theme?: Theme;
  percent: number;
}>`
  ${({ theme, percent }) => `
        padding: ${theme.spacing(0.25)} ${theme.spacing(2)};
        background-color: ${percent >= 0 ? '#2FD1C6' : '#E53B3B'}50;
        border-radius: 4px;
        color: ${percent >= 0 ? '#2FD1C6' : '#E53B3B'};
        display: flex;
        align-items: center;
        gap: ${theme.spacing(1)};
        ${PercentIndicatorIcon} {
            transform: rotate(${percent >= 0 ? 0 : 180}deg);
        }
    `}
`;

export const PercentIndicatorValue = styled.div`
  font-size: 14px;
  font-weight: 500;
`;
