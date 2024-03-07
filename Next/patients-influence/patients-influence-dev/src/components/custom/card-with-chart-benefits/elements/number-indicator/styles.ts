import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const NumberIndicatorIcon = styled.svg`
  fill: currentColor;
  width: 6px;
  height: 5px;
`;

export const NumberIndicatorMain = styled.div<{
  theme?: Theme;
  number: number;
}>`
  ${({ theme, number }) => `
        padding: ${theme.spacing(0.25)} ${theme.spacing(1)} ${theme.spacing(
    0.25
  )} ${theme.spacing(0.5)};
        background-color: ${number >= 0 ? '#2FD1C6' : '#E53B3B'}50;
        border-radius: 4px;
        color: ${number >= 0 ? '#2FD1C6' : '#E53B3B'};
        display: flex;
        align-items: center;
        gap: ${theme.spacing(0.15)};
        align-self: start;
        ${NumberIndicatorIcon} {
            transform: rotate(${number >= 0 ? 0 : 180}deg);
        }
    `}
`;

export const NumberIndicatorValue = styled.span`
  font-size: 12px;
  line-height: 15px;
  font-weight: 500;
`;
