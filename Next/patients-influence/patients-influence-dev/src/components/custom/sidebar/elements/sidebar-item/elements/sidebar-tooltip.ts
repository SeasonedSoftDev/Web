import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const SidebarTooltipContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        background: ${theme.palette.common.white};
        padding: ${theme.spacing(5)} ${theme.spacing(5)};
        font-size: 14px;
        margin: -10px;
        color: #6D728E;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 8px;

        span {
          text-decoration: underline;
          color: #6D728E;
        }
    `}
`;
