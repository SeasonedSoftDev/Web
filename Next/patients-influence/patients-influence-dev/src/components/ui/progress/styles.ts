import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { TProgressColor } from 'components/ui/progress/types';

export const ProgressMain = styled.div<{
  theme?: Theme;
  color: TProgressColor;
  percent: number;
}>`
  ${({ theme, color, percent }) => `

        position: relative;
        width: 100%;
        height: 6px;
        background-color: ${theme.palette.common.gray[1]};
        border-radius: 3px;
        overflow: hidden;

        &:before{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: ${percent}%;
            background-color: ${theme.palette[color].main};
        }

    
    `}
`;
