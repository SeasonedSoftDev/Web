import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Menu } from 'components/custom';
import { Stack } from 'components/system';

export const ProductInfluencersPageMain = styled(Stack)`
  width: 100%;
`;

export const ISpan = styled.div`
  cursor: pointer;
`;

export const ToBeApprovedActionsMenu = styled(Menu)<{
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

export const InfluencerNumberWrapper = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: ${theme.spacing(6)};
    height: ${theme.spacing(6)};
    margin: 0 ${theme.spacing(2.5)};
    display: grid;
    place-items: center;
    background: ${theme.palette.secondary.light}40;
    color: ${theme.palette.secondary.main};
    border-radius: 20px;
    font-size: 12.5px;
  `}
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
