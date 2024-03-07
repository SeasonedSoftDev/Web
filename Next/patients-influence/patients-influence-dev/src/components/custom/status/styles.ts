import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { TColor } from 'components/custom/status/types';

export const StatusMain = styled.div<{ theme?: Theme; color: TColor }>`
  ${({ theme, color }) => `
    width: 100px;
    padding: 10px 10px;
    background: ${theme.palette[color].main};
    border-radius: 20px;
    color: white;
    font-size: 10px;
    text-align: center;
    `}
`;
