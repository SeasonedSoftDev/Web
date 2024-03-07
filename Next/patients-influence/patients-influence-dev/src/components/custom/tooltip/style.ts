import styled from '@emotion/styled';
import { Theme, Tooltip } from '@mui/material';

export const TooltipMain = styled(Tooltip)<{ theme?: Theme }>`
  ${({ theme }) => `
        & .MuiTooltip-tooltip {
          background-color: #ffffff;
        }
    `}
`;
