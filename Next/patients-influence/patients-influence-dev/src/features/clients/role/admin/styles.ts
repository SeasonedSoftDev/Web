import styled from '@emotion/styled';
import { Menu } from 'components/custom';
import { Theme } from '@mui/material';

export const ActionsMenu = styled(Menu)<{
  position: { right: number; top: number };
}>`
  ${({ position }) => `
      position: fixed;
      z-index: 200;
      width: 120px;
      right: ${position?.right}px;
      top: ${position?.top}px;
      `}
`;

export const ClientProfileAction = styled.div`
  cursor: pointer;
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

export const ISpan = styled.div`
  cursor: pointer;
`;

export const CardWrapper = styled.div<{
  theme?: Theme;
}>`
  ${({ theme }) => `
      width: 316px;
    `}
`;
