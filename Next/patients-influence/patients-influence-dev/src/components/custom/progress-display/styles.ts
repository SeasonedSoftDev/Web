import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { TColor } from '../status/types';

export const ProgressDisplayMain = styled.div<{
  theme?: Theme;
  percent: number;
  color: TColor;
}>`
  ${({ theme, percent, color }) => `
        width: 100%;
        background-color:  ${theme.palette[color].light}80;
        border-radius: 4px;
        position: relative;
        padding: ${theme.spacing(3)} ${theme.spacing(3)};
        &::before {
            width: ${percent}%;
            height: 100%;
            content: '';
            border-radius: 4px;
            position: absolute;
            left: 0px;
            top: 0px;
            background-color: ${theme.palette[color].main};
        }
    `}
`;

export const ProgressDisplayLabel = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 100%;
        font-size: 14px;
        font-weight: 500;
        color: ${theme.palette.common.white};
        position: relative;
    `}
`;
