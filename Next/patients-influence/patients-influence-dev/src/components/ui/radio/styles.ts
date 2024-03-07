import styled from '@emotion/styled';
import { Radio, Theme } from '@mui/material';
import { TRadioColor } from 'components/ui/radio/types';
import { Label } from 'components/ui';

export const RadioMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    `}
`;

export const RadioButtonEl = styled(Radio)<{
  theme?: Theme;
  color: TRadioColor;
}>`
  ${({ theme, color }) => `
    width: 24px;
    height: 24px;
    span {
        color: ${theme.palette[color].main}30;
    }

    & :checked + span{
        transition: all 150ms ease-in-out;
        color: ${theme.palette[color].main};
        border-color: ${theme.palette[color].main};
    }
    `}
`;

export const RadioLabel = styled(Label)<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 14px;
    color: ${theme.palette.common.gray[8]};
    user-select: none;
    cursor: pointer;
  `}
`;
